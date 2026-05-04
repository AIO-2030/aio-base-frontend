# CSP Fix Summary

## Problem
```
Refused to connect to 'https://mcp.univoices.club/upload/mcp' because it violates the following Content Security Policy directive: "connect-src 'self' blob: http://localhost:* https://localhost:* http://127.0.0.1:* https://127.0.0.1:* http://8.141.81.75:* https://8.141.81.75:* http://8.141.81.75:8001/upload/mcp https://8.141.81.75:8001/upload/mcp https://icp0.io https://*.icp0.io https://icp-api.io https://ic0.app https://*.ic0.app https://openapi.emchub.ai https://*.emchub.ai https://api.siliconflow.cn https://cdn.gpteng.co ws: wss:"
```

## Root Cause
The CSP error shows that the browser is still using old CSP configuration with IP addresses instead of the new domain.

## Files Modified

### 1. CSP Configuration Files
- ✅ `vite.config.ts` - Updated CSP headers
- ✅ `index.html` - Updated meta tag CSP
- ✅ `public/.ic-assets.json5` - Updated ICP deployment CSP

### 2. URL Configuration Files
- ✅ `src/services/api/apiConfig.ts` - Fixed `getFullUploadUrl` method
- ✅ `src/contexts/ApiContext.tsx` - Fixed `getFullUploadUrl` method

## Changes Made

### CSP Configuration
**Before:**
```
http://8.141.81.75:* https://8.141.81.75:* http://8.141.81.75:8001/upload/mcp https://8.141.81.75:8001/upload/mcp
```

**After:**
```
https://mcp.univoices.club https://*.univoices.club
```

### URL Configuration
**Before:**
```typescript
getFullUploadUrl(type: 'mcp' | 'agent' | 'img'): string {
  return `${this.BASE_URL}${this.ENDPOINTS.UPLOAD[type.toUpperCase()]}`;
  // Result: https://mcp.univoices.club/api/v1/upload/mcp (WRONG)
}
```

**After:**
```typescript
getFullUploadUrl(type: 'mcp' | 'agent' | 'img'): string {
  const uploadBaseUrl = isProduction() 
    ? 'https://mcp.univoices.club/upload'
    : getEnvVar('VITE_FILE_SERVICE_URL', 'https://mcp.univoices.club/upload');
  return `${uploadBaseUrl}/${type}`;
  // Result: https://mcp.univoices.club/upload/mcp (CORRECT)
}
```

## Expected URLs

### ✅ Correct URLs
- **MCP Upload**: `https://mcp.univoices.club/upload/mcp`
- **Agent Upload**: `https://mcp.univoices.club/upload/agent`
- **Image Upload**: `https://mcp.univoices.club/upload/img`
- **MCP RPC**: `https://mcp.univoices.club/api/v1/rpc/mcp/mcp_voice`
- **File Download**: `https://mcp.univoices.club/api/v1?type=mcp&filename=test.mcp`

### ❌ Wrong URLs (Fixed)
- **MCP Upload**: `https://mcp.univoices.club/api/v1/upload/mcp` ❌
- **Old IP URLs**: `http://8.141.81.75:*` ❌

## Troubleshooting Steps

### 1. Clear Browser Cache
```bash
# Hard refresh in browser
Ctrl+F5 (Windows/Linux)
Cmd+Shift+R (Mac)
```

### 2. Restart Development Server
```bash
# Stop current server (Ctrl+C)
# Then restart
npm run dev
```

### 3. Check Browser Dev Tools
- Open Network tab
- Try uploading a file
- Check the actual request URL
- Look for CSP violations in Console

### 4. Verify CSP Headers
- Check Network tab for CSP headers
- Should see: `https://mcp.univoices.club https://*.univoices.club`
- Should NOT see: `http://8.141.81.75:* https://8.141.81.75:*`

## Verification Commands

### Test URL Configuration
```bash
node test_new_urls.js
```

### Test CSP Configuration
```bash
node test_all_csp.js
```

### Verify File Modifications
```bash
grep -r "mcp.univoices.club" src/ --include="*.ts" --include="*.tsx"
grep -r "8.141.81.75" src/ --include="*.ts" --include="*.tsx"
```

## Status: ✅ Fixed

All configurations have been updated. The issue should be resolved after:
1. Clearing browser cache
2. Restarting development server
3. Hard refreshing the page

If the issue persists, check browser dev tools for the actual CSP headers being sent. 