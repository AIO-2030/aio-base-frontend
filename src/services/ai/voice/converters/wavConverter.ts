
/**
 * WAV format conversion utilities
 */

/**
 * Convert AudioBuffer to WAV format blob (used as an intermediate format)
 * @param audioBuffer AudioBuffer to convert
 * @returns WAV format blob
 */
export function audioBufferToWav(audioBuffer: AudioBuffer): Promise<Blob> {
  return new Promise((resolve) => {
    const numberOfChannels = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    const format = 1; // PCM format
    const bitDepth = 16; // 16-bit
    
    // Get channel data
    const channelData = [];
    for (let channel = 0; channel < numberOfChannels; channel++) {
      channelData.push(audioBuffer.getChannelData(channel));
    }
    
    // Calculate sizes for WAV header
    const dataLength = channelData[0].length * numberOfChannels * (bitDepth / 8);
    const buffer = new ArrayBuffer(44 + dataLength);
    const view = new DataView(buffer);
    
    // Write WAV header
    // "RIFF" chunk descriptor
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + dataLength, true);
    writeString(view, 8, 'WAVE');
    
    // "fmt " sub-chunk
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true); // fmt chunk size
    view.setUint16(20, format, true); // format code
    view.setUint16(22, numberOfChannels, true); // channels
    view.setUint32(24, sampleRate, true); // sample rate
    view.setUint32(28, sampleRate * numberOfChannels * (bitDepth / 8), true); // byte rate
    view.setUint16(32, numberOfChannels * (bitDepth / 8), true); // block align
    view.setUint16(34, bitDepth, true); // bits per sample
    
    // "data" sub-chunk
    writeString(view, 36, 'data');
    view.setUint32(40, dataLength, true); // data size
    
    // Write audio data
    const offset = 44;
    const volume = 1;
    let position = offset;
    
    for (let i = 0; i < channelData[0].length; i++) {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const sample = channelData[channel][i] * volume;
        
        // Clamp value between -1 and 1
        const clampedSample = sample < -1 ? -1 : sample > 1 ? 1 : sample;
        
        // Convert to int16
        const int16 = clampedSample < 0 
          ? clampedSample * 0x8000 
          : clampedSample * 0x7FFF;
        
        view.setInt16(position, int16, true);
        position += 2;
      }
    }
    
    // Create WAV blob
    const wavBlob = new Blob([buffer], { type: 'audio/wav' });
    resolve(wavBlob);
  });
}

/**
 * Helper function to write string to DataView
 */
export function writeString(view: DataView, offset: number, string: string): void {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}
