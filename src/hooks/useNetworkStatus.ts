
import { useState, useEffect } from 'react';

/**
 * Hook to monitor network status and service worker connectivity
 */
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isServiceWorkerReady, setIsServiceWorkerReady] = useState(false);
  const [isEmcNetworkAvailable, setIsEmcNetworkAvailable] = useState(true);

  useEffect(() => {
    // Update online status from browser
    const handleOnline = () => {
      console.log('[Network Status] Browser reports online');
      setIsOnline(true);
    };

    const handleOffline = () => {
      console.log('[Network Status] Browser reports offline');
      setIsOnline(false);
      setIsEmcNetworkAvailable(false);
    };

    // Listen for service worker messages about network status
    const handleServiceWorkerMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'NETWORK_STATUS') {
        console.log(`[Network Status] Service worker reports: ${event.data.online ? 'online' : 'offline'}`);
        setIsEmcNetworkAvailable(event.data.online);
      }

      if (event.data && event.data.type === 'SW_RESPONSE') {
        console.log('[Network Status] Service worker is responding');
        setIsServiceWorkerReady(true);
      }
    };

    // Subscribe to service worker for network status updates
    const subscribeToServiceWorker = async () => {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        try {
          // Test if the service worker is responding
          navigator.serviceWorker.controller.postMessage({
            type: 'PING',
            timestamp: Date.now()
          });

          // Subscribe to network status updates
          navigator.serviceWorker.controller.postMessage({
            type: 'SUBSCRIBE_NETWORK_STATUS'
          });

          console.log('[Network Status] Subscribed to service worker network updates');
        } catch (error) {
          console.error('[Network Status] Failed to communicate with service worker:', error);
          setIsServiceWorkerReady(false);
        }
      } else {
        console.log('[Network Status] No active service worker found');
        setIsServiceWorkerReady(false);
      }
    };

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);

    // Initial subscription
    subscribeToServiceWorker();

    // Initialize service worker status polling
    const checkServiceWorker = setInterval(() => {
      if (!isServiceWorkerReady && 'serviceWorker' in navigator) {
        subscribeToServiceWorker();
      }
    }, 5000); // Check every 5 seconds if not ready

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
      
      // Unsubscribe from service worker
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'UNSUBSCRIBE_NETWORK_STATUS'
        });
      }
      
      clearInterval(checkServiceWorker);
    };
  }, [isServiceWorkerReady]);

  return {
    isOnline,
    isServiceWorkerReady,
    isEmcNetworkAvailable
  };
}
