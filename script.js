// 1. Add error handling for element existence
const greetingElement = document.getElementById('greeting');
const greetings = ['Hola', 'Hello', 'नमस्ते', '你好', 'Ciao', 'Olá', 'مرحبا', 'നമസ്കാരം'];
let currentIndex = 0;

function changeGreeting() {
    if (!greetingElement) return; // Guard clause if element doesn't exist
    
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

// 2. Store interval ID for potential cleanup
const intervalId = setInterval(changeGreeting, 3600);

// 3. Add error handling for logo protection
const logo = document.getElementById('logo');
if (logo) {
    logo.oncontextmenu = function(e) {
        e.preventDefault();
    };
}

// 4. Improve text loading code
document.addEventListener("DOMContentLoaded", () => {
    const loadingText = document.getElementById("main-txt");
    if (!loadingText) return;
    
    setTimeout(() => {
        if (loadingText.parentElement) {
            loadingText.parentElement.style.visibility = "visible";
        }
    }, 1000);
});

// 5. Add error handling for audio functionality
const audioPlayer = document.getElementById('audioPlayer');
const playAudioButton = document.getElementById('playAudio');

if (audioPlayer && playAudioButton) {
    playAudioButton.addEventListener('click', () => {
        audioPlayer.play().catch(error => {
            console.error('Error playing audio:', error);
        });
    });
}
// 6. Add error handling for logo protection of snapeats
const logo = document.getElementById('snap-logo');
if (snap-logo) {
    snap-logo.oncontextmenu = function(e) {
        e.preventDefault();
    };
}