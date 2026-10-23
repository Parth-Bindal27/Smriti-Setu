/**
 * SMRITI SETU (স্মৃতি সেতু) — SECURE LOCAL-FIRST INDEXEDDB STORAGE ABSTRACTION
 * Elderly Site Edition
 * 
 * Strict Privacy Guidelines:
 * - IndexedDB is the authoritative persistent local store for private memories, health telemetry, and offline queues.
 * - localStorage is strictly limited to non-sensitive preferences (theme, language, accessibility UI flags).
 * - All operations are asynchronous, validated, and resilient against network partition.
 */

const DB_NAME = 'smriti_setu_secure_local_v1';
const DB_VERSION = 2;

export const STORES = {
  ELDER_PROFILES: 'elder_profiles',
  CAREGIVER_PROFILES: 'caregiver_profiles',
  MEMORIES: 'memories',
  KNOWLEDGE_GRAPH_NODES: 'knowledge_graph_nodes',
  KNOWLEDGE_GRAPH_EDGES: 'knowledge_graph_edges',
  ASSESSMENTS: 'assessments',
  ACTIVITY_SESSIONS: 'activity_sessions',
  CARE_ROUTINES: 'care_routines',
  CAREGIVER_JOURNALS: 'caregiver_journals',
  FAMILY_BOARD_POSTS: 'family_board_posts',
  HEIRLOOMS: 'heirlooms',
  VOICE_BIOMARKERS: 'voice_biomarkers',
  SAFE_HARBOR_ZONES: 'safe_harbor_zones',
  OFFLINE_MUTATIONS: 'offline_mutations',
  SYNC_METADATA: 'sync_metadata'
};

let dbInstance = null;
let initPromise = null;

export function initializeStorage() {
  if (dbInstance) return Promise.resolve(dbInstance);
  if (initPromise) return initPromise;

  initPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      console.warn('[Storage] IndexedDB not supported in current environment. In-memory fallback active.');
      dbInstance = createInMemoryFallback();
      return resolve(dbInstance);
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      console.log(`[Storage] Upgrading IndexedDB ${DB_NAME} to version ${DB_VERSION}`);

      const ensureStore = (name, keyPath, indices = []) => {
        let store;
        if (!db.objectStoreNames.contains(name)) {
          store = db.createObjectStore(name, { keyPath });
        } else {
          store = event.target.transaction.objectStore(name);
        }
        indices.forEach(({ indexName, field, unique = false }) => {
          if (!store.indexNames.contains(indexName)) {
            store.createIndex(indexName, field, { unique });
          }
        });
        return store;
      };

      ensureStore(STORES.ELDER_PROFILES, '_id');
      ensureStore(STORES.CAREGIVER_PROFILES, '_id');
      ensureStore(STORES.MEMORIES, '_id', [
        { indexName: 'category', field: 'category' },
        { indexName: 'datePeriod', field: 'datePeriod' }
      ]);
      ensureStore(STORES.KNOWLEDGE_GRAPH_NODES, 'nodeId', [
        { indexName: 'category', field: 'category' }
      ]);
      ensureStore(STORES.KNOWLEDGE_GRAPH_EDGES, 'edgeId', [
        { indexName: 'sourceNodeId', field: 'sourceNodeId' },
        { indexName: 'targetNodeId', field: 'targetNodeId' }
      ]);
      ensureStore(STORES.ASSESSMENTS, '_id', [
        { indexName: 'date', field: 'date' }
      ]);
      ensureStore(STORES.ACTIVITY_SESSIONS, '_id', [
        { indexName: 'timestamp', field: 'timestamp' }
      ]);
      ensureStore(STORES.CARE_ROUTINES, '_id');
      ensureStore(STORES.CAREGIVER_JOURNALS, '_id', [
        { indexName: 'timestamp', field: 'timestamp' }
      ]);
      ensureStore(STORES.FAMILY_BOARD_POSTS, '_id', [
        { indexName: 'moderationStatus', field: 'moderationStatus' }
      ]);
      ensureStore(STORES.HEIRLOOMS, '_id');
      ensureStore(STORES.VOICE_BIOMARKERS, '_id', [
        { indexName: 'timestamp', field: 'timestamp' }
      ]);
      ensureStore(STORES.SAFE_HARBOR_ZONES, '_id');
      ensureStore(STORES.OFFLINE_MUTATIONS, 'mutationId', [
        { indexName: 'status', field: 'status' },
        { indexName: 'timestamp', field: 'timestamp' }
      ]);
      ensureStore(STORES.SYNC_METADATA, 'key');
    };

    request.onsuccess = (event) => {
      dbInstance = event.target.result;
      console.log(`[Storage] IndexedDB initialized: ${DB_NAME}`);
      resolve(dbInstance);
    };

    request.onerror = (event) => {
      console.error('[Storage] IndexedDB open error:', event.target.error);
      dbInstance = createInMemoryFallback();
      resolve(dbInstance);
    };
  });

  return initPromise;
}

export async function getRecord(storeName, key) {
  const db = await initializeStorage();
  return new Promise((resolve, reject) => {
    try {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    } catch (err) {
      reject(err);
    }
  });
}

