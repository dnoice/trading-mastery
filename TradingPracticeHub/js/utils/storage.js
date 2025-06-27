// 📁/📄 TradingPracticeHub\js\utils\storage.js

// Local Storage Management

class StorageManager {
    constructor() {
        this.prefix = 'TM_';
    }

    // Save data to local storage
    save(key, data) {
        try {
            const serialized = JSON.stringify(data);
            localStorage.setItem(this.prefix + key, serialized);
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    }

    // Load data from local storage
    load(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(this.prefix + key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            return defaultValue;
        }
    }

    // Remove item from storage
    remove(key) {
        localStorage.removeItem(this.prefix + key);
    }

    // Clear all app data
    clearAll() {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith(this.prefix)) {
                localStorage.removeItem(key);
            }
        });
    }

    // Get storage size
    getSize() {
        let size = 0;
        const keys = Object.keys(localStorage);

        keys.forEach(key => {
            if (key.startsWith(this.prefix)) {
                size += localStorage[key].length + key.length;
            }
        });

        return (size / 1024).toFixed(2) + ' KB';
    }

    // Trade History Management
    saveTrade(trade) {
        const trades = this.load('trades', []);
        trades.push({
            ...trade,
            id: Date.now(),
            timestamp: new Date().toISOString()
        });

        // Keep only last 1000 trades
        if (trades.length > 1000) {
            trades.shift();
        }

        return this.save('trades', trades);
    }

    getTrades(filter = {}) {
        const trades = this.load('trades', []);

        if (filter.date) {
            return trades.filter(trade =>
                moment(trade.timestamp).isSame(filter.date, 'day')
            );
        }

        if (filter.symbol) {
            return trades.filter(trade =>
                trade.symbol.toUpperCase() === filter.symbol.toUpperCase()
            );
        }

        if (filter.strategy) {
            return trades.filter(trade => trade.strategy === filter.strategy);
        }

        return trades;
    }

    // Statistics Management
    updateStats(statType, value) {
        const stats = this.load('stats', {
            totalTrades: 0,
            winningTrades: 0,
            losingTrades: 0,
            totalPnL: 0,
            bestTrade: 0,
            worstTrade: -0,
            currentStreak: 0,
            bestStreak: 0
        });

        switch (statType) {
            case 'trade':
                stats.totalTrades++;
                if (value > 0) {
                    stats.winningTrades++;
                    stats.currentStreak++;
                    stats.bestStreak = Math.max(stats.bestStreak, stats.currentStreak);
                } else {
                    stats.losingTrades++;
                    stats.currentStreak = 0;
                }
                stats.totalPnL += value;
                stats.bestTrade = Math.max(stats.bestTrade, value);
                stats.worstTrade = Math.min(stats.worstTrade, value);
                break;
        }

        return this.save('stats', stats);
    }

    getStats() {
        return this.load('stats', {
            totalTrades: 0,
            winningTrades: 0,
            losingTrades: 0,
            totalPnL: 0,
            bestTrade: 0,
            worstTrade: 0,
            currentStreak: 0,
            bestStreak: 0
        });
    }

    // Pattern Practice Scores
    savePatternScore(score) {
        const scores = this.load('patternScores', []);
        scores.push({
            score: score,
            date: new Date().toISOString()
        });

        // Keep last 100 scores
        if (scores.length > 100) {
            scores.shift();
        }

        return this.save('patternScores', scores);
    }

    // Psychology Data
    saveMood(mood) {
        const moods = this.load('moods', []);
        moods.push({
            mood: mood,
            timestamp: new Date().toISOString()
        });

        // Keep last 30 days
        if (moods.length > 30) {
            moods.shift();
        }

        return this.save('moods', moods);
    }
}

// Create global instance
window.storage = new StorageManager();
