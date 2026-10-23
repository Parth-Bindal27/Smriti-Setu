/**
 * Voice Engine: Immediate Cancel, Locale Binding & Safe Fallbacks
 * Establishes selectedLanguage as the authoritative controller for TTS playback.
 */

export const LOCALE_MAP = {
  en: { primary: 'en-IN', fallbacks: ['en-GB', 'en-US'] },
  bn: { primary: 'bn-IN', fallbacks: ['bn-BD', 'hi-IN'] },
  as: { primary: 'as-IN', fallbacks: ['bn-IN', 'hi-IN'] }, // Assamese phonetics align closely with Bengali voices if native 'as' is absent
  ne: { primary: 'ne-NP', fallbacks: ['ne-IN', 'hi-IN'] }, // Devanagari phonetics read reliably through Hindi voices
  hi: { primary: 'hi-IN', fallbacks: ['hi', 'en-IN'] }
};

/**
 * Transliterates Bengali / Assamese Unicode characters (0x0980-0x09FF) to Devanagari (0x0900-0x097F)
 * when falling back to a Hindi TTS voice (e.g. macOS Lekha).
 * Also strips punctuation like '?' and '।' so Hindi TTS does not pronounce 'प्रश्न चिह्न' ('prashan chihn').
 */
export function prepareTextForTTS(text, lang, isHindiVoice = false) {
  if (!text) return '';

  // 1. Remove parenthesized English guides like "(Bihu Dhol)" or "(Loktak Lake)" for fluent local speech
  let cleaned = text.replace(/\s*\([A-Za-z0-9\s—–-]+\)/g, '');

  // 2. Strip question marks and literal punctuation that cause Hindi/Indian TTS to read "prashan chihn"
  cleaned = cleaned.replace(/[?？¿]/g, ' ');
  cleaned = cleaned.replace(/[।|!]/g, ', ');
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  // 3. If using Hindi voice fallback for Bengali or Assamese, transliterate codepoints
  if (isHindiVoice && (lang === 'bn' || lang === 'as')) {
    const devanagariChars = [];
    for (let i = 0; i < cleaned.length; i++) {
      const char = cleaned[i];
      const code = char.charCodeAt(0);

      if (char === 'ৰ') {
        devanagariChars.push('र');
      } else if (char === 'ৱ') {
        devanagariChars.push('व');
      } else if (char === 'ৎ') {
        devanagariChars.push('त्');
      } else if (code >= 0x0980 && code <= 0x09ff) {
        const devCode = code - 0x80;
        if (devCode >= 0x0900 && devCode <= 0x097f) {
          devanagariChars.push(String.fromCharCode(devCode));
        } else {
          devanagariChars.push(char);
        }
      } else {
        devanagariChars.push(char);
      }
    }
    cleaned = devanagariChars.join('');
  }

  return cleaned;
}

