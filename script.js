// Cache configuration
const CACHE_VERSION = '1.0';
const CACHE_NAME = `web-cache-${CACHE_VERSION}`;
const CACHE_EXPIRATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

// Files to cache
const filesToCache = [
    './index.html',
    './styles/styles.css',
    './script.js',
    './assets/own/logo.svg'
    // Add more files as needed
];

// Cache management
class CacheManager {
    static async initCache() {
        try {
            // Check if cache is supported
            if (!('caches' in window)) {
                console.warn('Cache API not supported');
                return;
            }

            // Clear old caches
            await this.clearOldCaches();

            // Cache new files
            const cache = await caches.open(CACHE_NAME);
            await cache.addAll(filesToCache);
            
            // Store cache timestamp
            localStorage.setItem('cacheTimestamp', Date.now().toString());
            
            console.log('Cache initialized successfully');
        } catch (error) {
            console.error('Cache initialization failed:', error);
        }
    }

    static async clearOldCaches() {
        const cacheTimestamp = localStorage.getItem('cacheTimestamp');
        if (cacheTimestamp) {
            const age = Date.now() - parseInt(cacheTimestamp);
            if (age > CACHE_EXPIRATION) {
                await caches.delete(CACHE_NAME);
                localStorage.removeItem('cacheTimestamp');
                console.log('Old cache cleared');
            }
        }
    }

    static async fetchFromCacheFirst(url) {
        try {
            const cacheResponse = await caches.match(url);
            if (cacheResponse) {
                return cacheResponse;
            }
            
            // If not in cache, fetch from network and cache
            const networkResponse = await fetch(url);
            const cache = await caches.open(CACHE_NAME);
            cache.put(url, networkResponse.clone());
            return networkResponse;
        } catch (error) {
            console.error('Cache fetch failed:', error);
            return fetch(url); // Fallback to network
        }
    }
}

// Initialize cache on page load
document.addEventListener('DOMContentLoaded', () => {
    CacheManager.initCache();
});

// Greeting rotation functionality
const greetingElement = document.getElementById('greeting');
const greetings = [
    'Hola',
    'Hello',
    'नमस्ते',
    '你好',
    'Ciao',
    'Olá',
    'مرحبا',
    'നമസ്കാരം'
];
let currentIndex = 0;

function changeGreeting() {
    if (!greetingElement) {
        console.warn('Greeting element not found');
        return;
    }

    currentIndex = (currentIndex + 1) % greetings.length;
    greetingElement.classList.add('roll-out');
    
    setTimeout(() => {
        greetingElement.textContent = greetings[currentIndex];
        greetingElement.classList.remove('roll-out');
        greetingElement.classList.add('roll-in');
        
        setTimeout(() => {
            greetingElement.classList.remove('roll-in');
        }, 500);
    }, 500);
}

// Start the interval only if greeting element exists
if (greetingElement) {
    setInterval(changeGreeting, 3600);
}

// Image protection
const logo = document.getElementById('logo');
if (logo) {
    logo.oncontextmenu = function(e) {
        e.preventDefault();
    };
}

// Load text with delay
document.addEventListener("DOMContentLoaded", () => {
    const loadingText = document.getElementById("main-txt");
    if (loadingText) {
        setTimeout(() => {
            loadingText.parentElement.style.visibility = "visible";
        }, 1000);
    }
});

// Audio player functionality with caching
const audioPlayer = document.getElementById('audioPlayer');
const playAudioButton = document.getElementById('playAudio');

if (audioPlayer && playAudioButton) {
    // Use cache for audio source if available
    if (audioPlayer.src) {
        CacheManager.fetchFromCacheFirst(audioPlayer.src)
            .then(response => response.blob())
            .then(blob => {
                audioPlayer.src = URL.createObjectURL(blob);
            })
            .catch(error => console.warn('Audio caching failed:', error));
    }

    playAudioButton.addEventListener('click', () => {
        audioPlayer.play().catch(error => {
            console.warn('Audio playback failed:', error);
        });
    });
}
