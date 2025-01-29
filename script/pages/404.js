//go back home button
document.getElementById('home')
.addEventListener('click',function(){
    window.location.href='./';
});
//404 text
const headerTexts = [
    "Uh-oh! This Page Seems to Have Disappeared (404 Error)",
    "Sorry, we couldn't find that page.",
    "Oops! The page you're looking for isn't here (404 Error)",
    "Oh no! You've found a broken link (404 Error)",
    "Oops! Looks like you've hit a dead end (404 Error)"
];

function getRandomHeaderText() {
    const randomIndex = Math.floor(Math.random() * headerTexts.length);
    return headerTexts[randomIndex];
}

document.getElementById("text").textContent = getRandomHeaderText();