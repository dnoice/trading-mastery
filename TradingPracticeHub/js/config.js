// Application Configuration
const CONFIG = {
    APP_NAME: 'Trading Mastery Hub',
    VERSION: '1.0.0',
    DEBUG: true,

    // API Endpoints (if needed)
    API: {
        BASE_URL: 'http://localhost:3000/api',
        TIMEOUT: 5000
    },

    // Trading Settings
    TRADING: {
        DEFAULT_RISK_PERCENT: 1,
        MAX_RISK_PERCENT: 2,
        DEFAULT_SHARES: 100,
        MIN_PRICE: 1,
        MAX_PRICE: 10000
    },

    // Chart Settings
    CHARTS: {
        CANDLE_WIDTH: 10,
        VOLUME_HEIGHT: 0.3,
        GRID_LINES: 10,
        COLORS: {
            BULLISH: '#00d395',
            BEARISH: '#f6465d',
            VOLUME: '#4a5568',
            GRID: '#2b3139'
        }
    },

    // Local Storage Keys
    STORAGE: {
        USER_PREFERENCES: 'TM_USER_PREFS',
        TRADE_HISTORY: 'TM_TRADE_HISTORY',
        PRACTICE_STATS: 'TM_PRACTICE_STATS',
        STREAK_DATA: 'TM_STREAK_DATA'
    },

    // Time Settings
    TIME: {
        MARKET_OPEN: '09:30',
        MARKET_CLOSE: '16:00',
        TIMEZONE: 'America/Los_Angeles'
    },

    // Motivational Messages
    MESSAGES: {
        WELCOME: [
            "Let's build wealth for Nick! 💪",
            "Every practice makes you stronger!",
            "Discipline equals freedom!",
            "Process over profits!",
            "You're becoming unstoppable!"
        ],
        SUCCESS: [
            "Excellent trade! 🎯",
            "That's how it's done!",
            "Nick would be proud!",
            "Keep that discipline!",
            "You're on fire! 🔥"
        ],
        ENCOURAGEMENT: [
            "Learn from this one!",
            "Every loss is a lesson!",
            "Stay focused!",
            "Trust the process!",
            "Tomorrow is a new day!"
        ]
    }
};

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}