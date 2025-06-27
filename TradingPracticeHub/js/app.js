// Main Application Controller
class TradingMasteryApp {
    constructor() {
        this.currentModule = 'dashboard';
        this.user = this.loadUserData();
        this.streak = this.loadStreakData();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateClock();
        this.updateStreak();
        this.hideLoadingScreen();
        this.showWelcomeMessage();

        // Initialize modules
        this.initializeModules();

        // Update clock every second
        setInterval(() => this.updateClock(), 1000);
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const module = e.currentTarget.dataset.module;
                this.switchModule(module);
            });
        });

        // Quick Actions
        window.app = this; // Make app globally accessible
    }

    switchModule(moduleName) {
        // Hide all modules
        document.querySelectorAll('.module').forEach(module => {
            module.classList.remove('active');
        });

        // Remove active from nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Show selected module
        document.getElementById(moduleName).classList.add('active');
        document.querySelector(`[data-module="${moduleName}"]`).classList.add('active');

        this.currentModule = moduleName;

        // Initialize module-specific features
        this.initModuleFeatures(moduleName);
    }

    initializeModules() {
        // Initialize all module instances
        window.dashboard = new Dashboard();
        window.patterns = new PatternPractice();
        window.riskCalc = new RiskCalculator();
        window.simulator = new TradeSimulator();
        window.journal = new QuickJournal();
        window.psychology = new PsychologyTracker();
    }

    initModuleFeatures(moduleName) {
        switch(moduleName) {
            case 'dashboard':
                dashboard.refresh();
                break;
            case 'patterns':
                patterns.loadNewPattern();
                break;
            case 'risk':
                riskCalc.initialize();
                break;
            case 'simulator':
                simulator.initialize();
                break;
            case 'journal':
                journal.loadRecentTrades();
                break;
            case 'psychology':
                psychology.loadDailyAffirmation();
                break;
        }
    }

    updateClock() {
        const now = moment();
        const marketTime = document.getElementById('marketTime');

        if (marketTime) {
            marketTime.textContent = now.format('HH:mm:ss');

            // Add market status indicator
            const marketOpen = moment('09:30', 'HH:mm');
            const marketClose = moment('16:00', 'HH:mm');

            if (now.isBetween(marketOpen, marketClose) && now.day() !== 0 && now.day() !== 6) {
                marketTime.style.color = 'var(--color-accent-green)';
            } else {
                marketTime.style.color = 'var(--color-text-secondary)';
            }
        }

        // Update date in footer
        const currentDate = document.getElementById('currentDate');
        if (currentDate) {
            currentDate.textContent = now.format('MMMM DD, YYYY');
        }
    }

    updateStreak() {
        const streakCounter = document.getElementById('streakCounter');
        if (streakCounter) {
            const days = this.calculateStreak();
            streakCounter.textContent = `${days} Day Streak`;

            if (days > 0) {
                streakCounter.style.color = 'var(--color-accent-green)';
            }
        }
    }

    calculateStreak() {
        const lastPractice = localStorage.getItem('lastPracticeDate');
        if (!lastPractice) return 0;

        const last = moment(lastPractice);
        const today = moment().startOf('day');
        const yesterday = moment().subtract(1, 'days').startOf('day');

        if (last.isSame(today, 'day') || last.isSame(yesterday, 'day')) {
            return parseInt(localStorage.getItem('practiceStreak') || 0);
        }

        return 0;
    }

    hideLoadingScreen() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                loadingScreen.classList.add('hide');
                setTimeout(() => loadingScreen.remove(), 500);
            }
        }, 1500);
    }

    showWelcomeMessage() {
        const messages = CONFIG.MESSAGES.WELCOME;
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];

        notify.success(randomMessage, {
            duration: 5000,
            position: 'top-center'
        });
    }

    loadUserData() {
        const stored = localStorage.getItem(CONFIG.STORAGE.USER_PREFERENCES);
        return stored ? JSON.parse(stored) : {
            name: 'Trader',
            accountSize: 5000,
            riskPercent: 1,
            preferredStrategy: 'Gap and Go'
        };
    }

    loadStreakData() {
        const today = moment().format('YYYY-MM-DD');
        const lastDate = localStorage.getItem('lastPracticeDate');

        if (lastDate !== today) {
            localStorage.setItem('lastPracticeDate', today);
            const currentStreak = parseInt(localStorage.getItem('practiceStreak') || 0);
            localStorage.setItem('practiceStreak', currentStreak + 1);
        }

        return parseInt(localStorage.getItem('practiceStreak') || 0);
    }

    // Quick Action Methods
    startQuickTrade() {
        this.switchModule('simulator');
        simulator.start();
    }

    reviewLastTrade() {
        this.switchModule('journal');
        journal.showLastTrade();
    }

    runScanner() {
        notify.info('Scanner feature coming soon! 🔍');
    }

    checkRules() {
        const rules = [
            'Never risk more than 1-2% per trade',
            'Always use stop losses',
            'Take profits at predetermined levels',
            'No revenge trading',
            'Maximum 5% daily loss limit'
        ];

        let rulesHTML = '<h3>Trading Rules Checklist</h3><ul>';
        rules.forEach(rule => {
            rulesHTML += `<li>✓ ${rule}</li>`;
        });
        rulesHTML += '</ul>';

        notify.custom(rulesHTML, {
            duration: 10000,
            position: 'center'
        });
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.tradingApp = new TradingMasteryApp();
});