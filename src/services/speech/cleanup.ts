
/**
 * @deprecated Use useVoiceRecorder hook instead
 */

import { clearMessageAudio } from '../speechService';

export const cleanupAudioResources = (): void => {
  console.warn('Using deprecated cleanupAudioResources - use useVoiceRecorder hook instead');
  // Clear any cached audio data
  clearMessageAudio();
};
