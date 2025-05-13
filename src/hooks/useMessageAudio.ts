
import { useRef, useCallback, useState, useEffect } from 'react';
import { AIMessage } from '@/services/types/aiTypes';
import { getMessageAudioUrl } from '@/services/speechService';
import { toast } from '@/components/ui/use-toast';

export function useMessageAudio(
  messages: AIMessage[], 
  setMessages: React.Dispatch<React.SetStateAction<AIMessage[]>>
) {
  const messageAudioRefs = useRef<Map<string, HTMLAudioElement>>(new Map());
  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);
  
  // Clean up audio elements when component unmounts
  useEffect(() => {
    return () => {
      messageAudioRefs.current.forEach(audio => {
        if (audio) {
          audio.pause();
          audio.src = '';
        }
      });
      messageAudioRefs.current.clear();
    };
  }, []);
  
  const toggleMessagePlayback = useCallback((messageId: string, audioElementParam?: HTMLAudioElement | null) => {
    console.log(`[useMessageAudio] Toggling playback for message: ${messageId}`);
    
    // Stop any currently playing audio
    if (currentPlayingId && currentPlayingId !== messageId) {
      const currentAudio = messageAudioRefs.current.get(currentPlayingId);
      if (currentAudio) {
        console.log(`[useMessageAudio] Stopping current playback: ${currentPlayingId}`);
        currentAudio.pause();
        
        // Update the currently playing message status
        setMessages(prev => 
          prev.map(msg => 
            msg.id === currentPlayingId 
              ? { ...msg, isPlaying: false, audioProgress: 0 } 
              : msg
          )
        );
      }
      setCurrentPlayingId(null);
    }
    
    // Update the target message
    setMessages(prev => 
      prev.map(msg => {
        if (msg.id === messageId) {
          // Get or create audio element
          let audioElement = audioElementParam;
          
          if (!audioElement) {
            if (messageAudioRefs.current.has(messageId)) {
              audioElement = messageAudioRefs.current.get(messageId) || null;
            } else {
              const audioUrl = getMessageAudioUrl(messageId);
              console.log(`[useMessageAudio] Audio URL for message ${messageId}:`, audioUrl);
              
              if (audioUrl) {
                audioElement = new Audio(audioUrl);
                messageAudioRefs.current.set(messageId, audioElement);
                
                audioElement.addEventListener('timeupdate', () => {
                  if (audioElement) {
                    const progress = (audioElement.currentTime / audioElement.duration) * 100;
                    updateMessageAudioProgress(messageId, progress);
                  }
                });
                
                audioElement.addEventListener('ended', () => {
                  console.log(`[useMessageAudio] Playback ended for message: ${messageId}`);
                  setMessages(prevMsgs => 
                    prevMsgs.map(m => 
                      m.id === messageId 
                        ? { ...m, isPlaying: false, audioProgress: 0 } 
                        : m
                    )
                  );
                  setCurrentPlayingId(null);
                });
                
                audioElement.addEventListener('error', (e) => {
                  console.error(`[useMessageAudio] Audio error for message ${messageId}:`, e);
                  toast({
                    title: "Audio playback error",
                    description: "There was an error playing the voice message",
                    variant: "destructive"
                  });
                });
              }
            }
          }
          
          // Toggle playback
          if (audioElement) {
            const newPlayingState = !msg.isPlaying;
            
            if (newPlayingState) {
              audioElement.play()
                .then(() => {
                  console.log(`[useMessageAudio] Playing message: ${messageId}`);
                  setCurrentPlayingId(messageId);
                })
                .catch(error => {
                  console.error(`[useMessageAudio] Error playing audio ${messageId}:`, error);
                  toast({
                    title: "Playback error",
                    description: "Could not play the voice message",
                    variant: "destructive"
                  });
                });
            } else {
              console.log(`[useMessageAudio] Pausing message: ${messageId}`);
              audioElement.pause();
              setCurrentPlayingId(null);
            }
            
            return { ...msg, isPlaying: newPlayingState };
          }
        }
        return msg;
      })
    );
  }, [messages, setMessages, currentPlayingId]);
  
  const updateMessageAudioProgress = useCallback((messageId: string, progress: number) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, audioProgress: progress } 
          : msg
      )
    );
  }, [setMessages]);

  return { toggleMessagePlayback, updateMessageAudioProgress };
}
