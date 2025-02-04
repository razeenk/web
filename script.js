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
