
interface StoredFile {
  id: string;
  name: string;
  type: string;
  size: number;
  data: string; // base64 encoded data
  timestamp: number;
}

// In-memory storage as a fallback if localStorage is not available
const memoryStorage = new Map<string, StoredFile>();

/**
 * Converts a File object to a base64 string
 */
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
};

/**
 * Checks if localStorage is available
 */
const isLocalStorageAvailable = (): boolean => {
  try {
    const test = 'test';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Generates a unique ID for a file
 */
const generateFileId = (): string => {
  return `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Stores a file in localStorage or memory if localStorage is not available
 * Returns the stored file's ID
 */
export const storeFile = async (file: File): Promise<string> => {
  try {
    const base64Data = await fileToBase64(file);
    const fileId = generateFileId();
    
    const storedFile: StoredFile = {
      id: fileId,
      name: file.name,
      type: file.type,
      size: file.size,
      data: base64Data,
      timestamp: Date.now()
    };
    
    if (isLocalStorageAvailable()) {
      // Get existing files
      const filesJson = localStorage.getItem('chat_files') || '{}';
      const files = JSON.parse(filesJson);
      
      // Add new file
      files[fileId] = storedFile;
      
      // Save back to localStorage
      localStorage.setItem('chat_files', JSON.stringify(files));
    } else {
      // Use in-memory storage as fallback
      memoryStorage.set(fileId, storedFile);
    }
    
    console.log(`File stored with ID: ${fileId}`);
    return fileId;
  } catch (error) {
    console.error('Error storing file:', error);
    throw error;
  }
};

/**
 * Gets a stored file by ID
 * Returns null if file not found
 */
export const getStoredFile = (fileId: string): StoredFile | null => {
  try {
    if (isLocalStorageAvailable()) {
      const filesJson = localStorage.getItem('chat_files') || '{}';
      const files = JSON.parse(filesJson);
      return files[fileId] || null;
    } else {
      return memoryStorage.get(fileId) || null;
    }
  } catch (error) {
    console.error('Error retrieving file:', error);
    return null;
  }
};

/**
 * Gets a stored file as a File object
 * Returns null if file not found
 */
export const getStoredFileAsFile = (fileId: string): File | null => {
  const storedFile = getStoredFile(fileId);
  if (!storedFile) return null;
  
  try {
    // Convert base64 to blob
    const dataUri = storedFile.data;
    const byteString = atob(dataUri.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    
    const blob = new Blob([ab], { type: storedFile.type });
    return new File([blob], storedFile.name, { type: storedFile.type });
  } catch (error) {
    console.error('Error converting stored file to File object:', error);
    return null;
  }
};

/**
 * Gets a stored file as base64 string
 * Returns null if file not found
 */
export const getStoredFileAsBase64 = (fileId: string): string | null => {
  const storedFile = getStoredFile(fileId);
  return storedFile ? storedFile.data : null;
};

/**
 * Deletes a stored file by ID
 * Returns true if file was deleted, false otherwise
 */
export const deleteStoredFile = (fileId: string): boolean => {
  try {
    if (isLocalStorageAvailable()) {
      const filesJson = localStorage.getItem('chat_files') || '{}';
      const files = JSON.parse(filesJson);
      
      if (files[fileId]) {
        delete files[fileId];
        localStorage.setItem('chat_files', JSON.stringify(files));
        return true;
      }
    } else if (memoryStorage.has(fileId)) {
      memoryStorage.delete(fileId);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

/**
 * Lists all stored files
 * Returns an array of StoredFile objects
 */
export const listStoredFiles = (): StoredFile[] => {
  try {
    if (isLocalStorageAvailable()) {
      const filesJson = localStorage.getItem('chat_files') || '{}';
      const files = JSON.parse(filesJson);
      return Object.values(files);
    } else {
      return Array.from(memoryStorage.values());
    }
  } catch (error) {
    console.error('Error listing files:', error);
    return [];
  }
};

/**
 * Clears all stored files
 */
export const clearAllStoredFiles = (): void => {
  try {
    if (isLocalStorageAvailable()) {
      localStorage.removeItem('chat_files');
    }
    memoryStorage.clear();
  } catch (error) {
    console.error('Error clearing files:', error);
  }
};
