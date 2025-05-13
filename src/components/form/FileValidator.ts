
import { toast } from "@/components/ui/use-toast";

/**
 * Validates if a file is an executable for Linux
 * @param file File to validate
 * @returns Validation result
 */
export const validateExecutableFile = (file: File) => {
  // For Linux executables, we can check for ELF signature or common extensions
  // but since file type detection is limited in browsers, we'll use name and size checks
  
  const fileName = file.name.toLowerCase();
  
  // Check if it's a common script file
  const isScript = fileName.endsWith('.sh') || 
                  fileName.endsWith('.py') ||
                  fileName.endsWith('.js') ||
                  fileName.endsWith('.pl');
                  
  // Check if it has no extension (common for Linux binaries)
  const hasNoExtension = !fileName.includes('.');
  
  // If file is too small, it's probably not a valid executable
  if (file.size < 100) {
    return { 
      valid: false,
      message: "File is too small to be a valid executable"
    };
  }
  
  // Accept files that look like executables
  if (isScript || hasNoExtension) {
    return { 
      valid: true,
      message: "File appears to be a valid executable"
    };
  }
  
  // For other files, warn but still allow upload
  return { 
    valid: true,
    message: "Warning: File doesn't have a typical executable extension, but will still be uploaded"
  };
};

/**
 * Verify file names match the agent/MCP server name
 * @param file File to validate
 * @param name Name that the file should match
 */
export const validateFileNameMatches = (file: File, name: string): boolean => {
  if (!name) {
    toast({
      title: "Name Required",
      description: "Please enter a name before uploading a file",
      variant: "destructive"
    });
    return false;
  }
  
  // Get base filename without extension
  const fileNameWithoutExt = file.name.split('.')[0];
  const normalizedName = name.trim().toLowerCase().replace(/\s+/g, '-');
  
  if (fileNameWithoutExt.toLowerCase() !== normalizedName) {
    toast({
      title: "File Name Mismatch",
      description: `The executable file name (${fileNameWithoutExt}) must match the agent/server name (${normalizedName})`,
      variant: "destructive"
    });
    return false;
  }
  
  return true;
};