export class SpeechService {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.currentUtterance = null;
    this._isSpeaking = false;
    this._listeners = new Set();
    this._activeUtterances = []; // Prevent browser garbage collection from cutting off speech mid-sentence
  }

  get isSpeaking() {
    return this._isSpeaking || !!(this.synth && (this.synth.speaking || this.synth.pending));
  }

  subscribe(listener) {
    this._listeners.add(listener);
    return () => this._listeners.delete(listener);
  }

  _notify(speaking) {
    this._isSpeaking = speaking;
    this._listeners.forEach(fn => {
      try { fn(speaking); } catch (e) { console.warn(e); }
    });
  }

  stop() {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {
        console.warn('Speech cancellation notice:', e);
      }
    }
    this._activeUtterances = [];
    this._notify(false);
  }

  speak(text, lang = 'en', rate = 0.85, callbacks = {}) {
    if (!this.synth || !text) return;

    // Immediately halt previous speech on language change or action
    this.stop();

    const config = LOCALE_MAP[lang] || LOCALE_MAP.en;
    const availableVoices = this.synth.getVoices ? this.synth.getVoices() : [];

    const matchedVoice =
      availableVoices.find(v => v.lang === config.primary || v.lang.replace('_', '-') === config.primary) ||
      availableVoices.find(v => config.fallbacks.includes(v.lang) || config.fallbacks.includes(v.lang.replace('_', '-'))) ||
      availableVoices.find(v => {
        const vl = v.lang.toLowerCase();
        if (lang === 'bn' && (vl.includes('bn') || vl.includes('bengali'))) return true;
        if (lang === 'as' && (vl.includes('as') || vl.includes('assamese') || vl.includes('bn') || vl.includes('hi'))) return true;
        if (lang === 'ne' && (vl.includes('ne') || vl.includes('nepali') || vl.includes('hi'))) return true;
        return false;
      }) ||
      null;

    const isHindiVoice = !!(
      matchedVoice &&
      (matchedVoice.lang.toLowerCase().includes('hi') || matchedVoice.name.toLowerCase().includes('lekha') || matchedVoice.name.toLowerCase().includes('hindi'))
    ) || (lang === 'as' && (!matchedVoice || !matchedVoice.lang.toLowerCase().includes('as')));

    // Clean & normalize text to guarantee no 'prashan chihn' and fluent phonetics
    const spokenText = prepareTextForTTS(text, lang, isHindiVoice);
    if (!spokenText) return;

    const utterance = new SpeechSynthesisUtterance(spokenText);
    utterance.rate = rate; // Slightly slower pacing tailored for elderly listeners
    utterance.pitch = 1.0;

    if (matchedVoice) {
      utterance.voice = matchedVoice;
      utterance.lang = matchedVoice.lang;
    } else {
      utterance.lang = isHindiVoice ? 'hi-IN' : config.primary;
    }

    utterance.onstart = () => {
      this._notify(true);
      if (callbacks.onStart) callbacks.onStart();
    };

    utterance.onend = () => {
      this._activeUtterances = this._activeUtterances.filter(u => u !== utterance);
      this._notify(false);
      if (callbacks.onEnd) callbacks.onEnd();
    };

    utterance.onerror = (e) => {
      this._activeUtterances = this._activeUtterances.filter(u => u !== utterance);
      this._notify(false);
      if (callbacks.onError) callbacks.onError(e);
    };

    this.currentUtterance = utterance;
    this._lastText = text;
    this._lastLang = lang;
    this._lastRate = rate;
    this._activeUtterances.push(utterance);
    this.synth.speak(utterance);
  }

  pause() {
    if (this.synth && this.synth.speaking && !this.synth.paused) {
      try {
        this.synth.pause();
        this._notify(false);
      } catch (e) {
        console.warn('Speech pause notice:', e);
      }
    }
  }

  resume() {
    if (this.synth && this.synth.paused) {
      try {
        this.synth.resume();
        this._notify(true);
      } catch (e) {
        console.warn('Speech resume notice:', e);
      }
    }
  }

  replay(callbacks = {}) {
    if (this._lastText) {
      this.speak(this._lastText, this._lastLang || 'en', this._lastRate || 0.85, callbacks);
    }
  }

  /**
   * Safe, Non-Punitive Speech-to-Text via Web Speech API
   * Does NOT continuously record in the background.
   * Isolates recognition errors from cognitive assessments.
   */
  startRecognition({ lang = 'as', onResult, onError, onEnd }) {
    const SpeechRecognition = typeof window !== 'undefined'
      ? (window.SpeechRecognition || window.webkitSpeechRecognition)
      : null;

    if (!SpeechRecognition) {
      if (onError) onError({ code: 'not_supported', message: 'Speech recognition is not available in this browser.' });
      return () => {};
    }

    try {
      const recognition = new SpeechRecognition();
      const localeConfig = LOCALE_MAP[lang] || LOCALE_MAP.en;
      recognition.lang = localeConfig.primary;
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      let recognized = false;

      recognition.onresult = (event) => {
        recognized = true;
        const transcript = event.results[0][0].transcript;
        if (onResult) onResult(transcript);
      };

      recognition.onerror = (event) => {
        // Isolate microphone / silence errors from cognitive performance
        if (onError) onError({ code: event.error || 'recognition_error', isCognitiveDecline: false });
      };

      recognition.onend = () => {
        if (!recognized && onResult) {
          // No text heard, graceful completion
        }
        if (onEnd) onEnd();
      };

      recognition.start();

      return () => {
        try { recognition.abort(); } catch (e) {}
      };
    } catch (err) {
      if (onError) onError({ code: 'init_failed', message: err.message, isCognitiveDecline: false });
      return () => {};
    }
  }
}

export const speechService = new SpeechService();

/**
 * Dynamic LLM Prompt Construction for Generative Memory Content
 */
export function buildMemoryPrompt(patientName, relation, visitor, lang) {
  const languageNames = {
    as: "Assamese (অসমীয়া)",
    bn: "Bengali (বাংলা)",
    ne: "Nepali (नेपाली)",
    en: "Indian English"
  };

  const selectedTarget = languageNames[lang] || languageNames.en;

  return `
You are generating conversational memory prompts for an elderly user named ${patientName}.
Target Language: ${selectedTarget}.

CRITICAL INSTRUCTIONS:
1. OUTPUT ENTIRELY IN ${selectedTarget.toUpperCase()}. No English words, transliterations, or bilingual mixing except proper personal names.
2. Tone: Warm, respectful, simple, and comforting (appropriate for addressing an elder/grandparent).
3. Do not use complex compound words or formal literary grammar. Use simple spoken phrasing suitable for text-to-speech.

Return JSON format:
{
  "question": "<spoken question>",
  "clue": "<gentle hint about the visitor>",
  "story": "<a short 2-sentence warm memory about this person>"
}`;
}
