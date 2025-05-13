
/**
 * Advanced language detection functionality for voice processing
 */

/**
 * Advanced language detection with support for multiple languages
 * Uses character frequency analysis and script detection
 */
export function detectLanguage(text: string): string {
  if (!text || typeof text !== 'string' || text.trim() === '') {
    return 'Unknown (empty text)';
  }
  
  // Character ranges for different scripts
  const scriptRanges = {
    Arabic: /[\u0600-\u06FF]/,
    Bengali: /[\u0980-\u09FF]/,
    Chinese: /[\u4E00-\u9FFF\u3400-\u4DBF]/,
    Cyrillic: /[\u0400-\u04FF]/,
    Devanagari: /[\u0900-\u097F]/,  // Hindi, Sanskrit, etc.
    Greek: /[\u0370-\u03FF]/,
    Hangul: /[\uAC00-\uD7AF\u1100-\u11FF]/,  // Korean
    Hebrew: /[\u0590-\u05FF]/,
    Hiragana: /[\u3040-\u309F]/,
    Katakana: /[\u30A0-\u30FF]/,
    Latin: /[A-Za-z]/,
    Tamil: /[\u0B80-\u0BFF]/,
    Telugu: /[\u0C00-\u0C7F]/,
    Thai: /[\u0E00-\u0E7F]/
  };
  
  // Count characters in each script
  const scriptCounts: Record<string, number> = {};
  const sampleText = text.slice(0, 1000); // Analyze up to 1000 characters for efficiency
  
  for (const char of sampleText) {
    for (const [script, range] of Object.entries(scriptRanges)) {
      if (range.test(char)) {
        scriptCounts[script] = (scriptCounts[script] || 0) + 1;
      }
    }
  }
  
  // Find dominant script
  let dominantScript = 'Unknown';
  let maxCount = 0;
  
  for (const [script, count] of Object.entries(scriptCounts)) {
    if (count > maxCount) {
      maxCount = count;
      dominantScript = script;
    }
  }
  
  // Calculate script ratio (dominant script characters / total analyzed)
  const scriptRatio = maxCount / sampleText.length;
  console.log(`[VOICE-AI] 🔍 Language detection - Dominant script: ${dominantScript} (${(scriptRatio * 100).toFixed(2)}%)`);
  
  // Additional language-specific patterns for languages that share scripts
  if (dominantScript === 'Latin') {
    // Spanish characters
    if (/[áéíóúüñ¿¡]/i.test(text)) {
      const spanishMarkers = (text.match(/[áéíóúüñ¿¡]/gi) || []).length;
      // Common Spanish words
      const spanishWords = /\b(el|la|los|las|de|en|con|por|para|como|que|es|son|está|están)\b/gi;
      const spanishWordMatches = (text.match(spanishWords) || []).length;
      
      if (spanishMarkers > 5 || spanishWordMatches > 3) {
        console.log(`[VOICE-AI] 🔍 Detected Spanish markers: ${spanishMarkers}, Spanish words: ${spanishWordMatches}`);
        return 'Spanish';
      }
    }
    
    // French characters
    if (/[àâæçéèêëîïôœùûüÿ]/i.test(text)) {
      const frenchMarkers = (text.match(/[àâæçéèêëîïôœùûüÿ]/gi) || []).length;
      // Common French words
      const frenchWords = /\b(le|la|les|un|une|des|du|de|en|avec|pour|dans|sur|ce|cette|ces)\b/gi;
      const frenchWordMatches = (text.match(frenchWords) || []).length;
      
      if (frenchMarkers > 5 || frenchWordMatches > 3) {
        console.log(`[VOICE-AI] 🔍 Detected French markers: ${frenchMarkers}, French words: ${frenchWordMatches}`);
        return 'French';
      }
    }
    
    // German characters
    if (/[äöüß]/i.test(text)) {
      const germanMarkers = (text.match(/[äöüß]/gi) || []).length;
      // Common German words
      const germanWords = /\b(der|die|das|ein|eine|den|dem|zu|mit|für|auf|ist|sind)\b/gi;
      const germanWordMatches = (text.match(germanWords) || []).length;
      
      if (germanMarkers > 3 || germanWordMatches > 3) {
        console.log(`[VOICE-AI] 🔍 Detected German markers: ${germanMarkers}, German words: ${germanWordMatches}`);
        return 'German';
      }
    }
    
    // Italian
    if (/[àèéìíîòóùú]/i.test(text)) {
      // Common Italian words
      const italianWords = /\b(il|lo|la|i|gli|le|un|uno|una|di|del|della|in|con|per|è|sono)\b/gi;
      const italianWordMatches = (text.match(italianWords) || []).length;
      
      if (italianWordMatches > 3) {
        console.log(`[VOICE-AI] 🔍 Detected Italian words: ${italianWordMatches}`);
        return 'Italian';
      }
    }
    
    // Portuguese
    if (/[áâãàçéêíóôõú]/i.test(text)) {
      // Common Portuguese words
      const portugueseWords = /\b(o|a|os|as|um|uma|de|da|do|em|no|na|por|para|com|é|são)\b/gi;
      const portugueseWordMatches = (text.match(portugueseWords) || []).length;
      
      if (portugueseWordMatches > 3) {
        console.log(`[VOICE-AI] 🔍 Detected Portuguese words: ${portugueseWordMatches}`);
        return 'Portuguese';
      }
    }
    
    // Default to English for Latin script if no other language was detected
    return 'English';
  }
  
  // Map script to language
  const scriptToLanguage: Record<string, string> = {
    Arabic: 'Arabic',
    Bengali: 'Bengali',
    Chinese: 'Chinese',
    Cyrillic: 'Russian', // Could be other Slavic languages
    Devanagari: 'Hindi',
    Greek: 'Greek',
    Hangul: 'Korean',
    Hebrew: 'Hebrew',
    Hiragana: 'Japanese',
    Katakana: 'Japanese',
    Tamil: 'Tamil',
    Telugu: 'Telugu',
    Thai: 'Thai'
  };
  
  // Japanese often uses a mix of scripts
  if ((scriptCounts['Hiragana'] || 0) > 0 && (scriptCounts['Katakana'] || 0) > 0) {
    return 'Japanese';
  }
  
  // If we have a reliable script detection and a corresponding language
  if (scriptRatio > 0.1 && scriptToLanguage[dominantScript]) {
    return scriptToLanguage[dominantScript];
  }
  
  // Log detailed script analysis for debugging
  console.log(`[VOICE-AI] 🔍 Script counts:`, scriptCounts);
  console.log(`[VOICE-AI] 🔍 Script ratio: ${(scriptRatio * 100).toFixed(2)}%`);
  
  return dominantScript !== 'Unknown' 
    ? `${scriptToLanguage[dominantScript] || dominantScript} (detected)`
    : 'Unknown language';
}
