// Trade Simulator Module

class TradeSimulator {
    constructor() {
        this.isRunning = false;
        this.currentPrice = 100;
        this.positions = [];
        this.sessionStats = {
            trades: 0,
            wins: 0,
            losses: 0,
            pnl: 0
        };
        this.chart = null;
        this.priceData = [];
        this.speed = 1;
        this.initialize();
    }

    initialize() {
        this.setupEventListeners();
        this.createChart();
    }

    setupEventListeners() {
        // Speed selector
        const speedSelect = document.getElementById('simSpeed');
        if (speedSelect) {
            speedSelect.addEventListener('change', (e) => {
                this.speed = parseInt(e.target.value);
            });
        }
    }

    createChart() {
        const ctx = document.getElementById('simChart');
        if (!ctx) return;

        this.chart = new Chart(ctx, {
            type: 'candlestick',
            data: {
                datasets: [{
                    label: 'Price',
                    data: []
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'minute'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.5)'
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.5)'
                        }
                    }
                }
            }
        });

        // Fallback to line chart if candlestick not available
        if (!this.chart.config.type) {
            this.chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Price',
                        data: [],
                        borderColor: 'rgb(0, 211, 149)',
                        backgroundColor: 'rgba(0, 211, 149, 0.1)',
                        borderWidth: 2,
                        tension: 0.1,
                        pointRadius: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        x: {
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            },
                            ticks: {
                                color: 'rgba(255, 255, 255, 0.5)'
                            }
                        },
                        y: {
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            },
                            ticks: {
                                color: 'rgba(255, 255, 255, 0.5)'
                            }
                        }
                    }
                }
            });
        }
    }

    start() {
        if (this.isRunning) return;

        this.isRunning = true;
        this.sessionStats = { trades: 0, wins: 0, losses: 0, pnl: 0 };
        this.positions = [];
        this.priceData = [];

        // Get selected ticker
        const ticker = document.getElementById('simTicker').value;

        // Initialize price based on ticker
        const startPrices = {
            'SPY': 450,
            'AAPL': 175,
            'TSLA': 250,
            'QQQ': 380
        };

        this.currentPrice = startPrices[ticker] || 100;

        notify.success(`Simulation started! Trading ${ticker} 📈`);

        // Start price updates
        this.updateLoop();
    }

    stop() {
        this.isRunning = false;

        // Close all positions
        this.positions.forEach(pos => {
            this.closePosition(pos, this.currentPrice);
        });

        // Show session summary
        this.showSessionSummary();

        notify.info('Simulation stopped 🛑');
    }

    updateLoop() {
        if (!this.isRunning) return;

        // Generate new price
        const volatility = 0.002 * this.speed;
        const change = (Math.random() - 0.5) * volatility;
        this.currentPrice *= (1 + change);

        // Add to price data
        const now = new Date();
        const candle = {
            x: now,
            o: this.priceData.length > 0 ? this.priceData[this.priceData.length - 1].c : this.currentPrice,
            h: this.currentPrice * (1 + Math.random() * 0.001),
            l: this.currentPrice * (1 - Math.random() * 0.001),
            c: this.currentPrice
        };

        this.priceData.push(candle);

        // Keep last 100 candles
        if (this.priceData.length > 100) {
            this.priceData.shift();
        }

        // Update chart
        this.updateChart();

        // Update display
        this.updateDisplay();

        // Check positions
        this.checkPositions();

        // Continue loop
        setTimeout(() => this.updateLoop(), 1000 / this.speed);
    }

    updateChart() {
        if (!this.chart) return;

        if (this.chart.config.type === 'candlestick') {
            this.chart.data.datasets[0].data = this.priceData;
        } else {
            // Line chart fallback
            this.chart.data.labels = this.priceData.map(d => d.x);
            this.chart.data.datasets[0].data = this.priceData.map(d => d.c);
        }

        this.chart.update('none'); // No animation for performance
    }

    updateDisplay() {
        // Update price
        const priceEl = document.getElementById('simPrice');
        if (priceEl) {
            priceEl.textContent = `$${this.currentPrice.toFixed(2)}`;

            // Color based on change
            if (this.priceData.length > 1) {
                const prevPrice = this.priceData[this.priceData.length - 2].c;
                priceEl.style.color = this.currentPrice > prevPrice ?
                    'var(--color-accent-green)' : 'var(--color-accent-red)';
            }
        }

        // Update volume (simulated)
        const volumeEl = document.getElementById('simVolume');
        if (volumeEl) {
            const volume = Math.floor(Math.random() * 1000000) + 100000;
            volumeEl.textContent = helpers.formatNumber(volume);
        }

        // Update bid/ask
        const bidAskEl = document.getElementById('simBidAsk');
        if (bidAskEl) {
            const spread = 0.01;
            const bid = (this.currentPrice - spread).toFixed(2);
            const ask = (this.currentPrice + spread).toFixed(2);
            bidAskEl.textContent = `${bid}/${ask}`;
        }

        // Update session stats
        this.updateSessionStats();
    }

    buy() {
        const shares = parseInt(document.getElementById('simShares').value);

        const position = {
            id: Date.now(),
            type: 'LONG',
            symbol: document.getElementById('simTicker').value,
            entry: this.currentPrice,
            shares: shares,
            timestamp: new Date()
        };

        this.positions.push(position);
        this.updatePositionsList();

        notify.success(`Bought ${shares} shares at $${this.currentPrice.toFixed(2)} 📈`);
    }

    sell() {
        if (this.positions.length === 0) {
            notify.warning('No positions to sell!');
            return;
        }

        // Close oldest position
        const position = this.positions.shift();
        this.closePosition(position, this.currentPrice);

        this.updatePositionsList();
    }

    closePosition(position, exitPrice) {
        const pnl = (exitPrice - position.entry) * position.shares;

        this.sessionStats.trades++;
        this.sessionStats.pnl += pnl;

        if (pnl > 0) {
            this.sessionStats.wins++;
            notify.success(`Closed for profit: ${helpers.formatCurrency(pnl)} 💰`);
        } else {
            this.sessionStats.losses++;
            notify.error(`Closed for loss: ${helpers.formatCurrency(pnl)} 📉`);
        }

        // Log to journal
        storage.saveTrade({
            symbol: position.symbol,
            strategy: 'Simulator Practice',
            entry: position.entry,
            exit: exitPrice,
            shares: position.shares,
            result: pnl > 0 ? 'win' : 'loss',
            pnl: pnl
        });
    }

    updatePositionsList() {
        const container = document.getElementById('positionsList');
        if (!container) return;

        if (this.positions.length === 0) {
            container.innerHTML = '<p style="color: var(--color-text-secondary);">No open positions</p>';
            return;
        }

        container.innerHTML = '';

        this.positions.forEach(pos => {
            const pnl = (this.currentPrice - pos.entry) * pos.shares;
            const pnlPercent = ((this.currentPrice - pos.entry) / pos.entry * 100).toFixed(2);
            const pnlColor = pnl > 0 ? 'var(--color-accent-green)' : 'var(--color-accent-red)';

            const posEl = document.createElement('div');
            posEl.style.cssText = `
                background: var(--color-bg-tertiary);
                padding: 8px;
                border-radius: 6px;
                margin-bottom: 8px;
            `;

            posEl.innerHTML = `
                <div style="display: flex; justify-content: space-between;">
                    <span>${pos.shares} @ $${pos.entry.toFixed(2)}</span>
                    <span style="color: ${pnlColor};">
                        ${helpers.formatCurrency(pnl)} (${pnlPercent}%)
                    </span>
                </div>
            `;

            container.appendChild(posEl);
        });
    }

    checkPositions() {
        // Could add stop loss / take profit logic here
        this.positions.forEach(pos => {
            const pnl = (this.currentPrice - pos.entry) * pos.shares;
            const pnlPercent = (this.currentPrice - pos.entry) / pos.entry;

            // Auto close at 2% profit or 1% loss
            if (pnlPercent > 0.02 || pnlPercent < -0.01) {
                this.positions = this.positions.filter(p => p.id !== pos.id);
                this.closePosition(pos, this.currentPrice);
                this.updatePositionsList();
            }
        });
    }

    updateSessionStats() {
        const winRate = this.sessionStats.trades > 0 ?
            (this.sessionStats.wins / this.sessionStats.trades * 100).toFixed(1) : 0;

        document.getElementById('sessionPnL').textContent =
            helpers.formatCurrency(this.sessionStats.pnl);
        document.getElementById('sessionTrades').textContent =
            this.sessionStats.trades;
        document.getElementById('sessionWinRate').textContent =
            `${winRate}%`;

        // Color code P&L
        const pnlEl = document.getElementById('sessionPnL');
        pnlEl.style.color = this.sessionStats.pnl >= 0 ?
            'var(--color-accent-green)' : 'var(--color-accent-red)';
    }

    showSessionSummary() {
        const summary = `
            <div style="padding: 20px; text-align: center;">
                <h3 style="margin-bottom: 20px;">Session Complete! 🏁</h3>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; max-width: 400px; margin: 0 auto;">
                    <div>
                        <div style="color: var(--color-text-secondary);">Total Trades</div>
                        <div style="font-size: 2rem; font-weight: bold;">${this.sessionStats.trades}</div>
                    </div>
                    <div>
                        <div style="color: var(--color-text-secondary);">Win Rate</div>
                        <div style="font-size: 2rem; font-weight: bold; color: var(--color-accent-green);">
                            ${this.sessionStats.trades > 0 ?
                                (this.sessionStats.wins / this.sessionStats.trades * 100).toFixed(1) : 0}%
                        </div>
                    </div>
                    <div style="grid-column: span 2;">
                        <div style="color: var(--color-text-secondary);">Session P&L</div>
                        <div style="font-size: 3rem; font-weight: bold; color: ${
                            this.sessionStats.pnl >= 0 ? 'var(--color-accent-green)' : 'var(--color-accent-red)'
                        };">
                            ${helpers.formatCurrency(this.sessionStats.pnl)}
                        </div>
                    </div>
                </div>
                <button onclick="notify.dismiss(this.parentElement.parentElement)"
                    style="margin-top: 20px; padding: 10px 20px; background: var(--gradient-green);
                    border: none; border-radius: 6px; color: var(--color-bg-primary);
                    font-weight: bold; cursor: pointer;">
                    Close
                </button>
            </div>
        `;

        notify.custom(summary, {
            duration: 15000,
            position: 'center'
        });
    }
}