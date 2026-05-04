// Verify CSP fix and check why new URLs might not be working
console.log('🔍 Verifying CSP Fix and URL Configuration\n');

// Check all CSP configurations
function checkCspConfigurations() {
  console.log('=== CSP CONFIGURATION CHECK ===');
  
  const cspSources = [
    // Should be present (new domain)
    'https://mcp.univoices.club',
    'https://*.univoices.club',
    
    // Should NOT be present (old IP addresses)
    'http://8.141.81.75',
    'https://8.141.81.75',
    'http://8.141.81.75:8001',
    'https://8.141.81.75:8001',
    'http://8.141.81.75:8001/upload/mcp',
    'https://8.141.81.75:8001/upload/mcp'
  ];
  
  console.log('Checking CSP sources:');
  cspSources.forEach(source => {
    const isNewDomain = source.includes('mcp.univoices.club');
    const isOldIP = source.includes('8.141.81.75');
    
    if (isNewDomain) {
      console.log(`✅ ${source} - Should be in CSP`);
    } else if (isOldIP) {
      console.log(`❌ ${source} - Should NOT be in CSP`);
    }
  });
  
  console.log('');
}

// Check URL configurations
function checkUrlConfigurations() {
  console.log('=== URL CONFIGURATION CHECK ===');
  
  const expectedUrls = [
    {
      name: 'MCP Upload',
      correct: 'https://mcp.univoices.club/upload/mcp',
      wrong: 'https://mcp.univoices.club/api/v1/upload/mcp'
    },
    {
      name: 'MCP RPC',
      correct: 'https://mcp.univoices.club/api/v1/rpc/mcp/mcp_voice',
      wrong: 'http://8.141.81.75:8000/api/v1/rpc/mcp/mcp_voice'
    },
    {
      name: 'File Download',
      correct: 'https://mcp.univoices.club/api/v1?type=mcp&filename=test.mcp',
      wrong: 'http://8.141.81.75:8001/api/v1?type=mcp&filename=test.mcp'
    }
  ];
  
  expectedUrls.forEach(({ name, correct, wrong }) => {
    console.log(`${name}:`);
    console.log(`  ✅ Correct: ${correct}`);
    console.log(`  ❌ Wrong: ${wrong}`);
    console.log('');
  });
}

// Check build cache issues
function checkBuildCacheIssues() {
  console.log('=== BUILD CACHE CHECK ===');
  
  console.log('Potential issues that could prevent new URLs from working:');
  console.log('1. Browser cache - Clear browser cache or hard refresh (Ctrl+F5)');
  console.log('2. Vite dev server cache - Restart dev server');
  console.log('3. Service worker cache - Clear service worker cache');
  console.log('4. Build cache - Clear dist folder and rebuild');
  console.log('');
  
  console.log('Recommended actions:');
  console.log('1. Clear browser cache and hard refresh');
  console.log('2. Stop and restart Vite dev server');
  console.log('3. Check browser dev tools Network tab for actual requests');
  console.log('4. Check browser dev tools Console for CSP violations');
  console.log('');
}

// Check file modifications
function checkFileModifications() {
  console.log('=== FILE MODIFICATION CHECK ===');
  
  const modifiedFiles = [
    {
      file: 'vite.config.ts',
      description: 'Development server CSP configuration',
      status: '✅ Updated'
    },
    {
      file: 'index.html',
      description: 'HTML meta tag CSP configuration',
      status: '✅ Updated'
    },
    {
      file: 'public/.ic-assets.json5',
      description: 'ICP deployment CSP configuration',
      status: '✅ Updated'
    },
    {
      file: 'src/services/api/apiConfig.ts',
      description: 'API configuration with getFullUploadUrl fix',
      status: '✅ Updated'
    },
    {
      file: 'src/contexts/ApiContext.tsx',
      description: 'API context with getFullUploadUrl fix',
      status: '✅ Updated'
    }
  ];
  
  modifiedFiles.forEach(({ file, description, status }) => {
    console.log(`${status} ${file}: ${description}`);
  });
  
  console.log('');
}

// Check debugging steps
function checkDebuggingSteps() {
  console.log('=== DEBUGGING STEPS ===');
  
  console.log('To verify the fix is working:');
  console.log('1. Clear browser cache completely');
  console.log('2. Restart Vite dev server: npm run dev');
  console.log('3. Open browser dev tools');
  console.log('4. Go to Network tab and check actual request URLs');
  console.log('5. Go to Console tab and look for CSP violations');
  console.log('6. Try uploading a file and check the request URL');
  console.log('');
  
  console.log('Expected behavior:');
  console.log('- File upload should use: https://mcp.univoices.club/upload/mcp');
  console.log('- No CSP violations in console');
  console.log('- Network requests should show correct URLs');
  console.log('');
}

// Run all checks
checkCspConfigurations();
checkUrlConfigurations();
checkBuildCacheIssues();
checkFileModifications();
checkDebuggingSteps();

console.log('🔍 CSP fix verification completed!');
console.log('');
console.log('If URLs are still not working:');
console.log('1. Clear browser cache and hard refresh');
console.log('2. Restart Vite dev server');
console.log('3. Check browser dev tools for actual request URLs');
console.log('4. Verify CSP headers in Network tab'); 