// Pattern Practice Module

class PatternPractice {
    constructor() {
        this.patterns = this.loadPatterns();
        this.currentPattern = null;
        this.score = 0;
        this.streak = 0;
        this.initialize();
    }

    initialize() {
        this.setupEventListeners();
        this.loadScore();
    }

    setupEventListeners() {
        // Pattern type selector
        const selector = document.getElementById('patternType');
        if (selector) {
            selector.addEventListener('change', () => this.loadNewPattern());
        }

        // Answer buttons
        document.querySelectorAll('.answer-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const answer = parseInt(e.target.dataset.answer);
                this.checkAnswer(answer);
            });
        });
    }

    loadPatterns() {
        return {
            bullish: [
                { name: 'Bull Flag', description: 'Consolidation after strong upward move' },
                { name: 'Cup and Handle', description: 'U-shaped recovery with small consolidation' },
                { name: 'Ascending Triangle', description: 'Higher lows with resistance ceiling' },
                { name: 'Double Bottom', description: 'Two lows at similar price level' }
            ],
            bearish: [
                { name: 'Bear Flag', description: 'Consolidation after strong downward move' },
                { name: 'Head and Shoulders', description: 'Three peaks with middle highest' },
                { name: 'Descending Triangle', description: 'Lower highs with support floor' },
                { name: 'Double Top', description: 'Two highs at similar price level' }
            ],
            reversal: [
                { name: 'Morning Star', description: 'Three-candle bullish reversal' },
                { name: 'Evening Star', description: 'Three-candle bearish reversal' },
                { name: 'Hammer', description: 'Small body with long lower shadow' },
                { name: 'Shooting Star', description: 'Small body with long upper shadow' }
            ],
            continuation: [
                { name: 'Pennant', description: 'Small symmetrical triangle after sharp move' },
                { name: 'Rectangle', description: 'Price moves between parallel levels' },
                { name: 'Wedge', description: 'Converging trend lines in direction of trend' },
                { name: 'Flag', description: 'Rectangular consolidation against trend' }
            ]
        };
    }

    loadNewPattern() {
        const type = document.getElementById('patternType').value;
        let availablePatterns = [];

        if (type === 'all') {
            Object.values(this.patterns).forEach(patterns => {
                availablePatterns = availablePatterns.concat(patterns);
            });
        } else {
            availablePatterns = this.patterns[type] || [];
        }

        // Select random pattern
        this.currentPattern = helpers.getRandomElement(availablePatterns);

        // Generate pattern data and display
        this.displayPattern();

        // Generate answer options
        this.generateAnswers();
    }

    displayPattern() {
        const canvas = document.getElementById('patternChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width = canvas.offsetWidth;
        const height = canvas.height = 300;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Generate appropriate price data for the pattern
        const priceData = this.generatePatternData(this.currentPattern.name);

        // Draw candlesticks
        const candleWidth = width / priceData.length;

        priceData.forEach((candle, index) => {
            const x = index * candleWidth;
            const yScale = height / (Math.max(...priceData.map(d => d.high)) - Math.min(...priceData.map(d => d.low)));
            const min = Math.min(...priceData.map(d => d.low));

            // Candle body
            const bodyTop = height - (Math.max(candle.open, candle.close) - min) * yScale;
            const bodyBottom = height - (Math.min(candle.open, candle.close) - min) * yScale;
            const bodyHeight = bodyBottom - bodyTop;

            ctx.fillStyle = candle.close > candle.open ? '#00d395' : '#f6465d';
            ctx.fillRect(x + candleWidth * 0.2, bodyTop, candleWidth * 0.6, bodyHeight);

            // Wicks
            const highY = height - (candle.high - min) * yScale;
            const lowY = height - (candle.low - min) * yScale;

            ctx.strokeStyle = ctx.fillStyle;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x + candleWidth * 0.5, highY);
            ctx.lineTo(x + candleWidth * 0.5, lowY);
            ctx.stroke();
        });

        // Update question
        document.getElementById('patternQuestion').textContent =
            'What pattern is shown in this chart?';
    }

    generatePatternData(patternName) {
        // Generate specific data for each pattern type
        // This is simplified - in real implementation, each pattern would have unique generation logic
        const basePrice = 100;
        const periods = 50;
        const data = [];

        for (let i = 0; i < periods; i++) {
            const trend = i / periods;
            let price = basePrice;

            // Add pattern-specific price movements
            switch(patternName) {
                case 'Bull Flag':
                    if (i < 20) price = basePrice + i * 0.5;
                    else if (i < 35) price = basePrice + 10 - (i - 20) * 0.1;
                    else price = basePrice + 8.5 + (i - 35) * 0.3;
                    break;
                case 'Cup and Handle':
                    if (i < 15) price = basePrice - i * 0.3;
                    else if (i < 35) price = basePrice - 4.5 + (i - 15) * 0.225;
                    else price = basePrice - (i - 35) * 0.1;
                    break;
                default:
                    price = basePrice + (Math.random() - 0.5) * 2;
            }

            const volatility = 0.5;
            const open = price + (Math.random() - 0.5) * volatility;
            const close = price + (Math.random() - 0.5) * volatility;
            const high = Math.max(open, close) + Math.random() * volatility;
            const low = Math.min(open, close) - Math.random() * volatility;

            data.push({ open, high, low, close });
        }

        return data;
    }

    generateAnswers() {
        const allPatterns = [];
        Object.values(this.patterns).forEach(patterns => {
            patterns.forEach(p => allPatterns.push(p.name));
        });

        // Remove current pattern and shuffle
        const otherPatterns = allPatterns.filter(p => p !== this.currentPattern.name);
        const wrongAnswers = [];

        for (let i = 0; i < 3; i++) {
            const index = Math.floor(Math.random() * otherPatterns.length);
            wrongAnswers.push(otherPatterns.splice(index, 1)[0]);
        }

        // Create answer array with correct answer at random position
        const answers = [...wrongAnswers];
        const correctPosition = Math.floor(Math.random() * 4);
        answers.splice(correctPosition, 0, this.currentPattern.name);

        // Update buttons
        document.querySelectorAll('.answer-btn').forEach((btn, index) => {
            btn.textContent = answers[index];
            btn.dataset.correct = index === correctPosition;
            btn.classList.remove('correct', 'incorrect');
        });
    }

    checkAnswer(answerIndex) {
        const buttons = document.querySelectorAll('.answer-btn');
        const selectedBtn = buttons[answerIndex - 1];
        const isCorrect = selectedBtn.dataset.correct === 'true';

        if (isCorrect) {
            selectedBtn.classList.add('correct');
            this.score += 10;
            this.streak++;

            notify.success(`Correct! ${this.currentPattern.description} 🎯`);

            // Update score
            this.updateScore();

            // Load new pattern after delay
            setTimeout(() => this.loadNewPattern(), 2000);
        } else {
            selectedBtn.classList.add('incorrect');
            this.streak = 0;

            // Show correct answer
            buttons.forEach(btn => {
                if (btn.dataset.correct === 'true') {
                    btn.classList.add('correct');
                }
            });

            notify.error(`Incorrect. The pattern was ${this.currentPattern.name}`);

            // Load new pattern after longer delay
            setTimeout(() => this.loadNewPattern(), 3000);
        }

        // Disable all buttons temporarily
        buttons.forEach(btn => btn.disabled = true);
        setTimeout(() => {
            buttons.forEach(btn => btn.disabled = false);
        }, 2000);
    }

    loadScore() {
        const saved = storage.load('patternScore', { score: 0, highScore: 0 });
        this.score = saved.score;
        this.updateScore();
    }

    updateScore() {
        document.getElementById('patternScore').textContent = `Score: ${this.score}`;

        // Save score
        const saved = storage.load('patternScore', { score: 0, highScore: 0 });
        saved.score = this.score;
        saved.highScore = Math.max(saved.highScore, this.score);
        storage.save('patternScore', saved);

        // Save to pattern scores history
        storage.savePatternScore(this.score);
    }

    newPattern() {
        this.loadNewPattern();
    }
}