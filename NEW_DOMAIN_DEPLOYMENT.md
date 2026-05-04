# New Domain Deployment Guide

## URL Migration Summary

### Old URLs → New URLs
| Service | Old URL | New URL |
|---------|---------|---------|
| RPC Service | `https://8.141.81.75:8000/api/v1/rpc/` | `https://mcp.univoices.club/api/v1/rpc/` |
| File Upload | `https://8.141.81.75:8001/api/v1/upload/` | `https://mcp.univoices.club/upload/` |
| File Download | `https://8.141.81.75:8001/api/v1/` | `https://mcp.univoices.club/api/v1/` |
| MCP Execution | `https://8.141.81.75:8000/api/v1/mcp/` | `https://mcp.univoices.club/api/v1/mcp/` |

## Updated Configuration

### 1. Vite Configuration (vite.config.ts)
```typescript
proxy: {
  // Proxy MCP API requests to new domain
  '/api/mcp': {
    target: 'https://mcp.univoices.club',
    changeOrigin: true,
    secure: true,
    rewrite: (path) => path.replace(/^\/api\/mcp/, '/api/v1/rpc'),
  },
  // Proxy file service requests to new domain
  '/api/files': {
    target: 'https://mcp.univoices.club',
    changeOrigin: true,
    secure: true,
    rewrite: (path) => path.replace(/^\/api\/files/, '/api/v1'),
  }
}
```

### 2. API Configuration (apiConfig.ts)
```typescript
export const API_CONFIG = {
  BASE_URL: isProduction() 
    ? 'https://mcp.univoices.club/api/v1'  // New domain
    : getEnvVar('VITE_AIO_MCP_FILE_URL', 'https://mcp.univoices.club/api/v1'),
  get RPC_BASE_URL() {
    return isProduction()
      ? 'https://mcp.univoices.club/api/v1/rpc'  // New domain
      : getEnvVar('VITE_AIO_MCP_API_URL', 'https://mcp.univoices.club/api/v1/rpc');
  },
}
```

### 3. API Context (ApiContext.tsx)
```typescript
const defaultConfig: ApiConfig = {
  baseUrl: isProduction() 
    ? 'https://mcp.univoices.club/api/v1'  // New domain
    : getEnvVar('VITE_AIO_MCP_FILE_URL', 'https://mcp.univoices.club/api/v1'),
  rpcBaseUrl: isProduction()
    ? 'https://mcp.univoices.club/api/v1/rpc'  // New domain
    : getEnvVar('VITE_AIO_MCP_API_URL', 'https://mcp.univoices.club/api/v1/rpc'),
}
```

### 4. File Upload Services
```typescript
// ExecFileUpload.ts & ImgFileUpload.ts
const FILE_SERVICE_URL = isProduction()
  ? 'https://mcp.univoices.club/upload'  // New domain
  : (import.meta.env.VITE_FILE_SERVICE_URL || 'https://mcp.univoices.club/upload');

// Download URLs
const downloadBaseUrl = import.meta.env.VITE_DOWNLOAD_BASE_URL || 'https://mcp.univoices.club/api/v1';
```

### 5. RPC Execution Services
```typescript
// AIOProtocalExecutor.ts & ExecFileCommonBuss.ts
if (isProduction) {
  baseApiUrl = 'https://mcp.univoices.club/api/v1/rpc';  // New domain
}
```

## Environment Variables

### Development Environment
```bash
VITE_AIO_MCP_API_URL=https://mcp.univoices.club/api/v1/rpc
VITE_AIO_MCP_FILE_URL=https://mcp.univoices.club/api/v1
VITE_DOWNLOAD_BASE_URL=https://mcp.univoices.club/api/v1
VITE_FILE_SERVICE_URL=https://mcp.univoices.club/upload
```

### Production Environment
- No environment variables needed
- Code automatically uses new domain URLs

## Test Results

### ✅ All Configurations Updated Successfully
```
API Config RPC: ✅ HTTPS ✅ Domain
API Config File: ✅ HTTPS ✅ Domain
API Context RPC: ✅ HTTPS ✅ Domain
API Context File: ✅ HTTPS ✅ Domain
ExecFileCommonBuss: ✅ HTTPS ✅ Domain
AIO Protocol Executor: ✅ HTTPS ✅ Domain
ExecFileUpload: ✅ HTTPS ✅ Domain
ImgFileUpload: ✅ HTTPS ✅ Domain
Vite Config Proxy: ✅ HTTPS ✅ Domain
```

### ✅ URL Endpoints Verified
```
MCP Upload: https://mcp.univoices.club/upload/mcp
Agent Upload: https://mcp.univoices.club/upload/agent
Image Upload: https://mcp.univoices.club/upload/img
MCP Download: https://mcp.univoices.club/api/v1?type=mcp&filename=test.mcp
Agent Download: https://mcp.univoices.club/api/v1?type=agent&filename=test.agent
Image Download: https://mcp.univoices.club/api/v1?type=img&filename=test.png
```

## Deployment Steps

### 1. Build the Project
```bash
npm run build
```

### 2. Deploy to ICP Canister
```bash
dfx deploy --network ic
```

### 3. Verify Deployment
- Access the deployed application
- Test MCP functionality
- Verify file upload/download
- Check browser console for any errors

## Benefits of New Domain

1. **Professional Domain**: `mcp.univoices.club` is more professional than IP addresses
2. **SSL Certificate**: Proper SSL certificate for the domain
3. **DNS Management**: Better DNS management and routing
4. **Scalability**: Easier to scale and manage with domain-based routing
5. **Security**: Enhanced security with proper domain validation

## Troubleshooting

### If Mixed Content Errors Occur
1. Verify all URLs use `https://mcp.univoices.club`
2. Check that no HTTP URLs remain in the code
3. Ensure environment variables are set correctly

### If File Upload Fails
1. Verify upload URL: `https://mcp.univoices.club/upload`
2. Check file service is running on new domain
3. Verify SSL certificate is valid

### If RPC Calls Fail
1. Verify RPC URL: `https://mcp.univoices.club/api/v1/rpc`
2. Check MCP service is running on new domain
3. Verify network connectivity

## Status: ✅ Complete and Tested

All configurations have been updated to use the new domain `mcp.univoices.club`. The application is ready for deployment with the new URL structure. 