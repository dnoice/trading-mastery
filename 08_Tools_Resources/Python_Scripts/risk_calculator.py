# 📁/📄 08_Tools_Resources\Python_Scripts\risk_calculator.py

"""
Advanced Risk Management Calculator for Day Trading Mastery
Includes position sizing, risk/reward, and Kelly Criterion
"""

import json
from datetime import datetime

class RiskManager:
    def __init__(self, account_size, max_risk_percent=1.0):
        self.account_size = account_size
        self.max_risk_percent = max_risk_percent
        self.trades_today = []

    def calculate_position_size(self, entry_price, stop_price, risk_percent=None):
        """Calculate proper position size based on risk parameters"""
        if risk_percent is None:
            risk_percent = self.max_risk_percent

        risk_amount = self.account_size * (risk_percent / 100)
        price_risk = abs(entry_price - stop_price)

        if price_risk == 0:
            return {"error": "Stop price cannot equal entry price"}

        shares = int(risk_amount / price_risk)
        position_value = shares * entry_price

        # Check if position size exceeds account
        if position_value > self.account_size * 0.25:  # Max 25% in one position
            shares = int((self.account_size * 0.25) / entry_price)
            position_value = shares * entry_price
            actual_risk = shares * price_risk
            risk_percent = (actual_risk / self.account_size) * 100

        return {
            "shares": shares,
            "position_value": round(position_value, 2),
            "risk_amount": round(shares * price_risk, 2),
            "risk_percent": round(risk_percent, 2),
            "price_risk": round(price_risk, 2),
            "account_percent": round((position_value / self.account_size) * 100, 2)
        }

    def calculate_risk_reward(self, entry, stop, target):
        """Calculate risk/reward ratio"""
        risk = abs(entry - stop)
        reward = abs(target - entry)

        if risk == 0:
            return {"error": "Risk cannot be zero"}

        ratio = reward / risk

        return {
            "ratio": round(ratio, 2),
            "risk": round(risk, 2),
            "reward": round(reward, 2),
            "acceptable": ratio >= 2.0  # Minimum 2:1 ratio
        }

    def kelly_criterion(self, win_rate, avg_win, avg_loss):
        """Calculate optimal position size using Kelly Criterion"""
        if avg_loss == 0:
            return {"error": "Average loss cannot be zero"}

        win_prob = win_rate / 100
        loss_prob = 1 - win_prob
        odds = avg_win / avg_loss

        kelly_percent = (win_prob * odds - loss_prob) / odds

        # Cap at 25% (quarter Kelly for safety)
        safe_kelly = min(kelly_percent * 100 / 4, self.max_risk_percent)

        return {
            "kelly_percent": round(kelly_percent * 100, 2),
            "safe_kelly": round(safe_kelly, 2),
            "recommended_risk": round(safe_kelly, 2)
        }

    def daily_loss_check(self):
        """Check if daily loss limit is reached"""
        total_loss = sum([t["pnl"] for t in self.trades_today if t["pnl"] < 0])
        loss_percent = abs(total_loss / self.account_size) * 100

        return {
            "total_loss": round(total_loss, 2),
            "loss_percent": round(loss_percent, 2),
            "stop_trading": loss_percent >= 5.0,  # 5% daily max loss
            "warning": loss_percent >= 3.0
        }

    def add_trade(self, symbol, pnl):
        """Record a trade for daily tracking"""
        self.trades_today.append({
            "time": datetime.now().strftime("%H:%M:%S"),
            "symbol": symbol,
            "pnl": pnl
        })
        self.account_size += pnl

    def generate_report(self):
        """Generate daily risk report"""
        if not self.trades_today:
            return "No trades recorded today"

        wins = [t for t in self.trades_today if t["pnl"] > 0]
        losses = [t for t in self.trades_today if t["pnl"] < 0]

        report = {
            "date": datetime.now().strftime("%Y-%m-%d"),
            "starting_balance": self.account_size - sum([t["pnl"] for t in self.trades_today]),
            "ending_balance": self.account_size,
            "total_trades": len(self.trades_today),
            "winning_trades": len(wins),
            "losing_trades": len(losses),
            "win_rate": round((len(wins) / len(self.trades_today)) * 100, 2) if self.trades_today else 0,
            "total_pnl": sum([t["pnl"] for t in self.trades_today]),
            "largest_win": max([t["pnl"] for t in wins]) if wins else 0,
            "largest_loss": min([t["pnl"] for t in losses]) if losses else 0,
            "daily_return": round((sum([t["pnl"] for t in self.trades_today]) / (self.account_size - sum([t["pnl"] for t in self.trades_today]))) * 100, 2)
        }

        return report

# Example usage and testing
if __name__ == "__main__":
    # Initialize with $5000 account
    risk_mgr = RiskManager(5000, max_risk_percent=1.0)

    print("=== RISK MANAGEMENT CALCULATOR ===\n")

    # Example 1: Position sizing
    print("1. POSITION SIZING")
    entry = 50.00
    stop = 49.00
    target = 52.00

    position = risk_mgr.calculate_position_size(entry, stop)
    print(f"Entry: ${entry}, Stop: ${stop}, Target: ${target}")
    print(f"Position Size: {position['shares']} shares")
    print(f"Position Value: ${position['position_value']}")
    print(f"Risk Amount: ${position['risk_amount']}")
    print(f"Account Risk: {position['risk_percent']}%\n")

    # Example 2: Risk/Reward
    print("2. RISK/REWARD ANALYSIS")
    rr = risk_mgr.calculate_risk_reward(entry, stop, target)
    print(f"Risk/Reward Ratio: {rr['ratio']}:1")
    print(f"Risk: ${rr['risk']}, Reward: ${rr['reward']}")
    print(f"Acceptable Trade: {'YES' if rr['acceptable'] else 'NO'}\n")

    # Example 3: Kelly Criterion
    print("3. KELLY CRITERION (OPTIMAL SIZING)")
    kelly = risk_mgr.kelly_criterion(win_rate=60, avg_win=150, avg_loss=100)
    print(f"Full Kelly: {kelly['kelly_percent']}%")
    print(f"Safe Kelly (1/4): {kelly['safe_kelly']}%")
    print(f"Recommended Risk: {kelly['recommended_risk']}%\n")

    # Example 4: Daily tracking
    print("4. DAILY LOSS TRACKING")
    risk_mgr.add_trade("AAPL", 150)
    risk_mgr.add_trade("TSLA", -75)
    risk_mgr.add_trade("SPY", -100)

    daily_check = risk_mgr.daily_loss_check()
    print(f"Total Daily Loss: ${daily_check['total_loss']}")
    print(f"Loss Percentage: {daily_check['loss_percent']}%")
    print(f"Stop Trading: {'YES - LIMIT REACHED!' if daily_check['stop_trading'] else 'NO'}")

    # Save functions to separate file for easy importing
    with open("risk_functions.py", "w") as f:
        f.write("""# Quick risk calculation functions

def quick_position_size(account, risk_pct, entry, stop):
    risk_amt = account * (risk_pct / 100)
    shares = int(risk_amt / abs(entry - stop))
    return shares

def quick_risk_reward(entry, stop, target):
    return round(abs(target - entry) / abs(entry - stop), 2)

def quick_dollar_risk(shares, entry, stop):
    return round(shares * abs(entry - stop), 2)
""")
