// Risk Calculator Module

class RiskCalculator {
    constructor() {
        this.accountSize = 5000;
        this.riskPercent = 1;
        this.initialize();
    }

    initialize() {
        this.setupEventListeners();
        this.loadSavedValues();
        this.calculate();
    }

    setupEventListeners() {
        // Input listeners
        const inputs = [
            'accountSize', 'riskPercent', 'entryPrice',
            'stopLoss', 'targetPrice', 'winRate', 'avgWin', 'avgLoss'
        ];

        inputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', () => this.calculate());
            }
        });
    }

    loadSavedValues() {
        const saved = storage.load('riskCalculatorValues', {
            accountSize: 5000,
            riskPercent: 1
        });

        document.getElementById('accountSize').value = saved.accountSize;
        document.getElementById('riskPercent').value = saved.riskPercent;

        this.accountSize = saved.accountSize;
        this.riskPercent = saved.riskPercent;
    }

    calculate() {
        // Get values
        const accountSize = parseFloat(document.getElementById('accountSize').value) || 0;
        const riskPercent = parseFloat(document.getElementById('riskPercent').value) || 0;
        const entry = parseFloat(document.getElementById('entryPrice').value) || 0;
        const stop = parseFloat(document.getElementById('stopLoss').value) || 0;
        const target = parseFloat(document.getElementById('targetPrice').value) || 0;

        // Save values
        storage.save('riskCalculatorValues', { accountSize, riskPercent });

        // Calculate risk amount
        const riskAmount = accountSize * (riskPercent / 100);
        document.getElementById('riskAmount').value = riskAmount.toFixed(2);

        // Validate inputs
        if (entry > 0 && stop > 0 && entry !== stop) {
            // Calculate position size
            const priceRisk = Math.abs(entry - stop);
            const shares = Math.floor(riskAmount / priceRisk);
            const positionSize = shares * entry;

            // Calculate risk/reward
            const riskReward = helpers.calculateRiskReward(entry, stop, target);

            // Calculate potential profit
            const potentialProfit = shares * Math.abs(target - entry);

            // Update display
            document.getElementById('sharesToBuy').textContent = shares;
            document.getElementById('positionSize').textContent = helpers.formatCurrency(positionSize);
            document.getElementById('riskReward').textContent = `${riskReward}:1`;
            document.getElementById('potentialProfit').textContent = helpers.formatCurrency(potentialProfit);

            // Update visual
            this.updateRiskVisual(entry, stop, target);

            // Color code R:R
            const rrElement = document.getElementById('riskReward');
            if (riskReward >= 2) {
                rrElement.style.color = 'var(--color-accent-green)';
            } else if (riskReward >= 1) {
                rrElement.style.color = 'var(--color-accent-yellow)';
            } else {
                rrElement.style.color = 'var(--color-accent-red)';
            }
        }

        // Calculate Kelly Criterion
        this.calculateKelly();
    }

    calculateKelly() {
        const winRate = parseFloat(document.getElementById('winRate').value) || 0;
        const avgWin = parseFloat(document.getElementById('avgWin').value) || 0;
        const avgLoss = parseFloat(document.getElementById('avgLoss').value) || 0;

        if (winRate > 0 && avgWin > 0 && avgLoss > 0) {
            const winProb = winRate / 100;
            const lossProb = 1 - winProb;
            const odds = avgWin / avgLoss;

            const kellyPercent = (winProb * odds - lossProb) / odds;
            const safeKelly = Math.max(0, kellyPercent * 100 / 4); // Quarter Kelly

            document.getElementById('kellyPercent').textContent =
                `${Math.max(0, kellyPercent * 100).toFixed(1)}%`;
            document.getElementById('safeKelly').textContent =
                `${safeKelly.toFixed(1)}%`;
        }
    }

    updateRiskVisual(entry, stop, target) {
        const canvas = document.getElementById('riskChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width = canvas.offsetWidth;
        const height = canvas.height = 200;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Calculate positions
        const range = Math.max(target, entry, stop) - Math.min(target, entry, stop);
        const padding = range * 0.2;
        const min = Math.min(target, entry, stop) - padding;
        const max = Math.max(target, entry, stop) + padding;

        const scale = height / (max - min);
        const entryY = height - (entry - min) * scale;
        const stopY = height - (stop - min) * scale;
        const targetY = height - (target - min) * scale;

        // Draw risk area
        ctx.fillStyle = 'rgba(246, 70, 93, 0.2)';
        ctx.fillRect(0, Math.min(entryY, stopY), width, Math.abs(entryY - stopY));

        // Draw reward area
        ctx.fillStyle = 'rgba(0, 211, 149, 0.2)';
        ctx.fillRect(0, Math.min(entryY, targetY), width, Math.abs(entryY - targetY));

        // Draw lines
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;

        // Entry line
        ctx.beginPath();
        ctx.moveTo(0, entryY);
        ctx.lineTo(width, entryY);
        ctx.stroke();

        // Stop line
        ctx.strokeStyle = '#f6465d';
        ctx.beginPath();
        ctx.moveTo(0, stopY);
        ctx.lineTo(width, stopY);
        ctx.stroke();

        // Target line
        ctx.strokeStyle = '#00d395';
        ctx.beginPath();
        ctx.moveTo(0, targetY);
        ctx.lineTo(width, targetY);
        ctx.stroke();

        // Labels
        ctx.fillStyle = '#fff';
        ctx.font = '12px Arial';
        ctx.fillText(`Entry: $${entry.toFixed(2)}`, 10, entryY - 5);
        ctx.fillText(`Stop: $${stop.toFixed(2)}`, 10, stopY - 5);
        ctx.fillText(`Target: $${target.toFixed(2)}`, 10, targetY - 5);
    }
}