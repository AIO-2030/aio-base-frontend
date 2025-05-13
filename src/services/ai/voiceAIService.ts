/**
 * Voice AI service - coordinates voice processing through EMC Network or mock implementation
 */

import { toast } from "@/components/ui/use-toast";
import { processEMCVoiceData } from "./voice/emcVoiceProcessor";
import { processMockVoiceData } from "./voice/mockVoiceProcessor";
import { handleActionLLMInteraction } from './textAIService';
import { DialogAction } from "../speech/tempateconfig/dialogPromptsTemplate";

/**
 * Process voice data and get a response
 */
export async function processVoiceData(audioData: Blob, useMockApi: boolean): Promise<{ response: string, messageId: string, transcript?: string }> {
  try {
    //if (!useMockApi) {
    //  return await processEMCVoiceData(audioData);
    // }
    // If not using mock API, try using EMC network services

    try {
      // Import handleDetectIntent from textAIService
      const { handleActionLLMInteraction } = await import('./textAIService');

      // Call handleDetectIntent to get intent detection results
      const intentResponse = await handleActionLLMInteraction('', DialogAction.VOICE_SENSE);

      // Print detailed intent detection information
      console.log('[VOICE-AI] 🎯 Intent detection response:', {
        raw: intentResponse,
        parsed: JSON.parse(intentResponse)
      });
      // Use mock implementation
      return await processMockVoiceData(intentResponse);

    } catch (error) {
      console.warn('[VOICE-AI] ⚠️ EMC processing failed, using mock implementation:', error);
    }


  } catch (error) {
    console.error("[VOICE-AI] ❌ Error processing voice data:", error);
    toast({
      title: "Voice processing failed",
      description: "Could not process voice message",
      variant: "destructive"
    });
    throw error;
  }
}

// Re-export functions from submodules
export { detectLanguage } from "./voice/languageDetection";
export { fetchWithTimeout } from "./voice/networkUtils";
