// Check if the app is running on localhost
const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
  );
  
  // Function to register a service worker for caching assets
  export default function registerServiceWorker() {
    // Check if the environment is production and the browser supports service workers
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
      // Get the public URL and compare it with the current origin
      const publicUrl = new URL(process.env.PUBLIC_URL, window.location);
      if (publicUrl.origin !== window.location.origin) {
        // Service worker won't work if PUBLIC_URL is on a different origin
        return;
      }
  
      // Register service worker after the page has loaded
      window.addEventListener('load', () => {
        const serviceWorkerUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
  
        if (isLocalhost) {
          // Running on localhost, check if a service worker still exists
          checkValidServiceWorker(serviceWorkerUrl);
  
          // Log information for developers on localhost
          navigator.serviceWorker.ready.then(() => {
            console.log(
              'This web app is being served cache-first by a service worker. ' +
              'To learn more, visit https://goo.gl/SC7cgQ'
            );
          });
        } else {
          // Not on localhost, register service worker
          registerValidServiceWorker(serviceWorkerUrl);
        }
      });
    }
  }
  
  // Register a valid service worker
  function registerValidServiceWorker(serviceWorkerUrl) {
    navigator.serviceWorker
      .register(serviceWorkerUrl)
      .then(registration => {
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                console.log('New content is available; please refresh.');
              } else {
                console.log('Content is cached for offline use.');
              }
            }
          };
        };
      })
      .catch(error => {
        console.error('Error during service worker registration:', error);
      });
  }
  
  // Check if a service worker is still valid
  function checkValidServiceWorker(serviceWorkerUrl) {
    fetch(serviceWorkerUrl)
      .then(response => {
        if (
          response.status === 404 ||
          response.headers.get('content-type').indexOf('javascript') === -1
        ) {
          navigator.serviceWorker.ready.then(registration => {
            registration.unregister().then(() => {
              window.location.reload();
            });
          });
        } else {
          registerValidServiceWorker(serviceWorkerUrl);
        }
      })
      .catch(() => {
        console.log('No internet connection found. App is running in offline mode.');
      });
  }
  
  // Unregister a service worker
  export function unregisterServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.unregister();
      });
    }
  }
  