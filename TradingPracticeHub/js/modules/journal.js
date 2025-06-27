// Quick Journal Module

class QuickJournal {
    constructor() {
        this.trades = [];
        this.initialize();
    }

    initialize() {
        this.setupEventListeners();
        this.loadRecentTrades();
        this.updateTodaySummary();
    }

    setupEventListeners() {
        const form = document.getElementById('tradeForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveTrade();
            });
        }

        // Emotion slider
        const emotionSlider = document.getElementById('jEmotions');
        if (emotionSlider) {
            emotionSlider.addEventListener('input', (e) => {
                document.getElementById('emotionValue').textContent = e.target.value;
            });
        }
    }

    saveTrade() {
        const trade = {
            symbol: document.getElementById('jSymbol').value.toUpperCase(),
            strategy: document.getElementById('jStrategy').value,
            entry: parseFloat(document.getElementById('jEntry').value),
            exit: parseFloat(document.getElementById('jExit').value),
            shares: parseInt(document.getElementById('jShares').value),
            result: document.getElementById('jResult').value,
            wentWell: document.getElementById('jWentWell').value,
            improve: document.getElementById('jImprove').value,
            emotions: parseInt(document.getElementById('jEmotions').value)
        };

        // Calculate P&L
        trade.pnl = (trade.exit - trade.entry) * trade.shares;
        if (trade.result === 'loss') trade.pnl = -Math.abs(trade.pnl);

        // Save trade
        const saved = storage.saveTrade(trade);

        if (saved) {
            // Update statistics
            storage.updateStats('trade', trade.pnl);

            notify.success('Trade logged successfully! 📝');

            // Reset form
            document.getElementById('tradeForm').reset();
            document.getElementById('emotionValue').textContent = '5';

            // Refresh displays
            this.loadRecentTrades();
            this.updateTodaySummary();

            // Refresh dashboard if visible
            if (window.dashboard) {
                dashboard.refresh();
            }
        }
    }

    loadRecentTrades() {
        const trades = storage.getTrades().slice(-10).reverse();
        const container = document.getElementById('recentTrades');

        if (!container) return;

        if (trades.length === 0) {
            container.innerHTML = '<p style="color: var(--color-text-secondary);">No trades logged yet. Start journaling!</p>';
            return;
        }

        container.innerHTML = '';

        trades.forEach(trade => {
            const tradeEl = document.createElement('div');
            tradeEl.className = 'trade-entry';
            tradeEl.style.cssText = `
                background: var(--color-bg-tertiary);
                border-radius: 8px;
                padding: 12px;
                margin-bottom: 8px;
                border-left: 4px solid ${trade.pnl > 0 ? 'var(--color-accent-green)' : 'var(--color-accent-red)'};
            `;

            const time = moment(trade.timestamp).format('HH:mm');
            const pnlColor = trade.pnl > 0 ? 'var(--color-accent-green)' : 'var(--color-accent-red)';

            tradeEl.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong>${trade.symbol}</strong>
                        <span style="color: var(--color-text-secondary); margin-left: 8px; font-size: 0.85rem;">
                            ${time} • ${trade.strategy}
                        </span>
                    </div>
                    <div style="color: ${pnlColor}; font-weight: bold;">
                        ${helpers.formatCurrency(trade.pnl)}
                    </div>
                </div>
                ${trade.wentWell ? `<div style="margin-top: 8px; font-size: 0.85rem; color: var(--color-text-secondary);">
                    <i class="fas fa-check-circle" style="color: var(--color-accent-green);"></i> ${trade.wentWell}
                </div>` : ''}
            `;

            container.appendChild(tradeEl);
        });
    }

    updateTodaySummary() {
        const todayTrades = storage.getTrades({ date: moment() });
        const container = document.getElementById('todaySummary');

        if (!container) return;

        const stats = {
            total: todayTrades.length,
            wins: todayTrades.filter(t => t.pnl > 0).length,
            losses: todayTrades.filter(t => t.pnl < 0).length,
            pnl: todayTrades.reduce((sum, t) => sum + t.pnl, 0),
            bestTrade: Math.max(...todayTrades.map(t => t.pnl), 0),
            worstTrade: Math.min(...todayTrades.map(t => t.pnl), 0)
        };

        const winRate = stats.total > 0 ? (stats.wins / stats.total * 100).toFixed(1) : 0;

        container.innerHTML = `
            <div class="summary-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                <div class="summary-item">
                    <div style="color: var(--color-text-secondary); font-size: 0.85rem;">Total Trades</div>
                    <div style="font-size: 1.5rem; font-weight: bold;">${stats.total}</div>
                </div>
                <div class="summary-item">
                    <div style="color: var(--color-text-secondary); font-size: 0.85rem;">Win Rate</div>
                    <div style="font-size: 1.5rem; font-weight: bold; color: ${winRate >= 50 ? 'var(--color-accent-green)' : 'var(--color-accent-red)'};">
                        ${winRate}%
                    </div>
                </div>
                <div class="summary-item">
                    <div style="color: var(--color-text-secondary); font-size: 0.85rem;">Net P&L</div>
                    <div style="font-size: 1.5rem; font-weight: bold; color: ${stats.pnl >= 0 ? 'var(--color-accent-green)' : 'var(--color-accent-red)'};">
                        ${helpers.formatCurrency(stats.pnl)}
                    </div>
                </div>
                <div class="summary-item">
                    <div style="color: var(--color-text-secondary); font-size: 0.85rem;">Best/Worst</div>
                    <div style="font-size: 0.9rem;">
                        <span style="color: var(--color-accent-green);">${helpers.formatCurrency(stats.bestTrade)}</span>
                        /
                        <span style="color: var(--color-accent-red);">${helpers.formatCurrency(stats.worstTrade)}</span>
                    </div>
                </div>
            </div>
        `;
    }

    showLastTrade() {
        const trades = storage.getTrades();
        if (trades.length === 0) {
            notify.info('No trades to review yet. Start journaling!');
            return;
        }

        const lastTrade = trades[trades.length - 1];
        const tradeTime = moment(lastTrade.timestamp).format('MMMM DD, YYYY HH:mm');

        const content = `
            <div style="padding: 20px;">
                <h3 style="margin-bottom: 16px;">Last Trade Review</h3>
                <div style="display: grid; gap: 12px;">
                    <div><strong>Symbol:</strong> ${lastTrade.symbol}</div>
                    <div><strong>Strategy:</strong> ${lastTrade.strategy}</div>
                    <div><strong>Entry/Exit:</strong> $${lastTrade.entry} → $${lastTrade.exit}</div>
                    <div><strong>P&L:</strong> <span style="color: ${lastTrade.pnl > 0 ? 'var(--color-accent-green)' : 'var(--color-accent-red)'}">
                        ${helpers.formatCurrency(lastTrade.pnl)}
                    </span></div>
                    <div><strong>Time:</strong> ${tradeTime}</div>
                    ${lastTrade.wentWell ? `<div><strong>What went well:</strong> ${lastTrade.wentWell}</div>` : ''}
                    ${lastTrade.improve ? `<div><strong>To improve:</strong> ${lastTrade.improve}</div>` : ''}
                    <div><strong>Emotional State:</strong> ${lastTrade.emotions}/10</div>
                </div>
            </div>
        `;

        notify.custom(content, {
            duration: 10000,
            position: 'center'
        });
    }
}