
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Create root element if it doesn't exist
const rootElement = document.getElementById('root') || document.createElement('div');
if (!rootElement.id) {
  rootElement.id = 'root';
  document.body.appendChild(rootElement);
}

// Check for CSP issues and log them
window.addEventListener('securitypolicyviolation', (e) => {
  console.error('CSP Violation:', {
    'Blocked URI': e.blockedURI,
    'Violated Directive': e.violatedDirective,
    'Original Policy': e.originalPolicy
  });
});

// Add this to your index.js or main.js file
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registration successful');
      })
      .catch(error => {
        console.log('ServiceWorker registration failed:', error);
      });
  });
}

// Initialize app with error handling
try {
  const root = createRoot(rootElement);
  root.render(<App />);
  console.log("Application successfully mounted");
} catch (error) {
  console.error("Error rendering application:", error);
  // Fallback rendering in case of error
  rootElement.innerHTML = `
    <div style="height: 100vh; display: flex; align-items: center; justify-content: center; flex-direction: column; padding: 20px; text-align: center; background-color: #0A0F1C; color: white;">
      <h1>Application Error</h1>
      <p>There was a problem loading the application. Please try refreshing the page.</p>
    </div>
  `;
}