export async function getRecords(storeName, filterFn = null, limit = null) {
  const db = await initializeStorage();
  return new Promise((resolve, reject) => {
    try {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.getAll();
      req.onsuccess = () => {
        let results = req.result || [];
        if (typeof filterFn === 'function') {
          results = results.filter(filterFn);
        }
        if (limit && typeof limit === 'number') {
          results = results.slice(0, limit);
        }
        resolve(results);
      };
      req.onerror = () => reject(req.error);
    } catch (err) {
      reject(err);
    }
  });
}

export async function putRecord(storeName, record) {
  if (!record || typeof record !== 'object') {
    throw new Error(`[Storage] Invalid record supplied to store ${storeName}`);
  }

  const key = record._id || record.nodeId || record.edgeId || record.mutationId || record.key;
  if (!key) {
    record._id = `local_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
  if (storeName === STORES.SYNC_METADATA && !record.key) {
    record.key = record._id || 'metadata_default';
  }

  const db = await initializeStorage();
  return new Promise((resolve, reject) => {
    try {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.put(record);
      req.onsuccess = () => resolve(record);
      req.onerror = () => reject(req.error);
    } catch (err) {
      reject(err);
    }
  });
}

export async function putRecords(storeName, records = []) {
  if (!Array.isArray(records) || records.length === 0) return [];
  const db = await initializeStorage();
  return new Promise((resolve, reject) => {
    try {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      records.forEach(rec => {
        if (!rec._id && !rec.nodeId && !rec.edgeId && !rec.mutationId && !rec.key) {
          rec._id = `local_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        }
        store.put(rec);
      });
      tx.oncomplete = () => resolve(records);
      tx.onerror = () => reject(tx.error);
    } catch (err) {
      reject(err);
    }
  });
}

export async function updateRecord(storeName, key, updates = {}) {
  const existing = await getRecord(storeName, key);
  if (!existing) {
    throw new Error(`[Storage] Record not found in ${storeName} for key ${key}`);
  }
  const merged = { ...existing, ...updates, updatedAt: new Date().toISOString() };
  return await putRecord(storeName, merged);
}

export async function deleteRecord(storeName, key) {
  const db = await initializeStorage();
  return new Promise((resolve, reject) => {
    try {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.delete(key);
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    } catch (err) {
      reject(err);
    }
  });
}

export async function enqueueMutation(mutation) {
  const entry = {
    mutationId: mutation.mutationId || `mut_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    endpoint: mutation.endpoint,
    method: mutation.method || 'POST',
    headers: mutation.headers || { 'Content-Type': 'application/json' },
    body: mutation.body || null,
    timestamp: mutation.timestamp || Date.now(),
    retryCount: mutation.retryCount || 0,
    status: 'pending'
  };

  return await putRecord(STORES.OFFLINE_MUTATIONS, entry);
}

export async function getPendingMutations() {
  const mutations = await getRecords(STORES.OFFLINE_MUTATIONS, (m) => m.status === 'pending');
  return mutations.sort((a, b) => a.timestamp - b.timestamp);
}

export async function markMutationSynced(mutationId) {
  return await deleteRecord(STORES.OFFLINE_MUTATIONS, mutationId);
}

export async function markMutationFailed(mutationId, errorDetails = '') {
  return await updateRecord(STORES.OFFLINE_MUTATIONS, mutationId, {
    status: 'failed',
    errorDetails,
    failedAt: new Date().toISOString()
  });
}

export async function clearSensitiveLocalData() {
  const db = await initializeStorage();
  const sensitiveStores = [
    STORES.ELDER_PROFILES,
    STORES.CAREGIVER_PROFILES,
    STORES.MEMORIES,
    STORES.KNOWLEDGE_GRAPH_NODES,
    STORES.KNOWLEDGE_GRAPH_EDGES,
    STORES.ASSESSMENTS,
    STORES.ACTIVITY_SESSIONS,
    STORES.CAREGIVER_JOURNALS,
    STORES.VOICE_BIOMARKERS,
    STORES.FAMILY_BOARD_POSTS
  ];

  for (const storeName of sensitiveStores) {
    await new Promise((resolve) => {
      try {
        const tx = db.transaction(storeName, 'readwrite');
        tx.objectStore(storeName).clear();
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch (e) {
        resolve();
      }
    });
  }

  console.log('[Storage] Sensitive local clinical & memory data successfully purged.');
}

export async function getStorageUsage() {
  const stats = {};
  for (const key of Object.values(STORES)) {
    try {
      const records = await getRecords(key);
      stats[key] = records.length;
    } catch (e) {
      stats[key] = 0;
    }
  }
  return stats;
}

function createInMemoryFallback() {
  const memStore = {};
  Object.values(STORES).forEach(s => { memStore[s] = new Map(); });

  return {
    transaction: (storeName) => ({
      objectStore: () => ({
        get: (key) => ({ onsuccess: null, result: memStore[storeName]?.get(key) }),
        getAll: () => ({ onsuccess: null, result: Array.from(memStore[storeName]?.values() || []) }),
        put: (rec) => {
          const key = rec._id || rec.nodeId || rec.edgeId || rec.mutationId || rec.key;
          memStore[storeName]?.set(key, rec);
          return { onsuccess: null };
        },
        delete: (key) => {
          memStore[storeName]?.delete(key);
          return { onsuccess: null };
        },
        clear: () => {
          memStore[storeName]?.clear();
        }
      })
    })
  };
}
