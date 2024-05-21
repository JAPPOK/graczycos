const gameBoard = document.querySelector('.game-board');
const scoreElement = document.getElementById('score');
let score = 0;
let comboCount = 0;

// Mapa klawiszy do torów
const keyMapping = {
    'a': 'trackA',
    's': 'trackS',
    'j': 'trackJ',
    'k': 'trackK',
};

document.addEventListener('keydown', (event) => {
    const targetId = keyMapping[event.key.toLowerCase()];
    if (targetId) {
        checkHit(targetId);
    }
});

function checkHit(trackId) {
    const track = document.getElementById(trackId);
    const squares = track.querySelectorAll('.falling');

    squares.forEach((square) => {
        const squareRect = square.getBoundingClientRect();
        const trackRect = track.querySelector('.target').getBoundingClientRect();

        const tolerance = 30;

        if (
            squareRect.bottom >= trackRect.top - tolerance &&
            squareRect.bottom <= trackRect.top + tolerance &&
            !square.hasAttribute('clicked')
        ) {
            comboCount++;
            score += comboCount;
            updateScore();
            animateScore();
            square.setAttribute('clicked', 'true');
            square.remove(); 
        }
    });
}

function startGame() {
    setInterval(() => {
        const randomTrack = getRandomTrack();
        createFallingSquare(randomTrack);
    }, 300);
}

function createFallingSquare(track) {
    const square = document.createElement('div');
    square.className = 'falling';
    track.appendChild(square);

    square.addEventListener('animationend', () => {
        square.remove();
    });
}

function getRandomTrack() {
    const tracks = document.querySelectorAll('.track');
    const randomIndex = Math.floor(Math.random() * tracks.length);
    return tracks[randomIndex];
}

function updateScore() {
    scoreElement.textContent = score; 
    console.log(score)
}

function clearScore() {
    score = 0; 
    comboCount = 0;
    updateScore()
}

startGame();
