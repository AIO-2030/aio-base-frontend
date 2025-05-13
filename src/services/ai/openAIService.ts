
import { AttachedFile } from "@/components/chat/ChatFileUploader";

// OpenAI API configuration
// In a production environment, this should be loaded from environment variables
const OPENAI_API_KEY = "sk-your-api-key"; // Replace with actual API key or fetch from secure storage
const DEFAULT_MODEL = "gpt-4o-mini"; // Default model to use for chat completions

/**
 * Generate a response using the OpenAI API
 */
export async function generateRealAIResponse(message: string, attachedFiles?: AttachedFile[], model = DEFAULT_MODEL): Promise<string> {
  try {
    // Construct a message that includes file information
    let fullMessage = message;
    
    if (attachedFiles && attachedFiles.length > 0) {
      const fileInfo = attachedFiles.map(file => 
        `File: ${file.name} (${file.type}, ${file.size} bytes)`
      ).join('\n');
      
      fullMessage += `\n\nAttached files:\n${fileInfo}`;
    }
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: 'You are AIO-2030 AI, an advanced AI assistant for the decentralized AI agent network. Be concise, helpful, and knowledgeable about AI agents, distributed systems, and blockchain technology. When users share files, acknowledge them and provide relevant context about how you would process them in a production environment.'
          },
          {
            role: 'user',
            content: fullMessage
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error:", errorData);
      throw new Error(`API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw error;
  }
}
