
import { AttachedFile } from "@/components/chat/ChatFileUploader";

/**
 * Generates a mock AI response based on user input
 */
export function generateMockAIResponse(message: string, attachedFiles?: AttachedFile[]): Promise<string> {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      // Generate different responses based on message content and attached files
      if (attachedFiles && attachedFiles.length > 0) {
        const fileTypes = attachedFiles.map(file => file.type.split('/')[0]).join(', ');
        const fileNames = attachedFiles.map(file => file.name).join(', ');
        
        if (fileTypes.includes('image')) {
          resolve(`I've received your ${attachedFiles.length} file(s) including ${fileNames}. I've analyzed the images you've shared. In a production environment, I could perform object detection, image classification, or extract text depending on your needs. What would you like to know about these images?`);
        } else if (fileTypes.includes('pdf') || fileTypes.includes('text')) {
          resolve(`Thank you for sharing these documents: ${fileNames}. I can see you've uploaded ${attachedFiles.length} file(s). In a production environment, I would extract the text content and analyze it for relevant information. What specific insights would you like me to find in these documents?`);
        } else if (fileTypes.includes('video') || fileTypes.includes('audio')) {
          resolve(`I've received your media files: ${fileNames}. In a production environment, I could transcribe audio content, analyze video frames, or extract metadata. Would you like me to explain how I would process these media files for your specific use case?`);
        } else {
          resolve(`Thank you for sharing ${attachedFiles.length} file(s): ${fileNames}. I've stored these files and can reference them in our conversation. In a production environment, I would analyze their contents based on the file types. How would you like me to help with these files?`);
        }
      } else if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
        resolve(`Hello! I'm AIO-2030 AI. How can I assist you with the decentralized AI agent network today?`);
      } else if (message.toLowerCase().includes('agent')) {
        resolve(`AI Agents in our network are autonomous programs that can perform tasks, learn from interactions, and collaborate with other agents. They can be deployed across the network to solve complex problems.`);
      } else if (message.toLowerCase().includes('mcp') || message.toLowerCase().includes('protocol')) {
        resolve(`The Model Context Protocol (MCP) is a standardized way for AI agents to share context and communicate. It enables seamless interaction between different types of agents across the network.`);
      } else if (message.toLowerCase().includes('token') || message.toLowerCase().includes('reward')) {
        resolve(`Our network uses a token-based reward system to incentivize hosting and creating AI agents. Contributors earn tokens when their agents are used or when they provide computing resources to the network.`);
      } else {
        resolve(`I received your message: "${message}". This is a simulated response from AIO-2030 AI. In a production environment, I would connect to a large language model to provide more accurate and contextual responses.`);
      }
    }, 800); // Simulate 800ms latency
  });
}
