
import { toast } from "@/components/ui/use-toast";

// EMC Network endpoints for audio transcription
const EMC_ENDPOINTS = [
  "http://18.167.51.1:40005/edge/16Uiu2HAmQnkL58V215wZUDCLBTxeUQZeCXUwzPZKLAQKyvBQ7c3a/8003/extract_text",
  "http://18.167.51.1:40005/edge/16Uiu2HAmQnkL58V215wZUDCLBTxeUQZeCXUwzPZKLAQKyvBQ7c3a/8004/extract_text"
];

// API key for EMC Network
const EMC_API_KEY = "833_txLiSbJibu160317539183112192";

// Request timeout (ms)
const REQUEST_TIMEOUT = 15000;

/**
 * Process voice data and get a response
 */
export async function processVoiceData(audioData: Blob, useMockApi: boolean): Promise<{ response: string, messageId: string, transcript?: string }> {
  try {
    if (!useMockApi) {
      console.log(`[VOICE-AI] 🎤 Processing voice data with EMC Network`);
      console.log(`[VOICE-AI] 📊 Audio data size: ${(audioData.size / 1024).toFixed(2)} KB`);
      console.log(`[VOICE-AI] 🔍 Audio type: ${audioData.type}`);
      
      // Convert audio to correct format if needed
      let audioToSend = audioData;
      
      // Some browsers might record in webm, but we need mp3 or wav
      // If we need to convert, we would do it here (using Web Audio API)
      
      // Create FormData for the API request
      const formData = new FormData();
      formData.append('file', audioToSend, 'recording.webm');
      console.log(`[VOICE-AI] 📦 FormData created with file named 'recording.webm'`);
      
      // Try each EMC endpoint for voice transcription
      let transcript = null;
      let lastError = null;
      
      console.log(`[VOICE-AI] 🔄 Will try ${EMC_ENDPOINTS.length} endpoints for transcription`);
      
      for (let i = 0; i < EMC_ENDPOINTS.length; i++) {
        const endpoint = EMC_ENDPOINTS[i];
        try {
          console.log(`[VOICE-AI] 🔍 Trying EMC endpoint ${i + 1}/${EMC_ENDPOINTS.length}: ${endpoint}`);
          console.log(`[VOICE-AI] ⏱️ Setting timeout to ${REQUEST_TIMEOUT}ms`);
          
          // Log start time for performance measurement
          const startTime = performance.now();
          
          // Call EMC Network API with timeout
          const response = await fetchWithTimeout(
            endpoint,
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${EMC_API_KEY}`
              },
              body: formData
            },
            REQUEST_TIMEOUT
          );
          
          // Calculate response time
          const responseTime = (performance.now() - startTime).toFixed(2);
          console.log(`[VOICE-AI] ⏱️ EMC endpoint ${i + 1} responded in ${responseTime}ms`);
          
          if (!response.ok) {
            const errorText = await response.text();
            console.error(`[VOICE-AI] ❌ EMC endpoint ${i + 1} failed with status ${response.status}:`, errorText);
            throw new Error(`EMC Network error: ${response.statusText}`);
          }
          
          console.log(`[VOICE-AI] 📥 Received response from EMC endpoint ${i + 1}`);
          
          // Parse the response
          const data = await response.json();
          console.log(`[VOICE-AI] 🧩 Response structure:`, Object.keys(data));
          
          // Extract transcript from response
          transcript = data.text || data.transcript || data.result;
          
          if (!transcript) {
            console.error(`[VOICE-AI] ⚠️ Invalid response format from EMC Network:`, data);
            throw new Error("Invalid response format from EMC Network");
          }
          
          console.log(`[VOICE-AI] ✅ Voice transcription successful. Length: ${transcript.length} chars`);
          console.log(`[VOICE-AI] 📝 Transcript: "${transcript.substring(0, 100)}${transcript.length > 100 ? '...' : ''}"`);
          break; // Exit the loop if successful
        } catch (error) {
          console.warn(`[VOICE-AI] ⚠️ EMC endpoint ${i + 1} failed:`, error);
          lastError = error;
          // Continue to the next endpoint
        }
      }
      
      if (!transcript) {
        console.error(`[VOICE-AI] ❌ All EMC Network endpoints failed`);
        throw lastError || new Error("All EMC Network endpoints failed");
      }
      
      // Now get AI response based on the transcription
      console.log(`[VOICE-AI] 🤖 Generating AI response based on transcript`);
      // We'll use our existing AI services for the response generation
      const { generateRealAIResponse } = await import("./openAIService");
      const startResponseTime = performance.now();
      const response = await generateRealAIResponse(transcript);
      const aiResponseTime = (performance.now() - startResponseTime).toFixed(2);
      
      console.log(`[VOICE-AI] ⏱️ AI response generated in ${aiResponseTime}ms`);
      console.log(`[VOICE-AI] 📏 AI response length: ${response.length} chars`);
      
      const messageId = Date.now().toString();
      console.log(`[VOICE-AI] 🆔 Generated message ID: ${messageId}`);
      
      return {
        response,
        messageId,
        transcript
      };
    }
    
    // Mock implementation
    console.log("[VOICE-AI] 🔍 Using mock implementation for voice processing");
    
    // Simulate processing time
    console.log("[VOICE-AI] ⏱️ Simulating processing delay (1500ms)");
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate a random message ID
    const messageId = Date.now().toString();
    console.log(`[VOICE-AI] 🆔 Generated mock message ID: ${messageId}`);
    
    // Generate mock transcript and response
    const mockTranscript = "This is a simulated transcription of voice input.";
    const response = "I've processed your voice message. This is a simulated response since we're using the mock API. In a production environment, your voice would be transcribed by EMC Network.";
    
    console.log(`[VOICE-AI] 📝 Mock transcript: "${mockTranscript}"`);
    console.log(`[VOICE-AI] 🤖 Mock response generated`);
    
    return { 
      response, 
      messageId,
      transcript: mockTranscript 
    };
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

/**
 * Helper function to fetch with timeout
 */
async function fetchWithTimeout(url: string, options: RequestInit, timeout: number): Promise<Response> {
  const controller = new AbortController();
  const { signal } = controller;
  
  console.log(`[VOICE-AI] 🔄 Setting up fetch with URL: ${url}`);
  console.log(`[VOICE-AI] ⏱️ Timeout set to: ${timeout}ms`);
  
  const timeoutId = setTimeout(() => {
    console.log(`[VOICE-AI] ⏱️ Request timed out after ${timeout}ms`);
    controller.abort();
  }, timeout);
  
  try {
    console.log(`[VOICE-AI] 📡 Starting fetch request`);
    const startFetch = performance.now();
    
    const response = await fetch(url, { 
      ...options, 
      signal 
    });
    
    const fetchTime = (performance.now() - startFetch).toFixed(2);
    console.log(`[VOICE-AI] ⏱️ Fetch completed in ${fetchTime}ms with status: ${response.status}`);
    
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error) {
      console.error(`[VOICE-AI] ❌ Fetch error: ${error.name} - ${error.message}`);
      if (error.name === 'AbortError') {
        console.error(`[VOICE-AI] ❌ Request was aborted due to timeout (${timeout}ms)`);
      }
    } else {
      console.error(`[VOICE-AI] ❌ Unknown fetch error:`, error);
    }
    throw error;
  }
}
