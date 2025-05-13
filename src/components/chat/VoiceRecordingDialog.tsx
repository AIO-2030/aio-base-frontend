import { Dialog, DialogContent, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Server, Mic } from 'lucide-react';
import { Slider } from '../ui/slider';
import { useEffect, useRef, useState } from 'react';

interface VoiceRecordingDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isRecording: boolean;
  isProcessing: boolean;
  recordingComplete: boolean;
  mediaBlobUrl: string | null | undefined;
  onFinish: () => void;
  onCancel: () => void;
}

const VoiceRecordingDialog = ({
  isOpen,
  onOpenChange,
  isRecording,
  isProcessing,
  recordingComplete,
  mediaBlobUrl,
  onFinish,
  onCancel
}: VoiceRecordingDialogProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const blobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('timeupdate', updateProgress);
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
        setAudioProgress(0);
      });
      
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('timeupdate', updateProgress);
          audioRef.current.removeEventListener('ended', () => {
            setIsPlaying(false);
            setAudioProgress(0);
          });
        }
      };
    }
  }, [audioRef.current]);

  // Reset playback state when mediaBlobUrl changes
  useEffect(() => {
    setIsPlaying(false);
    setAudioProgress(0);
  }, [mediaBlobUrl]);

  useEffect(() => {
    if (mediaBlobUrl) {
      console.log("[useVoiceRecorder] mediaBlobUrl updated:", mediaBlobUrl);
      blobUrlRef.current = mediaBlobUrl;
    }
  }, [mediaBlobUrl]);

  const updateProgress = () => {
    if (audioRef.current) {
      const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setAudioProgress(progress);
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressChange = (value: number[]) => {
    if (!audioRef.current) return;
    
    const newProgress = value[0];
    setAudioProgress(newProgress);
    
    const newTime = (newProgress / 100) * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
  };

  // Create dialog title based on current state
  const dialogDescription = isRecording 
    ? "Recording audio for transcription" 
    : recordingComplete 
      ? "Audio recording completed" 
      : isProcessing 
        ? "Queen AI is hearing you..." 
        : "Audio recording preparation";

  const hasValidMediaBlob = mediaBlobUrl && typeof mediaBlobUrl === 'string';

  const currentBlobUrl = mediaBlobUrl || blobUrlRef.current;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open && !isProcessing) onCancel();
      onOpenChange(open);
    }}>
      <DialogContent 
        className="sm:max-w-[425px] bg-[#0F172A] border-none text-white"
        description={dialogDescription}
      >
        <DialogTitle className="text-lg font-medium">
          {dialogDescription}
        </DialogTitle>
        
        <DialogDescription className="text-white/80">
          {isProcessing 
            ? 'Hearing by Queen AI...' 
            : isRecording 
              ? 'Speak now and click Finish when done.' 
              : recordingComplete && hasValidMediaBlob
                ? 'Listen to your recording before sending' 
                : 'Preparing audio playback...'}
        </DialogDescription>
        
        {isRecording && (
          <div className="flex items-center justify-center space-x-3 mt-4">
            <Mic size={24} className="text-red-500 animate-pulse" />
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
        
        {isProcessing && (
          <div className="flex flex-col items-center justify-center mt-4 space-y-3">
            <Server size={24} className="text-primary animate-pulse" />
            <div className="text-center">
              <p className="font-medium">Applying Queen AI with your voice...</p>
              <p className="text-sm text-white/70 mt-1">Converting speech...</p>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mt-2">
              <div className="h-full bg-primary animate-pulse rounded-full" style={{width: '60%'}}></div>
            </div>
          </div>
        )}
        
        {recordingComplete && hasValidMediaBlob && (
          <div className="space-y-4 mt-3 p-3 bg-[#172A46] rounded-md">
            <div className="flex items-center space-x-4">
              <Button 
                onClick={togglePlayback}
                size="icon"
                variant="ghost" 
                className="text-white bg-primary/20 hover:bg-primary/30"
              >
                {isPlaying ? "Pause" : "Play"}
              </Button>
              <div className="flex-1">
                <Slider 
                  value={[audioProgress]} 
                  max={100} 
                  step={1}
                  onValueChange={handleProgressChange}
                  className="w-full"
                />
              </div>
            </div>
            <audio 
              ref={audioRef} 
              src={hasValidMediaBlob ? mediaBlobUrl : undefined} 
              className="hidden" 
            />
          </div>
        )}
        
        {!isProcessing && (
          <div className="flex justify-center mt-4">
            <Button 
              onClick={onFinish}
              className="bg-primary hover:bg-primary/90 text-white"
              disabled={recordingComplete && !hasValidMediaBlob}
            >
              {isRecording ? 'Finish Recording' : recordingComplete ? 'Send' : 'Processing...'}
            </Button>
          </div>
        )}
        
        {isProcessing && (
          <div className="flex justify-center mt-4">
            <div className="text-sm text-white/80">
              Queen AI will transcribe your voice message...
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VoiceRecordingDialog;
