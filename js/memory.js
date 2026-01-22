/**
 * Instant Memory Game Module
 * Logic: Chimp Test style - Numbers appear, then hide. User taps in ascending order.
 */

export class MemoryGame {
    constructor(container, onFinish) {
        this.container = container;
        this.onFinish = onFinish;
        this.score = 0;
        this.level = 1;
        this.maxLevel = 5;
        this.lives = 3;
        this.baseTime = 2000; // ms
        this.numbers = [];
        this.isGameActive = false;
        this.nextExpectedNum = 1;
    }

    start() {
        this.score = 0;
        this.level = 1;
        this.lives = 3;
        this.isGameActive = true;
        this.setupUI();
        this.startLevel();
    }

    setupUI() {
        this.container.innerHTML = `
            <div class="memory-game-container">
                <div class="hud">
                    <span class="hud-item">Level: <span id="mem-level">1</span></span>
                    <span class="hud-item hearts" id="mem-lives">❤️❤️❤️</span>
                </div>
                <div id="memory-board" class="memory-board"></div>
                <div id="mem-message" class="message-overlay hidden"></div>
            </div>
        `;
        this.board = this.container.querySelector('#memory-board');
        this.levelDisplay = this.container.querySelector('#mem-level');
        this.livesDisplay = this.container.querySelector('#mem-lives');
        this.messageOverlay = this.container.querySelector('#mem-message');
    }

    startLevel() {
        if (!this.isGameActive) return;

        this.board.innerHTML = '';
        this.nextExpectedNum = 1;
        this.levelDisplay.textContent = this.level;

        // Config per level
        // Level 1: 3 numbers
        // Level 2: 4 numbers
        // ...
        const count = 2 + this.level;
        this.numbers = [];

        // Generate positions (Grid 4x5 approx)
        // Simple collision avoidance
        const positions = this.generatePositions(count);

        for (let i = 1; i <= count; i++) {
            const card = document.createElement('div');
            card.className = 'memory-card visible';
            card.textContent = i;
            card.dataset.num = i;

            // Random position
            const pos = positions[i - 1];
            card.style.left = `${pos.x}%`;
            card.style.top = `${pos.y}%`;

            card.addEventListener('pointerdown', (e) => this.handleCardClick(e, i));

            this.board.appendChild(card);
            this.numbers.push(card);
        }

        // Hide timer
        // Hide timer
        let hideTime = Math.max(500, this.baseTime - (this.level * 200));

        // Slower hide time for level 5 and above
        if (this.level >= 5) {
            hideTime += 600; // Add 0.6s buffer for higher difficulty
        }

        setTimeout(() => {
            if (!this.isGameActive) return;
            this.hideAllCards();
        }, hideTime);
    }

    generatePositions(count) {
        const positions = [];
        const margin = 15; // margin from edge %

        for (let i = 0; i < count; i++) {
            let pos, collision;
            let attempts = 0;
            do {
                collision = false;
                pos = {
                    x: Math.floor(Math.random() * (100 - margin * 2)) + margin,
                    // Avoid top area (HUD) - Start Y from 25%
                    y: Math.floor(Math.random() * (100 - (margin + 20))) + 20
                };

                // Avoid Center Area (approx 30% to 70% X and Y)
                // Center X: 50, Center Y: 50
                // Exclusion zone: X[35-65], Y[40-60]
                if (pos.x > 35 && pos.x < 65 && pos.y > 40 && pos.y < 60) {
                    collision = true;
                    // Force retry without incrementing attempts too much to avoid getting stuck
                    // actually attempts++ is fine
                }

                if (!collision) {
                    // Check distance from other points
                    for (const p of positions) {
                        const dist = Math.sqrt(Math.pow(p.x - pos.x, 2) + Math.pow(p.y - pos.y, 2));
                        if (dist < 18) { // Minimum distance %
                            collision = true;
                            break;
                        }
                    }
                }
                attempts++;
            } while (collision && attempts < 100);


            positions.push(pos);
        }
        return positions;
    }

    hideAllCards() {
        this.numbers.forEach(card => {
            card.classList.remove('visible');
            card.classList.add('hidden-face');
            card.textContent = ''; // Hide number
        });
    }

    handleCardClick(e, num) {
        if (!this.isGameActive) return;

        const card = e.target;

        // Ignore if already revealed or clicked
        if (card.classList.contains('revealed')) return;

        if (num === this.nextExpectedNum) {
            // Correct
            this.nextExpectedNum++;
            card.classList.remove('hidden-face');
            card.classList.add('revealed');
            card.textContent = num; // Show number again

            // Pulse effect
            this.createRipple(e.pageX, e.pageY, 'correct');

            // Check level clear
            if (this.nextExpectedNum > this.numbers.length) {
                this.levelComplete();
            }
        } else {
            // Wrong
            this.handleMistake(card);
        }
    }

    createRipple(x, y, type) {
        const ripple = document.createElement('div');
        ripple.className = `ripple ${type}`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        document.body.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }

    handleMistake(card) {
        card.classList.add('shake');
        this.lives--;
        this.updateLives();
        this.createRipple(card.getBoundingClientRect().left + 30, card.getBoundingClientRect().top + 30, 'wrong');

        if (this.lives <= 0) {
            this.gameOver();
        } else {
            // Restart level or just continue?
            // Usually memory games restart the pattern showing
            // Removed overlay message
            setTimeout(() => {
                this.startLevel();
            }, 500);
        }
    }

    updateLives() {
        this.livesDisplay.textContent = '❤️'.repeat(this.lives) + '🖤'.repeat(3 - this.lives);
    }

    levelComplete() {
        const bonus = this.level * 100;
        this.score += bonus;
        this.level++;

        if (this.level > this.maxLevel) {
            this.gameClear();
        } else {
            // Removed overlay message as per user request
            // Just a short pause before next level
            setTimeout(() => {
                this.startLevel();
            }, 500);
        }

    }

    showMessage(text, duration) {
        this.messageOverlay.textContent = text;
        this.messageOverlay.classList.remove('hidden');
        if (duration) {
            setTimeout(() => {
                this.messageOverlay.classList.add('hidden');
            }, duration);
        }
    }

    gameClear() {
        this.isGameActive = false;
        this.showMessage('Perfect!', 1000);
        setTimeout(() => {
            this.onFinish(this.score + (this.lives * 50));
        }, 1500);
    }

    gameOver() {
        this.isGameActive = false;
        this.showMessage('Game Over', 1500);
        // Reveal all
        this.numbers.forEach(c => {
            c.textContent = c.dataset.num;
            c.classList.remove('hidden-face');
            c.classList.add('visible');
        });

        setTimeout(() => {
            this.onFinish(this.score);
        }, 2000);
    }
}
