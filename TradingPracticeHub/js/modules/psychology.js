// 📁/📄 TradingPracticeHub\js\modules\psychology.js

// Psychology Module

class PsychologyTracker {
    constructor() {
        this.affirmations = [
            "I follow my trading plan with discipline and patience.",
            "Every loss is a lesson that makes me stronger.",
            "I trade for Nick's future, not for quick gains.",
            "My edge comes from consistency, not perfection.",
            "I am calm, focused, and in control of my emotions.",
            "Risk management is my superpower.",
            "I trade what I see, not what I think.",
            "Patience pays better than FOMO ever will.",
            "I am becoming the trader Nick needs me to be.",
            "Process over profits, always.",
            "I respect the market and manage my risk.",
            "Every day I'm getting better at this.",
            "I don't need to trade, I choose to trade well.",
            "My stop loss is my best friend.",
            "Green days will come from following rules."
        ];

        this.meditationTimer = null;
        this.meditationTime = 300; // 5 minutes default
        this.initialize();
    }

    initialize() {
        this.setupEventListeners();
        this.loadDailyAffirmation();
    }

    setupEventListeners() {
        // Mood buttons
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mood = e.currentTarget.dataset.mood;
                this.trackMood(mood);
            });
        });

        // Meditation duration
        const durationSelect = document.getElementById('meditationDuration');
        if (durationSelect) {
            durationSelect.addEventListener('change', (e) => {
                this.meditationTime = parseInt(e.target.value) * 60;
                this.updateMeditationDisplay();
            });
        }
    }

    loadDailyAffirmation() {
        const affirmationEl = document.getElementById('dailyAffirmation');
        if (!affirmationEl) return;

        // Get today's affirmation (consistent for the day)
        const today = new Date().toDateString();
        const savedAffirmation = storage.load('dailyAffirmation');

        if (savedAffirmation && savedAffirmation.date === today) {
            affirmationEl.textContent = savedAffirmation.text;
        } else {
            this.newAffirmation();
        }
    }

    newAffirmation() {
        const affirmationEl = document.getElementById('dailyAffirmation');
        if (!affirmationEl) return;

        const affirmation = helpers.getRandomElement(this.affirmations);
        affirmationEl.textContent = affirmation;

        // Save for today
        storage.save('dailyAffirmation', {
            date: new Date().toDateString(),
            text: affirmation
        });

        // Animate
        affirmationEl.style.animation = 'fadeIn 0.5s ease';
    }

    trackMood(mood) {
        // Visual feedback
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        document.querySelector(`[data-mood="${mood}"]`).classList.add('selected');

        // Save mood
        storage.saveMood(mood);

        // Provide feedback based on mood
        const responses = {
            confident: "Excellent! Confidence with discipline is powerful! 💪",
            focused: "Perfect state for trading. Stay sharp! 🎯",
            anxious: "Take a few deep breaths. Consider the meditation exercise. 🧘",
            frustrated: "Step back if needed. The market will be here tomorrow. 💚"
        };

        notify.info(responses[mood] || "Mood tracked!");

        // Update mood chart
        this.updateMoodChart();
    }

    updateMoodChart() {
        const canvas = document.getElementById('moodChart');
        if (!canvas) return;

        const moods = storage.load('moods', []);
        const moodCounts = {
            confident: 0,
            focused: 0,
            anxious: 0,
            frustrated: 0
        };

        // Count last 7 days
        const sevenDaysAgo = moment().subtract(7, 'days');
        moods.forEach(entry => {
            if (moment(entry.timestamp).isAfter(sevenDaysAgo)) {
                moodCounts[entry.mood]++;
            }
        });

        // Create or update chart
        const ctx = canvas.getContext('2d');

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Confident', 'Focused', 'Anxious', 'Frustrated'],
                datasets: [{
                    data: Object.values(moodCounts),
                    backgroundColor: [
                        'rgba(0, 211, 149, 0.8)',
                        'rgba(59, 130, 246, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(246, 70, 93, 0.8)'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: 'var(--color-text-secondary)',
                            padding: 10
                        }
                    }
                }
            }
        });
    }

    checkTilt() {
        const checks = [
            document.getElementById('tilt1').checked,
            document.getElementById('tilt2').checked,
            document.getElementById('tilt3').checked,
            document.getElementById('tilt4').checked
        ];

        const tiltScore = checks.filter(c => c).length;
        const resultEl = document.getElementById('tiltResult');

        if (tiltScore === 0) {
            resultEl.className = 'safe';
            resultEl.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <strong>All Clear!</strong>
                <p>You're in a good mental state for trading. Stay disciplined!</p>
            `;
        } else if (tiltScore <= 2) {
            resultEl.className = 'warning';
            resultEl.innerHTML = `
                <i class="fas fa-exclamation-triangle"></i>
                <strong>Caution</strong>
                <p>Some warning signs present. Take a break, do some deep breathing.</p>
            `;
        } else {
            resultEl.className = 'danger';
            resultEl.innerHTML = `
                <i class="fas fa-times-circle"></i>
                <strong>STOP TRADING</strong>
                <p>High tilt risk detected. Close all positions and step away. Tomorrow is a new day.</p>
            `;
        }

        // Reset checkboxes after 5 seconds
        setTimeout(() => {
            checks.forEach((_, i) => {
                document.getElementById(`tilt${i + 1}`).checked = false;
            });
        }, 5000);
    }

    startExercise(type) {
        const exercises = {
            visualization: {
                title: 'Trade Visualization',
                content: `
                    <div style="padding: 20px;">
                        <h3>5-Minute Trade Visualization</h3>
                        <ol style="line-height: 2; margin-top: 20px;">
                            <li>Close your eyes and breathe deeply</li>
                            <li>Visualize your perfect trading day</li>
                            <li>See yourself following your rules perfectly</li>
                            <li>Imagine taking only A+ setups</li>
                            <li>Feel the satisfaction of disciplined execution</li>
                            <li>See your account growing steadily</li>
                            <li>Picture Nick's smile when you succeed</li>
                        </ol>
                        <p style="margin-top: 20px; font-style: italic;">
                            "What the mind can conceive and believe, it can achieve."
                        </p>
                    </div>
                `
            },
            breathing: {
                title: 'Box Breathing Exercise',
                content: `
                    <div style="padding: 20px; text-align: center;">
                        <h3>4-4-4-4 Box Breathing</h3>
                        <div style="font-size: 4rem; margin: 30px 0;" id="breathingGuide">
                            Ready
                        </div>
                        <button onclick="psychology.startBoxBreathing()"
                            style="padding: 10px 30px; background: var(--gradient-purple);
                            border: none; border-radius: 6px; color: white;
                            font-weight: bold; cursor: pointer;">
                            Start Exercise
                        </button>
                        <p style="margin-top: 20px; color: var(--color-text-secondary);">
                            This technique is used by Navy SEALs to stay calm under pressure
                        </p>
                    </div>
                `
            },
            review: {
                title: 'Trading Rules Review',
                content: `
                    <div style="padding: 20px;">
                        <h3>My Trading Commandments</h3>
                        <div style="line-height: 2; margin-top: 20px;">
                            ✓ I will not risk more than 1-2% per trade<br>
                            ✓ I will always use stop losses<br>
                            ✓ I will not revenge trade<br>
                            ✓ I will stop at 5% daily loss<br>
                            ✓ I will only trade A+ setups<br>
                            ✓ I will journal every trade<br>
                            ✓ I will respect the market<br>
                            ✓ I will trust the process<br>
                            ✓ I will trade for Nick's future<br>
                            ✓ I will be patient and disciplined
                        </div>
                        <p style="margin-top: 20px; text-align: center; font-weight: bold;">
                            Read these aloud before each trading session
                        </p>
                    </div>
                `
            },
            gratitude: {
                title: 'Gratitude Practice',
                content: `
                    <div style="padding: 20px;">
                        <h3>Trading Gratitude</h3>
                        <p>Take a moment to appreciate:</p>
                        <ul style="line-height: 2; margin-top: 20px;">
                            <li>The opportunity to learn trading</li>
                            <li>Having capital to trade with</li>
                            <li>Each lesson the market teaches</li>
                            <li>The technology that enables trading</li>
                            <li>Your growing discipline and skill</li>
                            <li>The chance to build wealth for family</li>
                            <li>Every small improvement you make</li>
                            <li>Nick's trust and support</li>
                        </ul>
                        <p style="margin-top: 20px; font-style: italic; text-align: center;">
                            "Gratitude turns what we have into enough"
                        </p>
                    </div>
                `
            }
        };

        const exercise = exercises[type];
        if (exercise) {
            notify.custom(exercise.content, {
                duration: 30000,
                position: 'center'
            });
        }
    }

    startBoxBreathing() {
        const guide = document.getElementById('breathingGuide');
        if (!guide) return;

        const steps = [
            { text: 'Inhale', duration: 4000 },
            { text: 'Hold', duration: 4000 },
            { text: 'Exhale', duration: 4000 },
            { text: 'Hold', duration: 4000 }
        ];

        let stepIndex = 0;
        let cycles = 0;

        const runStep = () => {
            if (cycles >= 4) {
                guide.textContent = 'Complete! 🧘';
                return;
            }

            const step = steps[stepIndex];
            guide.textContent = step.text;
            guide.style.color = stepIndex % 2 === 0 ? 'var(--color-accent-green)' : 'var(--color-accent-blue)';

            stepIndex = (stepIndex + 1) % steps.length;
            if (stepIndex === 0) cycles++;

            setTimeout(runStep, step.duration);
        };

        runStep();
    }
}

// Meditation namespace
window.meditation = {
    timer: null,
    timeLeft: 300,
    isRunning: false,

    start() {
        if (this.isRunning) return;

        this.isRunning = true;
        const duration = parseInt(document.getElementById('meditationDuration').value) * 60;
        this.timeLeft = duration;

        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateDisplay();

            if (this.timeLeft <= 0) {
                this.complete();
            }
        }, 1000);

        notify.info('Meditation started. Find your calm... 🧘');
    },

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        const display = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        document.getElementById('meditationTimer').textContent = display;
    },

    reset() {
        clearInterval(this.timer);
        this.isRunning = false;
        const duration = parseInt(document.getElementById('meditationDuration').value) * 60;
        this.timeLeft = duration;
        this.updateDisplay();
    },

    complete() {
        clearInterval(this.timer);
        this.isRunning = false;

        notify.success('Meditation complete! You are centered and ready. 🙏');

        // Play completion sound if available
        const audio = new Audio('assets/sounds/bell.mp3');
        audio.play().catch(() => { });

        this.reset();
    }
};
