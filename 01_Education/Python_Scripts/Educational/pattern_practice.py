# 📁/📄 01_Education/Python_Scripts/Educational/pattern_practice.py

"""
Interactive Pattern Recognition Practice
Helps you learn to identify chart patterns quickly
"""

import random
import json
from datetime import datetime

class PatternPractice:
    def __init__(self):
        self.patterns = {
            "hammer": {
                "description": "Small body at top, long lower shadow",
                "signal": "Bullish reversal at support",
                "context": "After decline or at support level"
            },
            "shooting_star": {
                "description": "Small body at bottom, long upper shadow",
                "signal": "Bearish reversal at resistance",
                "context": "After advance or at resistance level"
            },
            "doji": {
                "description": "Open equals close, shows indecision",
                "signal": "Potential reversal",
                "context": "At support or resistance levels"
            },
            "bullish_engulfing": {
                "description": "Large green candle engulfs previous red candle",
                "signal": "Strong bullish reversal",
                "context": "After decline, especially at support"
            },
            "bearish_engulfing": {
                "description": "Large red candle engulfs previous green candle",
                "signal": "Strong bearish reversal",
                "context": "After advance, especially at resistance"
            }
        }

        self.score = 0
        self.total_questions = 0

    def quiz_mode(self, num_questions=10):
        """Interactive pattern recognition quiz"""
        print("=== PATTERN RECOGNITION QUIZ ===\n")

        for i in range(num_questions):
            pattern = random.choice(list(self.patterns.keys()))
            self.ask_question(pattern, i+1)

        self.show_results()

    def ask_question(self, pattern, question_num):
        """Ask a single pattern question"""
        pattern_info = self.patterns[pattern]

        print(f"Question {question_num}:")
        print(f"Description: {pattern_info['description']}")
        print(f"Context: {pattern_info['context']}")
        print()

        # Create multiple choice
        correct_signal = pattern_info['signal']
        all_signals = [p['signal'] for p in self.patterns.values()]
        wrong_signals = [s for s in all_signals if s != correct_signal]

        choices = [correct_signal] + random.sample(wrong_signals, 2)
        random.shuffle(choices)

        correct_index = choices.index(correct_signal)

        print("What signal does this pattern give?")
        for i, choice in enumerate(choices):
            print(f"{i+1}. {choice}")

        while True:
            try:
                answer = int(input("\nYour answer (1-3): ")) - 1
                if 0 <= answer <= 2:
                    break
                else:
                    print("Please enter 1, 2, or 3")
            except ValueError:
                print("Please enter a number")

        self.total_questions += 1

        if answer == correct_index:
            print("✅ Correct!\n")
            self.score += 1
        else:
            print(f"❌ Wrong. Correct answer: {correct_signal}\n")

        print("-" * 50)

    def show_results(self):
        """Display final quiz results"""
        percentage = (self.score / self.total_questions) * 100

        print(f"\n=== QUIZ RESULTS ===")
        print(f"Score: {self.score}/{self.total_questions}")
        print(f"Percentage: {percentage:.1f}%")

        if percentage >= 80:
            print("🎉 Excellent! You're ready for real chart analysis.")
        elif percentage >= 60:
            print("👍 Good job! Review the patterns you missed.")
        else:
            print("📚 Keep studying! Practice makes perfect.")

        # Save results
        self.save_results(percentage)

    def save_results(self, percentage):
        """Save quiz results to file"""
        result = {
            "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "score": f"{self.score}/{self.total_questions}",
            "percentage": percentage
        }

        try:
            with open("pattern_practice_results.json", "r") as f:
                results = json.load(f)
        except FileNotFoundError:
            results = []

        results.append(result)

        with open("pattern_practice_results.json", "w") as f:
            json.dump(results, f, indent=2)

    def study_mode(self):
        """Study all patterns with descriptions"""
        print("=== PATTERN STUDY MODE ===\n")

        for pattern_name, info in self.patterns.items():
            print(f"PATTERN: {pattern_name.upper().replace('_', ' ')}")
            print(f"Description: {info['description']}")
            print(f"Signal: {info['signal']}")
            print(f"Best Context: {info['context']}")
            print("-" * 40)

        input("\nPress Enter when ready to quiz yourself...")
        self.quiz_mode()

if __name__ == "__main__":
    practice = PatternPractice()

    print("Welcome to Pattern Recognition Practice!")
    print("This tool helps you master candlestick patterns.\n")

    mode = input("Choose mode: (1) Study then Quiz (2) Quiz Only: ")

    if mode == "1":
        practice.study_mode()
    else:
        practice.quiz_mode()
