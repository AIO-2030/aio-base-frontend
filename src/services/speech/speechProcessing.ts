
// Speech processing functionality - Simplified for react-media-recorder integration
import { generateLLMResponse } from '../apiService';
import { storeAudioForMessage } from './audioStorage';

/**
 * @deprecated Use useVoiceRecorder hook for voice recording functionality
 */
export const stopVoiceRecording = async (): Promise<{ response: string, messageId: string }> => {
  try {
    console.log("[SPEECH-PROCESSING] ⚠️ Using deprecated stopVoiceRecording - use useVoiceRecorder hook instead");
    
    // Generate a message ID for this recording
    const messageId = Date.now().toString();
    
    // Mock processing delay (1.5 seconds)
    console.log("[SPEECH-PROCESSING] ⏱️ Processing voice with delay...");
    return new Promise((resolveInner) => {
      setTimeout(async () => {
        // Instead of returning a transcription, we'll simulate the voice 
        // being directly processed by the LLM
        
        // In a real implementation, we would:
        // 1. Send the audio to a speech-to-text service
        // 2. Take the transcribed text and send it to the LLM
        
        // For now, we'll just simulate an LLM response directly
        const mockModelId = "palm"; // Using one of our mock models
        const directResponse = await generateLLMResponse(
          mockModelId, 
          "Voice input processed directly"
        );
        
        console.log("[SPEECH-PROCESSING] ✅ Generated response for voice message");
        
        resolveInner({
          response: directResponse,
          messageId: messageId
        });
      }, 1500);
    });
  } catch (error) {
    console.error("[SPEECH-PROCESSING] ❌ Error in stopVoiceRecording:", error);
    throw error;
  }
};
