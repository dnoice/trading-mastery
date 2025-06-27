// 📁/📄 TradingPracticeHub\js\components\charts.js

// Chart Components

class ChartManager {
    constructor() {
        this.charts = {};
    }

    createCandlestickChart(canvasId, data) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return null;

        const ctx = canvas.getContext('2d');
        const width = canvas.width = canvas.offsetWidth;
        const height = canvas.height = canvas.offsetHeight;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        if (data.length === 0) return;

        // Calculate scale
        const prices = data.flatMap(d => [d.high, d.low]);
        const minPrice = Math.min(...prices) * 0.99;
        const maxPrice = Math.max(...prices) * 1.01;
        const priceRange = maxPrice - minPrice;

        const candleWidth = width / data.length * 0.8;
        const spacing = width / data.length * 0.2;

        // Draw grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;

        for (let i = 0; i <= 10; i++) {
            const y = height * i / 10;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        // Draw candles
        data.forEach((candle, index) => {
            const x = index * (candleWidth + spacing) + spacing / 2;

            // Calculate y positions
            const highY = height - ((candle.high - minPrice) / priceRange * height);
            const lowY = height - ((candle.low - minPrice) / priceRange * height);
            const openY = height - ((candle.open - minPrice) / priceRange * height);
            const closeY = height - ((candle.close - minPrice) / priceRange * height);

            // Determine color
            const isBullish = candle.close > candle.open;
            ctx.fillStyle = isBullish ? CONFIG.CHARTS.COLORS.BULLISH : CONFIG.CHARTS.COLORS.BEARISH;
            ctx.strokeStyle = ctx.fillStyle;
            ctx.lineWidth = 1;

            // Draw wick
            ctx.beginPath();
            ctx.moveTo(x + candleWidth / 2, highY);
            ctx.lineTo(x + candleWidth / 2, lowY);
            ctx.stroke();

            // Draw body
            const bodyTop = Math.min(openY, closeY);
            const bodyHeight = Math.abs(closeY - openY) || 1;

            ctx.fillRect(x, bodyTop, candleWidth, bodyHeight);
        });

        return {
            update: (newData) => {
                this.createCandlestickChart(canvasId, newData);
            }
        };
    }

    createVolumeChart(canvasId, data) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return null;

        const ctx = canvas.getContext('2d');
        const width = canvas.width = canvas.offsetWidth;
        const height = canvas.height = canvas.offsetHeight;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        if (data.length === 0) return;

        // Calculate scale
        const maxVolume = Math.max(...data.map(d => d.volume));
        const barWidth = width / data.length * 0.8;
        const spacing = width / data.length * 0.2;

        // Draw volume bars
        data.forEach((candle, index) => {
            const x = index * (barWidth + spacing) + spacing / 2;
            const barHeight = (candle.volume / maxVolume) * height;
            const y = height - barHeight;

            // Color based on price action
            ctx.fillStyle = candle.close > candle.open ?
                CONFIG.CHARTS.COLORS.BULLISH : CONFIG.CHARTS.COLORS.BEARISH;
            ctx.globalAlpha = 0.5;
            ctx.fillRect(x, y, barWidth, barHeight);
            ctx.globalAlpha = 1;
        });
    }

    createLineChart(canvasId, data, options = {}) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return null;

        const ctx = canvas.getContext('2d');
        const width = canvas.width = canvas.offsetWidth;
        const height = canvas.height = canvas.offsetHeight;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        if (data.length === 0) return;

        // Options
        const color = options.color || CONFIG.CHARTS.COLORS.BULLISH;
        const lineWidth = options.lineWidth || 2;
        const showDots = options.showDots || false;

        // Calculate scale
        const values = data.map(d => d.value || d);
        const minValue = Math.min(...values) * 0.99;
        const maxValue = Math.max(...values) * 1.01;
        const valueRange = maxValue - minValue;

        // Draw line
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();

        data.forEach((point, index) => {
            const x = (index / (data.length - 1)) * width;
            const value = point.value || point;
            const y = height - ((value - minValue) / valueRange * height);

            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.stroke();

        // Draw dots if requested
        if (showDots) {
            ctx.fillStyle = color;
            data.forEach((point, index) => {
                const x = (index / (data.length - 1)) * width;
                const value = point.value || point;
                const y = height - ((value - minValue) / valueRange * height);

                ctx.beginPath();
                ctx.arc(x, y, 3, 0, 2 * Math.PI);
                ctx.fill();
            });
        }

        // Draw gradient fill
        if (options.fill) {
            const gradient = ctx.createLinearGradient(0, 0, 0, height);
            gradient.addColorStop(0, color + '40');
            gradient.addColorStop(1, color + '00');

            ctx.fillStyle = gradient;
            ctx.beginPath();

            data.forEach((point, index) => {
                const x = (index / (data.length - 1)) * width;
                const value = point.value || point;
                const y = height - ((value - minValue) / valueRange * height);

                if (index === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });

            ctx.lineTo(width, height);
            ctx.lineTo(0, height);
            ctx.closePath();
            ctx.fill();
        }
    }
}

// Create global instance
window.chartManager = new ChartManager();
