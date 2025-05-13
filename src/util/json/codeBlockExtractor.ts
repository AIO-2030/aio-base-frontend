
/**
 * 从代码块中提取 JSON 内容的工具函数
 */

export const extractJsonFromCodeBlock = (str: string): string => {
  if (!str) return str;
  
  // 处理 ```json 代码块
  if (str.includes('```json')) {
    const parts = str.split('```json');
    if (parts.length > 1) {
      return parts[1].split('```')[0].trim();
    }
  }
  
  // 处理普通 ``` 代码块
  if (str.includes('```')) {
    const parts = str.split('```');
    if (parts.length > 1) {
      // Check if the extracted content looks like JSON
      const content = parts[1].trim();
      if (content.startsWith('{') || content.startsWith('[')) {
        return content;
      }
    }
  }
  
  // If it already looks like JSON, return as is
  if (str.trim().startsWith('{') || str.trim().startsWith('[')) {
    return str;
  }
  
  return str;
}; 

/**
 * Extract JSON from text with more robust handling of code blocks and nested structures
 */
export const extractJsonWithContext = (str: string): {
  extractedJson: string;
  jsonContext: 'code_block' | 'raw_json' | 'unknown';
  confidence: number;
} => {
  if (!str) {
    return {
      extractedJson: str,
      jsonContext: 'unknown',
      confidence: 0
    };
  }
  
  // Handle JSON in code blocks (highest confidence)
  if (str.includes('```json')) {
    const parts = str.split('```json');
    if (parts.length > 1) {
      const extracted = parts[1].split('```')[0].trim();
      return {
        extractedJson: extracted,
        jsonContext: 'code_block',
        confidence: 0.9
      };
    }
  }
  
  // Handle any code block that might contain JSON
  if (str.includes('```')) {
    const parts = str.split('```');
    if (parts.length > 1) {
      const content = parts[1].trim();
      if (content.startsWith('{') || content.startsWith('[')) {
        return {
          extractedJson: content,
          jsonContext: 'code_block',
          confidence: 0.8
        };
      }
    }
  }
  
  // Check if the entire string is JSON
  const trimmed = str.trim();
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    // Do a quick validation check
    let isValid = true;
    let depth = 0;
    const open = trimmed.startsWith('{') ? '{' : '[';
    const close = trimmed.startsWith('{') ? '}' : ']';
    
    for (const char of trimmed) {
      if (char === open) depth++;
      else if (char === close) depth--;
      
      if (depth < 0) {
        isValid = false;
        break;
      }
    }
    
    if (isValid && depth === 0) {
      return {
        extractedJson: trimmed,
        jsonContext: 'raw_json',
        confidence: 0.7
      };
    }
  }
  
  // Return the original string if no JSON found
  return {
    extractedJson: str,
    jsonContext: 'unknown',
    confidence: 0.1
  };
};
