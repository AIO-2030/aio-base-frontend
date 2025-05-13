
/**
 * @deprecated This service is maintained only for backward compatibility.
 * Please use the useVoiceRecorder hook for new voice recording functionality.
 */

// Import necessary dependencies
import { toast } from '@/components/ui/use-toast';

// Import audio-related functions with explicit renaming to avoid conflicts
import { 
  cleanupAudioResources as legacyCleanupAudioResources 
} from './speech/cleanup';
import {
  isVoiceRecordingActive,
  getAudioUrl,
  hasAudioData,
  setupMediaRecorder,
  startVoiceRecording,
  stopRecording,
  processAudioData,
  cleanupAudioResources as audioRecordingCleanup
} from './speech/audioRecording';

// Storage for any existing legacy audio messages
const audioCache = new Map<string, string>();

/**
 * Checks if a message has associated audio
 * @param messageId The message ID to check
 * @returns True if the message has audio, false otherwise
 */
export const hasMessageAudio = (messageId: string): boolean => {
  console.warn('Using deprecated hasMessageAudio - use useVoiceRecorder hook instead');
  
  // For backward compatibility, check if we have this message in our cache
  const hasAudio = audioCache.has(messageId);
  console.log(`[speechService] Checking audio for message ${messageId}: ${hasAudio}`);
  return hasAudio;
};

/**
 * Gets the URL for a message's audio
 * @param messageId The message ID to get audio for
 * @returns The audio URL, or null if not found
 */
export const getMessageAudioUrl = (messageId: string): string | null => {
  console.warn('Using deprecated getMessageAudioUrl - use useVoiceRecorder hook instead');
  
  // Return from cache if exists
  const audioUrl = audioCache.get(messageId) || null;
  console.log(`[speechService] Retrieved audio URL for message ${messageId}: ${audioUrl}`);
  return audioUrl;
};

/**
 * Registers a new audio URL for a message (used by new implementation to support legacy code)
 * @param messageId The message ID to associate with the audio
 * @param audioUrl The audio URL to store
 */
export const registerMessageAudio = (messageId: string, audioUrl: string): void => {
  console.log(`[speechService] Registering audio URL for message ${messageId}`);
  audioCache.set(messageId, audioUrl);
};

/**
 * Clears cached audio data for a specific message or all messages
 * @param messageId Optional message ID to clear, omit to clear all
 */
export const clearMessageAudio = (messageId?: string): void => {
  if (messageId) {
    audioCache.delete(messageId);
  } else {
    audioCache.clear();
  }
};

// Export all functions with explicit renaming to avoid conflicts
export * from './speech/audioStorage';
export { 
  legacyCleanupAudioResources as cleanupAudioResources,
  // Re-export each function from audioRecording individually
  isVoiceRecordingActive,
  getAudioUrl,
  hasAudioData,
  setupMediaRecorder,
  startVoiceRecording,
  stopRecording,
  processAudioData,
  // Use the renamed cleanup function from audioRecording to avoid conflicts
  audioRecordingCleanup
};
