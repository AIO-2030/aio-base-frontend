
/**
 * @deprecated This module is maintained only for backward compatibility.
 * Please use the useVoiceRecorder hook for new voice recording functionality.
 */

/**
 * Stores audio data for a specific message
 * @param messageId The message ID to associate with the audio
 * @param audioBlob The audio data to store
 */
export const storeAudioForMessage = async (messageId: string, audioBlob: Blob): Promise<void> => {
  console.warn('Using deprecated storeAudioForMessage - use useVoiceRecorder hook instead');
  // No-op implementation as we're migrating away from this system
};

/**
 * Retrieves audio data for a specific message
 * @param messageId The message ID to get audio for
 * @returns The audio blob, or null if not found
 */
export const getAudioForMessage = async (messageId: string): Promise<Blob | null> => {
  console.warn('Using deprecated getAudioForMessage - use useVoiceRecorder hook instead');
  return null; // Always return null since we're migrating away from this system
};
