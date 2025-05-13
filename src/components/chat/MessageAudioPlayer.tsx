
import { useEffect, useState, useRef } from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from '../ui/use-toast';
import { hasMessageAudio, getMessageAudioUrl } from '@/services/speechService';

interface MessageAudioPlayerProps {
  messageId: string;
  audioProgress?: number;
  isPlaying?: boolean;
  onPlaybackChange: (messageId: string, audioElement: HTMLAudioElement | null) => void;
}

const MessageAudioPlayer = ({ 
  messageId, 
  audioProgress = 0, 
  isPlaying = false,
  onPlaybackChange
}: MessageAudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioExists, setAudioExists] = useState(false);
  
  useEffect(() => {
    // Check if audio exists for this message
    const exists = hasMessageAudio(messageId);
    setAudioExists(exists);
    
    // Log for debugging
    console.log(`[MessageAudioPlayer] Message ID: ${messageId}, Audio exists: ${exists}`);
    
    // Cleanup function
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [messageId]);
  
  // Don't render anything if no audio
  if (!audioExists) {
    return null;
  }
  
  const handleTogglePlayback = () => {
    onPlaybackChange(messageId, audioRef.current);
  };
  
  return (
    <div className="mt-2 flex items-center space-x-2">
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-6 w-6 p-0 bg-white/20 hover:bg-white/30 rounded-full"
        onClick={handleTogglePlayback}
        aria-label={isPlaying ? "Pause voice message" : "Play voice message"}
      >
        {isPlaying ? <Pause size={12} /> : <Play size={12} />}
      </Button>
      
      <div className="h-1 flex-grow bg-white/20 rounded-full overflow-hidden">
        <div 
          className="h-full bg-white/60 transition-all duration-100"
          style={{ width: `${audioProgress || 0}%` }}
        ></div>
      </div>
    </div>
  );
};

export default MessageAudioPlayer;
