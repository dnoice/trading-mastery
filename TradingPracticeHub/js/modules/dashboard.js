// Dashboard Module

class Dashboard {
    constructor() {
        this.stats = storage.getStats();
        this.initialize();
    }

    initialize() {
        this.loadMarketOverview();
        this.loadDailyChecklist();
        this.updateStats();
        this.createMiniChart();
    }

    refresh() {
        this.stats = storage.getStats();
        this.updateStats();
        this.loadMarketOverview();
    }

    updateStats() {
        // Update performance stats
        const winRate = this.stats.totalTrades > 0
            ? (this.stats.winningTrades / this.stats.totalTrades * 100).toFixed(1)
            : 0;

        const profitFactor = this.stats.losingTrades > 0 && this.stats.totalPnL > 0
            ? Math.abs(this.stats.totalPnL / (this.stats.worstTrade * this.stats.losingTrades)).toFixed(2)
            : 0;

        document.getElementById('winRate').textContent = winRate + '%';
        document.getElementById('profitFactor').textContent = profitFactor;
        document.getElementById('totalTrades').textContent = this.stats.totalTrades;
        document.getElementById('netPnL').textContent = helpers.formatCurrency(this.stats.totalPnL);

        // Color code P&L
        const pnlElement = document.getElementById('netPnL');
        if (this.stats.totalPnL > 0) {
            pnlElement.style.color = 'var(--color-accent-green)';
        } else if (this.stats.totalPnL < 0) {
            pnlElement.style.color = 'var(--color-accent-red)';
        }
    }

    loadMarketOverview() {
        const marketData = [
            { symbol: 'SPY', price: 450.25, change: 1.2, volume: '89.3M' },
            { symbol: 'QQQ', price: 380.50, change: -0.5, volume: '45.2M' },
            { symbol: 'IWM', price: 220.15, change: 0.8, volume: '32.1M' },
            { symbol: 'VIX', price: 15.32, change: -5.2, volume: '-' }
        ];

        const container = document.getElementById('marketOverview');
        container.innerHTML = '';

        marketData.forEach(item => {
            const div = document.createElement('div');
            div.className = 'market-item';
            div.style.cssText = `
                padding: 12px;
                background: var(--color-bg-tertiary);
                border-radius: 8px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
            `;

            const changeColor = item.change > 0 ? 'var(--color-accent-green)' : 'var(--color-accent-red)';
            const changeIcon = item.change > 0 ? 'fa-arrow-up' : 'fa-arrow-down';

            div.innerHTML = `
                <div>
                    <strong>${item.symbol}</strong>
                    <span style="color: var(--color-text-secondary); font-size: 0.85rem; margin-left: 8px;">
                        ${item.volume}
                    </span>
                </div>
                <div style="text-align: right;">
                    <strong>$${item.price}</strong>
                    <span style="color: ${changeColor}; margin-left: 8px;">
                        <i class="fas ${changeIcon}" style="font-size: 0.8rem;"></i>
                        ${Math.abs(item.change)}%
                    </span>
                </div>
            `;

            container.appendChild(div);
        });
    }

    loadDailyChecklist() {
        const checklist = [
            { task: 'Review pre-market movers', completed: false },
            { task: 'Check economic calendar', completed: false },
            { task: 'Set daily loss limit', completed: false },
            { task: 'Review trading rules', completed: false },
            { task: 'Prepare watchlist', completed: false },
            { task: 'Practice meditation', completed: false }
        ];

        const container = document.getElementById('dailyChecklist');
        container.innerHTML = '';

        checklist.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'checklist-item';
            div.style.cssText = `
                padding: 8px 0;
                display: flex;
                align-items: center;
                gap: 12px;
                cursor: pointer;
                transition: opacity 0.2s;
            `;

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `check_${index}`;
            checkbox.style.cssText = `
                width: 20px;
                height: 20px;
                accent-color: var(--color-accent-green);
            `;

            const label = document.createElement('label');
            label.htmlFor = `check_${index}`;
            label.textContent = item.task;
            label.style.cursor = 'pointer';

            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    label.style.textDecoration = 'line-through';
                    label.style.opacity = '0.6';

                    // Check if all completed
                    const allChecked = container.querySelectorAll('input[type="checkbox"]:checked').length === checklist.length;
                    if (allChecked) {
                        notify.success('Daily checklist complete! Ready to trade! 🚀');
                    }
                } else {
                    label.style.textDecoration = 'none';
                    label.style.opacity = '1';
                }
            });

            div.appendChild(checkbox);
            div.appendChild(label);
            container.appendChild(div);
        });
    }

    createMiniChart() {
        const ctx = document.getElementById('miniChart');
        if (!ctx) return;

        const priceData = helpers.generatePriceData(100, 50);

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: priceData.map((d, i) => i),
                datasets: [{
                    label: 'Price',
                    data: priceData.map(d => d.close),
                    borderColor: 'rgb(0, 211, 149)',
                    backgroundColor: 'rgba(0, 211, 149, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    x: {
                        display: false
                    },
                    y: {
                        display: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.5)'
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });
    }
}