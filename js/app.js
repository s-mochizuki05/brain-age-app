/**
 * Brain Age App - Main Controller
 */
import { MemoryGame } from './memory.js?v=2';
import { MathGame } from './math.js?v=2';
import { MatrixGame } from './matrix.js?v=1';


// State
const state = {
    currentScreen: 'home',
    games: [
        { id: 'memory', title: '瞬間記憶', module: null, score: 0 },
        { id: 'math', title: '計算問題', module: null, score: 0 },
        { id: 'matrix', title: '早押しマトリックス', module: null, score: 0 }
    ],
    currentGameIndex: 0,
    totalScore: 0,
    brainAge: 0
};

// DOM Elements
const elements = {
    screens: {
        home: document.getElementById('home'),
        intro: document.getElementById('game-intro'),
        game: document.getElementById('game-play'),
        result: document.getElementById('result')
    },
    buttons: {
        start: document.getElementById('btn-start'),
        introStart: document.getElementById('btn-intro-start'),
        retry: document.getElementById('btn-retry')
    },
    text: {
        introTitle: document.getElementById('intro-title'),
        introDesc: document.getElementById('intro-desc'),
        gameTitle: document.getElementById('game-title-display'),
        gameScore: document.getElementById('game-score-display'),
        resultAge: document.getElementById('result-age'),
        resultScoreMemory: document.getElementById('result-score-memory'),
        resultScoreMath: document.getElementById('result-score-math'),
        resultScoreMatrix: document.getElementById('result-score-matrix')
    },
    gameArea: document.getElementById('game-area')
};

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    preloadGameModules();
});

function setupEventListeners() {
    elements.buttons.start.addEventListener('click', () => {
        showGameIntro(0);
    });

    elements.buttons.introStart.addEventListener('click', () => {
        startGame(state.currentGameIndex);
    });

    elements.buttons.retry.addEventListener('click', () => {
        resetApp();
    });
}

function preloadGameModules() {
    // Modules imported statically
    console.log('Game modules loaded.');
}

// Navigation
function switchScreen(screenName) {
    // Hide all screens
    Object.values(elements.screens).forEach(screen => {
        screen.classList.remove('active');
        screen.classList.add('hidden');
    });

    // Show target screen
    const target = elements.screens[screenName];
    target.classList.remove('hidden');
    // Force reflow
    void target.offsetWidth;
    target.classList.add('active');

    state.currentScreen = screenName;
}

// Game Flow
function showGameIntro(gameIndex) {
    state.currentGameIndex = gameIndex;
    const game = state.games[gameIndex];

    // Update intro text based on game
    if (game.id === 'memory') {
        elements.text.introTitle.textContent = 'GAME 1: 瞬間記憶';
        elements.text.introDesc.textContent = '画面に一瞬だけ表示される数字を覚えてください。数字が消えたら、小さい数字から順番にタップしてください。';
    } else if (game.id === 'math') {
        elements.text.introTitle.textContent = 'GAME 2: 計算問題';
        elements.text.introDesc.textContent = '次々と表示される計算問題の答えを入力してください。スピードが重要です。';
    } else if (game.id === 'matrix') {
        elements.text.introTitle.textContent = 'GAME 3: 早押しマトリックス';
        elements.text.introDesc.textContent = '1から25までの数字を、小さい順にできるだけ速くタップしてください。';
    }

    switchScreen('intro');
}

async function startGame(gameIndex) {
    const game = state.games[gameIndex];
    switchScreen('game');
    elements.text.gameTitle.textContent = game.title;
    elements.text.gameScore.textContent = '';

    // Clear game area
    elements.gameArea.innerHTML = '';

    // Delegate to game logic
    if (game.id === 'memory') {
        const memoryGame = new MemoryGame(elements.gameArea, (score) => {
            finishGame(gameIndex, score);
        });
        memoryGame.start();
        state.games[gameIndex].instance = memoryGame;
    } else if (game.id === 'math') {
        const mathGame = new MathGame(elements.gameArea, (score) => {
            finishGame(gameIndex, score);
        });
        mathGame.start();
        state.games[gameIndex].instance = mathGame;
    } else if (game.id === 'matrix') {
        const matrixGame = new MatrixGame(elements.gameArea, (score) => {
            finishGame(gameIndex, score);
        });
        matrixGame.start();
        state.games[gameIndex].instance = matrixGame;
    }
}

function finishGame(gameIndex, score) {
    state.games[gameIndex].score = score;
    console.log(`Finished ${state.games[gameIndex].title} with score: ${score}`);

    if (gameIndex < state.games.length - 1) {
        // Next game
        showGameIntro(gameIndex + 1);
    } else {
        // All games finished
        showResult();
    }
}

function showResult() {
    // Calculate Brain Age
    const totalScore = state.games.reduce((acc, game) => acc + game.score, 0);

    // Logic for 3 games: 
    // Approx max score: Memory(~1500) + Math(~1000) + Matrix(~1000) = ~3500
    // Min Score ~ 500
    // Age scaling: 
    // Max(3500) -> 20 years old
    // Min(500) -> 80 years old
    // Linear: Age = 80 - (Score / 3500) * 60  (Roughly)

    let age = 80 - Math.floor((totalScore / 3500) * 60);
    age = Math.max(20, Math.min(80, age)); // Clamp betweeen 20 and 80

    state.brainAge = age;

    elements.text.resultAge.textContent = state.brainAge;
    elements.text.resultScoreMemory.textContent = state.games[0].score;
    elements.text.resultScoreMath.textContent = state.games[1].score;
    elements.text.resultScoreMatrix.textContent = state.games[2].score;

    switchScreen('result');
}


function resetApp() {
    state.games.forEach(g => g.score = 0);
    state.currentGameIndex = 0;
    state.totalScore = 0;
    state.brainAge = 0;
    switchScreen('home');
}
