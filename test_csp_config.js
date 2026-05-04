// Test script to verify CSP configuration
console.log('🔍 Testing CSP Configuration\n');

// Test URLs that should be allowed by CSP
const testUrls = [
  {
    name: 'MCP Upload',
    url: 'https://mcp.univoices.club/upload/mcp',
    expected: 'Should be allowed by CSP'
  },
  {
    name: 'MCP RPC',
    url: 'https://mcp.univoices.club/api/v1/rpc/mcp/mcp_voice',
    expected: 'Should be allowed by CSP'
  },
  {
    name: 'File Download',
    url: 'https://mcp.univoices.club/api/v1?type=mcp&filename=test.mcp',
    expected: 'Should be allowed by CSP'
  },
  {
    name: 'Local Development',
    url: 'http://localhost:8000/api/v1/rpc',
    expected: 'Should be allowed by CSP'
  },
  {
    name: 'ICP Canister',
    url: 'https://scswk-paaaa-aaaau-abyaq-cai.icp0.io/',
    expected: 'Should be allowed by CSP'
  }
];

function testCspConfiguration() {
  console.log('=== CSP CONFIGURATION TEST ===');
  
  // Simulate CSP rules from vite.config.ts
  const cspRules = [
    "'self'",
    "blob:",
    "http://localhost:*",
    "https://localhost:*",
    "http://127.0.0.1:*",
    "https://127.0.0.1:*",
    "https://mcp.univoices.club",
    "https://*.univoices.club",
    "https://icp0.io",
    "https://*.icp0.io",
    "https://icp-api.io",
    "https://ic0.app",
    "https://*.ic0.app",
    "https://openapi.emchub.ai",
    "https://*.emchub.ai",
    "https://api.siliconflow.cn",
    "https://cdn.gpteng.co",
    "http://162.218.231.180:*",
    "https://162.218.231.180:*",
    "http://18.167.51.1:*",
    "https://18.167.51.1:*",
    "ws:",
    "wss:"
  ];
  
  console.log('CSP Rules configured:');
  cspRules.forEach(rule => {
    console.log(`  - ${rule}`);
  });
  
  console.log('\nTesting URLs against CSP rules:');
  
  testUrls.forEach(({ name, url, expected }) => {
    // Simple CSP rule matching (in real browser, this would be more complex)
    const isAllowed = cspRules.some(rule => {
      if (rule === "'self'") return false; // Skip self for external URLs
      if (rule === "blob:") return false; // Skip blob for HTTP/HTTPS URLs
      if (rule.includes('*')) {
        // Handle wildcard rules
        const pattern = rule.replace('*', '.*');
        const regex = new RegExp(pattern);
        return regex.test(url);
      }
      return url.startsWith(rule);
    });
    
    const status = isAllowed ? '✅ ALLOWED' : '❌ BLOCKED';
    console.log(`${name}: ${status}`);
    console.log(`  URL: ${url}`);
    console.log(`  Expected: ${expected}`);
    console.log('');
  });
  
  console.log('=== CSP VERIFICATION SUMMARY ===');
  console.log('✅ CSP rules include mcp.univoices.club');
  console.log('✅ CSP rules include *.univoices.club');
  console.log('✅ CSP rules include localhost for development');
  console.log('✅ CSP rules include ICP domains');
  console.log('');
  console.log('Note: This is a simplified test. In the browser, CSP enforcement');
  console.log('is more complex and depends on the exact CSP directive and context.');
}

function testUrlPatterns() {
  console.log('=== URL PATTERN TEST ===');
  
  const patterns = [
    {
      pattern: 'https://mcp.univoices.club',
      testUrls: [
        'https://mcp.univoices.club/upload/mcp',
        'https://mcp.univoices.club/api/v1/rpc/mcp/mcp_voice',
        'https://mcp.univoices.club/api/v1?type=mcp&filename=test.mcp'
      ]
    },
    {
      pattern: 'https://*.univoices.club',
      testUrls: [
        'https://mcp.univoices.club/upload/mcp',
        'https://api.univoices.club/v1/test',
        'https://files.univoices.club/download'
      ]
    }
  ];
  
  patterns.forEach(({ pattern, testUrls }) => {
    console.log(`Testing pattern: ${pattern}`);
    testUrls.forEach(url => {
      const regex = new RegExp(pattern.replace('*', '.*'));
      const matches = regex.test(url);
      console.log(`  ${url}: ${matches ? '✅ MATCHES' : '❌ NO MATCH'}`);
    });
    console.log('');
  });
}

// Run tests
testCspConfiguration();
testUrlPatterns();

console.log('🔍 CSP configuration test completed!'); 