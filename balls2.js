const gameBoard = document.querySelector('.game-board');
const scoreElement = document.getElementById('score');
const comboElement = document.getElementById('combo');
const lastHitElement = document.getElementById('lastHit');
let score = 0;
let combo = 0;
let holdActive = false;

const keyMapping = {
    'a': 'trackA',
    's': 'trackS',
    'j': 'trackJ',
    'k': 'trackK',
};

const pointsMapping = {
    'OK': 100,
    'GREAT': 200,
    'PERFECT': 300,
};

const tolerance = 50;

const minHoldDuration = 200;
const maxHoldDuration = 1000;

document.addEventListener('keydown', (event) => {
    const trackId = keyMapping[event.key.toLowerCase()];
    if (trackId) {
        const track = document.getElementById(trackId);
        const holdSquare = track.querySelector('.hold.active');
        if (holdSquare && !holdSquare.hasAttribute('clicked')) {
            startHold(trackId);
        } else {
            checkHit(trackId);
        }
    }
});

document.addEventListener('keyup', (event) => {
    const trackId = keyMapping[event.key.toLowerCase()];
    if (trackId && holdActive) {
        endHold(trackId);
    }
});

function startHold(trackId) {
    const track = document.getElementById(trackId);
    const holdSquare = track.querySelector('.hold.active');
    if (holdSquare) {
        holdSquare.classList.add('holding');
        holdActive = true;
        combo++;
        updateCombo();

        const holdDuration = getRandomHoldDuration();

        setTimeout(() => {
            if (holdActive && !holdSquare.hasAttribute('clicked')) {
                clearCombo();
                updateLastHit('MISS');
                holdSquare.remove();
                holdActive = false;
            }
        }, holdDuration);
    }
}

function endHold(trackId) {
    const track = document.getElementById(trackId);
    const holdSquare = track.querySelector('.hold.active');
    if (holdSquare) {
        if (!holdSquare.hasAttribute('clicked')) {
            let hitType = 'MISS';
            let points = 0;

            const holdDuration = Date.now() - parseInt(holdSquare.dataset.startTime);

            if (holdDuration >= 800) {
                hitType = 'PERFECT';
                points = pointsMapping['PERFECT'];
            } else if (holdDuration >= 500) {
                hitType = 'GREAT';
                points = pointsMapping['GREAT'];
            } else if (holdDuration >= 200) {
                hitType = 'OK';
                points = pointsMapping['OK'];
            }

            if (hitType !== 'MISS') {
                combo++;
                score += combo * points;
                updateScore();
                updateCombo();
                updateLastHit(hitType);
            } else {
                clearCombo();
                updateLastHit('MISS');
            }
        }
        holdSquare.remove();
        holdActive = false;
    }
}

function checkHit(trackId) {
    const track = document.getElementById(trackId);
    const squares = track.querySelectorAll('.falling, .hold');

    let hitType = 'MISS';

    squares.forEach((square) => {
        if (square.classList.contains('falling') && !square.hasAttribute('clicked')) {
            const squareRect = square.getBoundingClientRect();
            const trackRect = track.querySelector('.target').getBoundingClientRect();

            if (
                squareRect.bottom >= trackRect.top - tolerance &&
                squareRect.bottom <= trackRect.top + tolerance
            ) {
                hitType = calculateHitType(squareRect.bottom, trackRect.top, tolerance);
                if (hitType !== 'MISS') {
                    let points = pointsMapping[hitType];
                    combo++;
                    score += combo * points;
                    updateScore();
                    updateCombo();
                    updateLastHit(hitType);
                    square.setAttribute('clicked', 'true');
                    square.remove();
                }
            }
        } else if (square.classList.contains('hold') && !square.hasAttribute('clicked')) {
            clearCombo();
            updateLastHit('MISS');
            square.remove();
        }
    });

    if (hitType === 'MISS' && !holdActive) {
        clearCombo();
        updateLastHit('MISS');
    }

    return hitType;
}

function calculateHitType(squareBottom, trackTop, tolerance) {
    const holdTolerance = tolerance 

    if (squareBottom >= trackTop - holdTolerance && squareBottom <= trackTop + holdTolerance) {
        if (Math.abs(squareBottom - trackTop) <= holdTolerance / 3) {
            return 'PERFECT';
        } else if (Math.abs(squareBottom - trackTop) <= holdTolerance * 2 / 3) {
            return 'GREAT';
        } else {
            return 'OK';
        }
    }
    return 'MISS';
}

function getRandomHoldDuration() {
    return Math.floor(Math.random() * (maxHoldDuration - minHoldDuration + 1)) + minHoldDuration;
}

function startGame() {
    setInterval(() => {
        const randomTrack = getRandomTrack();
        const blockType = Math.random() < 0.5 ? 'falling' : 'hold';
        if (blockType === 'falling') {
            createFallingSquare(randomTrack);
        } else {
            createHoldSquare(randomTrack);
        }
    }, 1000);
}

function createFallingSquare(track) {
    const square = document.createElement('div');
    square.className = 'falling';
    track.appendChild(square);

    square.addEventListener('animationend', () => {
        if (!square.hasAttribute('clicked')) {
            clearCombo();
            updateLastHit('MISS');
        }
        square.remove();
    });
}

function createHoldSquare(track) {
    const square = document.createElement('div');
    square.className = 'hold active';
    square.dataset.startTime = Date.now();
    track.appendChild(square);

    square.addEventListener('animationend', () => {
        if (!square.hasAttribute('clicked') && holdActive) {
            clearCombo();
            updateLastHit('MISS');
        }
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
}

function updateCombo() {
    comboElement.textContent = combo;
}

function updateLastHit(hitType) {
    lastHitElement.textContent = hitType;
}

function clearScore() {
    score = 0;
    combo = 0;
    updateScore();
    updateCombo();
}

function clearCombo() {
    combo = 0;
    updateCombo();
}

startGame();
