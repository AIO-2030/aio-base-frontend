
/**
 * MIME type utilities for audio conversion
 */

/**
 * Finds a supported MIME type for MP3 recording
 * @returns The best supported MIME type for MP3 recording
 */
export function findSupportedMp3MimeType(): string {
  const preferredMimeTypes = ['audio/mpeg', 'audio/mp3', 'audio/mp4', 'audio/webm;codecs=mp3'];
  
  for (const mimeType of preferredMimeTypes) {
    if (MediaRecorder.isTypeSupported(mimeType)) {
      return mimeType;
    }
  }
  
  // Fallback to a general audio type if none of the MP3 types are supported
  return 'audio/webm';
}

/**
 * Checks if the blob is already in MP3 format
 * @param audioBlob Audio blob to check
 * @returns True if already in MP3 format
 */
export function isAlreadyMp3(audioBlob: Blob): boolean {
  return audioBlob.type === 'audio/mpeg' || audioBlob.type === 'audio/mp3';
}
