
/**
 * MP3 format conversion utilities
 */

/**
 * Convert WAV blob to MP3 using MediaRecorder
 * @param wavBlob WAV format blob
 * @returns MP3 format blob
 */
export async function wavToMp3(wavBlob: Blob): Promise<Blob> {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(`[AUDIO-CONVERTER] 🔄 Starting WAV to MP3 conversion`);
      
      // Create an audio element to play the WAV
      const audioElement = new Audio();
      audioElement.src = URL.createObjectURL(wavBlob);
      
      // Create an audio context and source
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioContext.createMediaElementSource(audioElement);
      
      // Create a destination node
      const destination = audioContext.createMediaStreamDestination();
      source.connect(destination);
      
      // Create a MediaRecorder with MP3 mime type if supported
      let mimeType = 'audio/mpeg';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        console.log(`[AUDIO-CONVERTER] ⚠️ audio/mpeg not supported, trying alternatives`);
        // Try alternative MIME types
        const alternatives = ['audio/mp3', 'audio/mp4', 'audio/webm;codecs=mp3'];
        for (const alt of alternatives) {
          if (MediaRecorder.isTypeSupported(alt)) {
            mimeType = alt;
            console.log(`[AUDIO-CONVERTER] 🔍 Using alternative MIME type: ${mimeType}`);
            break;
          }
        }
      }
      
      const chunks: Blob[] = [];
      const recorder = new MediaRecorder(destination.stream, { mimeType });
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      
      recorder.onstop = () => {
        const mp3Blob = new Blob(chunks, { type: 'audio/mpeg' });
        console.log(`[AUDIO-CONVERTER] ✅ MP3 conversion complete, size: ${(mp3Blob.size / 1024).toFixed(2)} KB`);
        
        // Clean up
        URL.revokeObjectURL(audioElement.src);
        audioElement.remove();
        
        resolve(mp3Blob);
      };
      
      recorder.onerror = (e) => {
        console.error(`[AUDIO-CONVERTER] ❌ MediaRecorder error:`, e);
        reject(new Error(`MediaRecorder error: ${e}`));
      };
      
      // Start recording
      recorder.start();
      
      // Play the audio (this will trigger the MediaRecorder)
      audioElement.onended = () => {
        recorder.stop();
      };
      
      audioElement.onerror = (e) => {
        console.error(`[AUDIO-CONVERTER] ❌ Audio playback error:`, e);
        reject(new Error(`Audio playback error: ${e}`));
      };
      
      // Set a timeout in case the audio doesn't play or end properly
      const timeout = setTimeout(() => {
        if (recorder.state === 'recording') {
          console.log(`[AUDIO-CONVERTER] ⚠️ Stopping recorder after timeout`);
          recorder.stop();
        }
      }, 30000); // 30 second timeout
      
      // Play the audio to start the conversion process
      audioElement.play().catch(e => {
        clearTimeout(timeout);
        console.error(`[AUDIO-CONVERTER] ❌ Cannot play audio:`, e);
        reject(new Error(`Cannot play audio: ${e}`));
      });
    } catch (error) {
      console.error(`[AUDIO-CONVERTER] ❌ WAV to MP3 conversion error:`, error);
      reject(error);
    }
  });
}
