// 📁/📄 TradingPracticeHub\js\utils\helpers.js

// Utility Helper Functions

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

// Format percentage
function formatPercent(value, decimals = 2) {
    return `${(value * 100).toFixed(decimals)}%`;
}

// Format number with commas
function formatNumber(num) {
    return new Intl.NumberFormat('en-US').format(num);
}

// Calculate risk/reward ratio
function calculateRiskReward(entry, stop, target) {
    const risk = Math.abs(entry - stop);
    const reward = Math.abs(target - entry);

    if (risk === 0) return 0;

    return (reward / risk).toFixed(2);
}

// Calculate position size
function calculatePositionSize(accountSize, riskPercent, entry, stop) {
    const riskAmount = accountSize * (riskPercent / 100);
    const priceRisk = Math.abs(entry - stop);

    if (priceRisk === 0) return 0;

    return Math.floor(riskAmount / priceRisk);
}

// Generate random price data
function generatePriceData(startPrice, periods, volatility = 0.02) {
    const data = [];
    let price = startPrice;

    for (let i = 0; i < periods; i++) {
        const change = (Math.random() - 0.5) * volatility;
        const open = price;
        const close = price * (1 + change);
        const high = Math.max(open, close) * (1 + Math.random() * volatility * 0.5);
        const low = Math.min(open, close) * (1 - Math.random() * volatility * 0.5);
        const volume = Math.floor(Math.random() * 1000000) + 100000;

        data.push({
            time: new Date(Date.now() - (periods - i) * 60000),
            open: open,
            high: high,
            low: low,
            close: close,
            volume: volume
        });

        price = close;
    }

    return data;
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Deep clone object
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

// Get random element from array
function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Calculate moving average
function calculateMA(data, period) {
    const result = [];
    for (let i = period - 1; i < data.length; i++) {
        let sum = 0;
        for (let j = 0; j < period; j++) {
            sum += data[i - j];
        }
        result.push(sum / period);
    }
    return result;
}

// Check if market is open
function isMarketOpen() {
    const now = moment();
    const marketOpen = moment('09:30', 'HH:mm');
    const marketClose = moment('16:00', 'HH:mm');

    return now.isBetween(marketOpen, marketClose) &&
        now.day() !== 0 && now.day() !== 6;
}

// Validate trade entry
function validateTradeEntry(entry, stop, target) {
    const errors = [];

    if (entry <= 0) errors.push('Entry price must be positive');
    if (stop <= 0) errors.push('Stop price must be positive');
    if (target <= 0) errors.push('Target price must be positive');

    if (entry === stop) errors.push('Entry and stop cannot be the same');
    if (entry === target) errors.push('Entry and target cannot be the same');

    // For long trades
    if (target > entry && stop > entry) {
        errors.push('Stop loss should be below entry for long trades');
    }

    // For short trades
    if (target < entry && stop < entry) {
        errors.push('Stop loss should be above entry for short trades');
    }

    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

// Export helpers
window.helpers = {
    formatCurrency,
    formatPercent,
    formatNumber,
    calculateRiskReward,
    calculatePositionSize,
    generatePriceData,
    debounce,
    throttle,
    deepClone,
    getRandomElement,
    calculateMA,
    isMarketOpen,
    validateTradeEntry
};
