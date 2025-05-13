
/**
 * Utility for storing temporary files in the system temp directory
 */

/**
 * Save blob data to a temporary file in the system temp directory
 * This is a browser-based implementation that simulates temp file storage
 * 
 * @param blob The blob data to save
 * @param filename The name to give the file (without path)
 * @returns Object with information about the saved file
 */
export async function saveBlobToTempFile(blob: Blob, filename: string): Promise<{
  success: boolean;
  virtualPath: string;
  url: string;
  size: number;
}> {
  try {
    console.log(`[TEMP-STORAGE] 💾 Saving blob to virtual temp file: ${filename}`);
    console.log(`[TEMP-STORAGE] 📊 Blob size: ${(blob.size / 1024).toFixed(2)} KB, type: ${blob.type}`);
    
    // Create a URL for the blob (this simulates a file in the browser environment)
    const blobUrl = URL.createObjectURL(blob);
    
    // In browser environments, we can't directly access the file system
    // So we simulate a temp directory with a virtual path
    const virtualPath = `/tmp/${filename}`;
    
    console.log(`[TEMP-STORAGE] ✅ File saved virtually at: ${virtualPath}`);
    console.log(`[TEMP-STORAGE] 🔗 Accessible via URL: ${blobUrl}`);
    
    // For debugging in browser console, add the blob to window for inspection
    (window as any).__debugAudioBlobs = (window as any).__debugAudioBlobs || {};
    (window as any).__debugAudioBlobs[filename] = blob;
    
    console.log(`[TEMP-STORAGE] 🧪 Debug: Access this blob in console via window.__debugAudioBlobs["${filename}"]`);
    
    // ALWAYS trigger a download for better debugging
    const downloadLink = document.createElement('a');
    downloadLink.href = blobUrl;
    downloadLink.download = filename;
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    console.log(`[TEMP-STORAGE] 📥 Download initiated for file: ${filename}`);
    
    return {
      success: true,
      virtualPath,
      url: blobUrl,
      size: blob.size
    };
  } catch (error) {
    console.error(`[TEMP-STORAGE] ❌ Error saving blob to temp file:`, error);
    return {
      success: false,
      virtualPath: '',
      url: '',
      size: 0
    };
  }
}
