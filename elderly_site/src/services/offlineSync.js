/**
 * SMRITI SETU (স্মৃতি সেতু) — OFFLINE SYNCHRONIZATION MANAGER
 * Elderly Site Edition
 */

import {
  getPendingMutations,
  markMutationSynced,
  markMutationFailed,
  putRecord,
  putRecords,
  getRecords,
  getRecord,
  STORES
} from './storage';

let isSyncing = false;
const syncListeners = new Set();

export function subscribeToSyncStatus(listener) {
  syncListeners.add(listener);
  return () => syncListeners.delete(listener);
}

function notifySyncStatus(status) {
  syncListeners.forEach(fn => {
    try { fn(status); } catch (e) {}
  });
}

export async function drainPendingMutations(apiUrl = '') {
  if (isSyncing) return { success: false, reason: 'Sync already in progress' };
  isSyncing = true;
  notifySyncStatus({ syncing: true, count: 0 });

  const pending = await getPendingMutations();
  let syncedCount = 0;
  let failedCount = 0;

  console.log(`[OfflineSync] Processing ${pending.length} pending mutations...`);

  for (const mutation of pending) {
    try {
      const url = mutation.endpoint.startsWith('http')
        ? mutation.endpoint
        : `${apiUrl}${mutation.endpoint}`;

      const res = await fetch(url, {
        method: mutation.method || 'POST',
        headers: mutation.headers || { 'Content-Type': 'application/json' },
        body: mutation.body ? JSON.stringify(mutation.body) : undefined
      });

      if (res.ok) {
        await markMutationSynced(mutation.mutationId);
        syncedCount++;
      } else {
        const errText = await res.text().catch(() => res.statusText);
        console.warn(`[OfflineSync] Mutation ${mutation.mutationId} rejected by server:`, errText);
        if (mutation.retryCount >= 3) {
          await markMutationFailed(mutation.mutationId, `Max retries exceeded: ${errText}`);
          failedCount++;
        } else {
          mutation.retryCount = (mutation.retryCount || 0) + 1;
        }
      }
    } catch (networkErr) {
      console.warn(`[OfflineSync] Network error during drain, aborting cycle:`, networkErr.message);
      break;
    }
  }

  isSyncing = false;
  notifySyncStatus({ syncing: false, syncedCount, failedCount });

  return { success: true, syncedCount, failedCount };
}

export async function fetchWithLocalFallback(endpoint, storeName, apiUrl = '') {
  const fullUrl = endpoint.startsWith('http') ? endpoint : `${apiUrl}${endpoint}`;

  try {
    const res = await fetch(fullUrl, { cache: 'no-cache' });
    if (res.ok) {
      const data = await res.json();
      
      try {
        if (Array.isArray(data)) {
          await putRecords(storeName, data);
        } else if (data && typeof data === 'object') {
          const records = data.memories || data.entries || data.zones || data.posts || data.heirlooms || data.presences;
          if (Array.isArray(records)) {
            await putRecords(storeName, records);
          } else {
            await putRecord(storeName, data);
          }
        }
      } catch (cacheErr) {
        console.warn(`[OfflineSync] Local cache write notice for ${storeName}:`, cacheErr.message);
      }

      return { data, isFromCache: false, isOffline: false };
    }
  } catch (netErr) {
    console.warn(`[OfflineSync] Network request failed for ${endpoint}. Retrieving from IndexedDB cache...`);
  }

  try {
    const cached = await getRecords(storeName);
    if (cached && cached.length > 0) {
      return { data: cached, isFromCache: true, isOffline: true };
    }
  } catch (idbErr) {
    console.warn(`[OfflineSync] Local cache read error:`, idbErr.message);
  }

  return { data: null, isFromCache: false, isOffline: true };
}

export function initializeNetworkListeners(apiUrl = '') {
  if (typeof window === 'undefined') return;

  window.addEventListener('online', () => {
    console.log('[OfflineSync] Browser is ONLINE. Starting mutation sync...');
    drainPendingMutations(apiUrl);
  });

  window.addEventListener('offline', () => {
    console.warn('[OfflineSync] Browser went OFFLINE. All operations will persist to local IndexedDB.');
  });
}
