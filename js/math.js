/**
 * Math Challenge Game Module
 * Logic: Time attack arithmetic problems.
 */

export class MathGame {
    constructor(container, onFinish) {
        this.container = container;
        this.onFinish = onFinish;
        this.score = 0;
        this.limitTime = 60; // seconds
        this.timeLeft = this.limitTime;
        this.currentProblem = null;
        this.isGameActive = false;
        this.timerInterval = null;
    }

    start() {
        this.score = 0;
        this.timeLeft = this.limitTime;
        this.isGameActive = true;
        this.setupUI();
        this.nextProblem();
        this.startTimer();
    }

    setupUI() {
        this.container.innerHTML = `
            <div class="math-game-container">
                <div class="math-hud">
                    <div class="timer-display">Time: <span id="math-time">${this.limitTime}</span></div>
                    <div class="score-display">Score: <span id="math-score">0</span></div>
                </div>
                
                <div class="problem-display">
                    <span id="math-problem">Ready?</span>
                    <span class="equals">=</span>
                    <span id="math-answer" class="answer-box">?</span>
                </div>

                <div class="keypad">
                    <button class="key-btn" data-val="7">7</button>
                    <button class="key-btn" data-val="8">8</button>
                    <button class="key-btn" data-val="9">9</button>
                    <button class="key-btn" data-val="4">4</button>
                    <button class="key-btn" data-val="5">5</button>
                    <button class="key-btn" data-val="6">6</button>
                    <button class="key-btn" data-val="1">1</button>
                    <button class="key-btn" data-val="2">2</button>
                    <button class="key-btn" data-val="3">3</button>
                    <button class="key-btn action-btn text-sm" data-val="del">DEL</button>
                    <button class="key-btn" data-val="0">0</button>
                    <button class="key-btn action-btn" data-val="enter">OK</button>
                </div>
            </div>
        `;

        this.problemEl = this.container.querySelector('#math-problem');
        this.answerEl = this.container.querySelector('#math-answer');
        this.timerEl = this.container.querySelector('#math-time');
        this.scoreEl = this.container.querySelector('#math-score');

        // Keypad listeners
        this.container.querySelectorAll('.key-btn').forEach(btn => {
            btn.addEventListener('pointerdown', (e) => {
                e.preventDefault(); // Prevent double tap zoom etc
                this.handleInput(btn.dataset.val);
            });
        });

        // Keyboard support
        document.addEventListener('keydown', this.handleKeydown.bind(this));

        this.currentInput = '';
    }

    handleKeydown(e) {
        if (!this.isGameActive) return;

        if (e.key >= '0' && e.key <= '9') {
            this.handleInput(e.key);
        } else if (e.key === 'Backspace') {
            this.handleInput('del');
        } else if (e.key === 'Enter') {
            this.handleInput('enter');
        }
    }

    handleInput(val) {
        if (!this.isGameActive) return;

        if (val === 'del') {
            this.currentInput = this.currentInput.slice(0, -1);
        } else if (val === 'enter') {
            this.checkAnswer();
        } else {
            if (this.currentInput.length < 3) {
                this.currentInput += val;
            }
        }
        this.updateAnswerDisplay();
    }

    updateAnswerDisplay() {
        this.answerEl.textContent = this.currentInput === '' ? '?' : this.currentInput;
        if (this.currentInput !== '') {
            this.answerEl.classList.add('active');
        } else {
            this.answerEl.classList.remove('active');
        }
    }

    nextProblem() {
        // Difficulty progression based on score/time
        // Level 1: A + B (Simple)
        // Level 2: A - B (Positive result)
        // Level 3: A * B (Simple)
        const type = Math.random();
        let a, b, op, ans;

        if (this.timeLeft > 45) { // Easy phase
            op = '+';
            a = Math.floor(Math.random() * 9) + 1;
            b = Math.floor(Math.random() * 9) + 1;
        } else if (this.timeLeft > 30) { // Medium phase
            if (Math.random() > 0.5) {
                op = '-';
                a = Math.floor(Math.random() * 15) + 5;
                b = Math.floor(Math.random() * (a - 1)) + 1; // Ensure positive
            } else {
                op = '+';
                a = Math.floor(Math.random() * 20) + 1;
                b = Math.floor(Math.random() * 20) + 1;
            }
        } else { // Hard phase
            const r = Math.random();
            if (r < 0.3) {
                op = '*';
                a = Math.floor(Math.random() * 9) + 2;
                b = Math.floor(Math.random() * 9) + 2;
            } else if (r < 0.6) {
                op = '-';
                a = Math.floor(Math.random() * 40) + 10;
                b = Math.floor(Math.random() * (a - 1)) + 1;
            } else {
                op = '+';
                a = Math.floor(Math.random() * 40) + 10;
                b = Math.floor(Math.random() * 40) + 10;
            }
        }

        if (op === '+') ans = a + b;
        if (op === '-') ans = a - b;
        if (op === '*') ans = a * b;

        this.currentProblem = { a, b, op, ans };

        // Display symbol adjustment
        const displayOp = op === '*' ? '×' : op;
        this.problemEl.textContent = `${a} ${displayOp} ${b}`;

        this.currentInput = '';
        this.updateAnswerDisplay();
    }

    checkAnswer() {
        if (this.currentInput === '') return;

        const inputVal = parseInt(this.currentInput, 10);
        if (inputVal === this.currentProblem.ans) {
            // Correct
            // Difficulty based points
            let points = 10;
            if (this.timeLeft <= 30) points = 20;
            if (this.timeLeft <= 15) points = 30;

            this.score += points;
            this.scoreEl.textContent = this.score;

            this.createFeedback('OK', 'success');
            this.nextProblem();
        } else {
            // Wrong
            this.createFeedback('MISS', 'error');
            this.currentInput = '';
            this.updateAnswerDisplay();
            // Penalty? Maybe just time loss (by user hesitation)
        }
    }

    createFeedback(text, type) {
        const fb = document.createElement('div');
        fb.textContent = text;
        fb.className = `math-feedback ${type}`;
        this.container.querySelector('.math-game-container').appendChild(fb);
        setTimeout(() => fb.remove(), 500);
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.timerEl.textContent = this.timeLeft;

            if (this.timeLeft <= 10) {
                this.timerEl.classList.add('urgent');
            }

            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);
    }

    endGame() {
        clearInterval(this.timerInterval);
        document.removeEventListener('keydown', this.handleKeydown);
        this.isGameActive = false;

        this.container.innerHTML = `<div class="game-over-msg">TIME UP!</div>`;

        setTimeout(() => {
            this.onFinish(this.score);
        }, 2000);
    }
}
