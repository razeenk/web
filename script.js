const greetingElement = document.getElementById('greeting');
const greetings = [
    'Hola',
    'Hello',
    'नमस्ते',
    '你好',
    'Ciao',
    'Olá',
    'مرحبا'
];
let currentIndex = 0;

function changeGreeting() {
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

// Start the interval
setInterval(changeGreeting, 3600); 
//image protection

document.getElementById('logo').oncontextmenu=function(e){
    e.preventDefault();
}
