# 📁/📄 01_Education/Python_Scripts/Educational/risk_simulator.py

"""
Risk Management Simulator
Shows the impact of different risk levels on account growth
"""

import random
import matplotlib.pyplot as plt
import numpy as np

class RiskSimulator:
    def __init__(self, starting_capital=5000):
        self.starting_capital = starting_capital

    def simulate_trading(self, risk_per_trade, win_rate, avg_win, avg_loss, num_trades=100):
        """Simulate trading performance with given parameters"""

        capital = self.starting_capital
        capital_history = [capital]

        for trade in range(num_trades):
            # Determine if trade wins or loses
            is_winner = random.random() < (win_rate / 100)

            # Calculate position size based on risk
            risk_amount = capital * (risk_per_trade / 100)

            if is_winner:
                profit = risk_amount * (avg_win / avg_loss)  # Risk/reward ratio
                capital += profit
            else:
                capital -= risk_amount

            capital_history.append(capital)

            # Stop if account blows up
            if capital <= 0:
                capital = 0
                break

        return capital_history

    def compare_risk_levels(self):
        """Compare different risk management approaches"""

        # Parameters
        win_rate = 60  # 60% win rate
        avg_win = 200  # Average win $200
        avg_loss = 100  # Average loss $100
        num_trades = 200

        # Different risk levels to compare
        risk_levels = [0.5, 1.0, 2.0, 5.0]  # 0.5%, 1%, 2%, 5% per trade

        plt.figure(figsize=(12, 8))

        for risk in risk_levels:
            # Run simulation 10 times and average
            all_histories = []

            for _ in range(10):
                history = self.simulate_trading(risk, win_rate, avg_win, avg_loss, num_trades)
                # Pad with zeros if account blew up
                while len(history) < num_trades + 1:
                    history.append(0)
                all_histories.append(history)

            # Average the results
            avg_history = np.mean(all_histories, axis=0)

            trades = range(len(avg_history))
            plt.plot(trades, avg_history, label=f'{risk}% Risk per Trade', linewidth=2)

        plt.title('Account Growth: Impact of Risk Management')
        plt.xlabel('Number of Trades')
        plt.ylabel('Account Value ($)')
        plt.legend()
        plt.grid(True, alpha=0.3)
        plt.axhline(y=self.starting_capital, color='black', linestyle='--', alpha=0.5, label='Starting Capital')

        plt.tight_layout()
        plt.show()

        # Print final results
        print("\n=== SIMULATION RESULTS ===")
        print(f"Starting Capital: ${self.starting_capital:,}")
        print(f"Win Rate: {win_rate}%")
        print(f"Average Win: ${avg_win}")
        print(f"Average Loss: ${avg_loss}")
        print(f"Number of Trades: {num_trades}\n")

        for risk in risk_levels:
            final_values = []
            for _ in range(50):  # More runs for final average
                history = self.simulate_trading(risk, win_rate, avg_win, avg_loss, num_trades)
                final_values.append(history[-1])

            avg_final = np.mean(final_values)
            success_rate = sum(1 for v in final_values if v > self.starting_capital) / len(final_values) * 100

            print(f"Risk {risk}% per trade:")
            print(f"  Average Final Value: ${avg_final:,.0f}")
            print(f"  Success Rate: {success_rate:.1f}%")
            print(f"  Growth: {((avg_final - self.starting_capital) / self.starting_capital) * 100:.1f}%\n")

    def kelly_criterion_demo(self):
        """Demonstrate Kelly Criterion for optimal sizing"""

        print("=== KELLY CRITERION DEMONSTRATION ===\n")

        # Get user inputs
        try:
            win_rate = float(input("Enter win rate (e.g., 60 for 60%): "))
            avg_win = float(input("Enter average win amount ($): "))
            avg_loss = float(input("Enter average loss amount ($): "))
        except ValueError:
            print("Using default values...")
            win_rate, avg_win, avg_loss = 60, 200, 100

        # Calculate Kelly percentage
        win_prob = win_rate / 100
        loss_prob = 1 - win_prob
        odds = avg_win / avg_loss

        kelly_pct = (win_prob * odds - loss_prob) / odds * 100

        print(f"\nKelly Criterion Result: {kelly_pct:.2f}% per trade")
        print(f"Quarter Kelly (Safe): {kelly_pct/4:.2f}% per trade")

        if kelly_pct > 10:
            print("⚠️  Kelly suggests high risk - use Quarter Kelly for safety")
        elif kelly_pct > 0:
            print("✅ Positive Kelly - system has edge")
        else:
            print("❌ Negative Kelly - system loses money long-term")

if __name__ == "__main__":
    simulator = RiskSimulator()

    print("Risk Management Simulator")
    print("See how different risk levels affect your trading account\n")

    choice = input("Choose: (1) Compare Risk Levels (2) Kelly Criterion Demo: ")

    if choice == "1":
        simulator.compare_risk_levels()
    else:
        simulator.kelly_criterion_demo()
