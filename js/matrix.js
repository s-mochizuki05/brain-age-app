/**
 * Matrix Challenge Game Module
 * Logic: Touch numbers 1-25 in order as fast as possible.
 */

export class MatrixGame {
    constructor(container, onFinish) {
        this.container = container;
        this.onFinish = onFinish;
        this.score = 0;
        this.startTime = 0;
        this.isGameActive = false;
        this.timerInterval = null;
        this.nextExpectedNum = 1;
        this.maxNum = 25;
    }

    start() {
        this.score = 0;
        this.nextExpectedNum = 1;
        this.isGameActive = true;
        this.setupUI();
        this.startLevel();
    }


    setupUI() {
        this.container.innerHTML = `
                <div class="matrix-hud">
                    <div class="timer-display">Time: <span id="matrix-time">0.00</span>s</div>
                    <div class="next-display"><span id="matrix-next">0</span> / 25</div>
                </div>
                
                <div id="matrix-grid" class="matrix-grid">
                    <!-- 5x5 Grid generated here -->
                </div>

                <div id="matrix-message" class="matrix-message hidden"></div>
            </div>
        `;

        this.grid = this.container.querySelector('#matrix-grid');
        this.timerEl = this.container.querySelector('#matrix-time');
        this.nextEl = this.container.querySelector('#matrix-next');
        this.messageEl = this.container.querySelector('#matrix-message');
    }


    startLevel() {
        // Generate numbers 1-25
        const numbers = Array.from({ length: this.maxNum }, (_, i) => i + 1);

        // Shuffle (Fisher-Yates)
        for (let i = numbers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
        }

        // Render Grid
        this.grid.innerHTML = '';
        numbers.forEach(num => {
            const btn = document.createElement('div');
            btn.className = 'matrix-cell';
            btn.textContent = num;
            btn.dataset.num = num;
            btn.addEventListener('pointerdown', (e) => this.handleCellClick(e, num));
            this.grid.appendChild(btn);
        });

        // Start Timer
        this.startTime = Date.now();
        this.timerInterval = setInterval(() => {
            const elapsed = (Date.now() - this.startTime) / 1000;
            this.timerEl.textContent = elapsed.toFixed(2);
        }, 50); // Update every 50ms
    }

    handleCellClick(e, num) {
        if (!this.isGameActive) return;

        if (num === this.nextExpectedNum) {
            // Correct
            const btn = e.target;
            btn.classList.add('correct');
            // Visual playfulness
            // this.createRipple(e.pageX, e.pageY, 'correct');

            this.nextExpectedNum++;

            if (this.nextExpectedNum > this.maxNum) {
                this.nextEl.textContent = this.maxNum;
                this.gameClear();
            } else {
                this.nextEl.textContent = this.nextExpectedNum - 1;
            }
        } else {
            // Wrong
            // Visual feedback?
            // Maybe just no reaction or small shake
            // For now, no strict penalty, just time loss
        }
    }

    gameClear() {
        this.isGameActive = false;
        clearInterval(this.timerInterval);

        const finalTime = (Date.now() - this.startTime) / 1000;

        // Calculate Score
        // Base score 1000. Less 10 pts per second?
        // 20s = 800pts
        // 40s = 600pts
        // 60s = 400pts
        // Min 0
        let calcScore = 1200 - (finalTime * 15);
        this.score = Math.max(0, Math.floor(calcScore));

        this.messageEl.textContent = 'Finish!';
        this.messageEl.classList.remove('hidden');

        setTimeout(() => {
            this.onFinish(this.score);
        }, 2000);
    }
}
