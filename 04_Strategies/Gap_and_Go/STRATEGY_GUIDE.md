# GAP AND GO STRATEGY GUIDE - PRODUCTION VERSION

## Executive Summary
The Gap and Go strategy is a momentum-based day trading approach that capitalizes on stocks experiencing significant price gaps at market open. This strategy leverages institutional order flow, news catalysts, and market microstructure to capture rapid price movements in the first 30-90 minutes of trading.

## Performance Expectations
- **Target Win Rate:** 55-65%
- **Risk/Reward Ratio:** Minimum 1:2 (ideally 1:3)
- **Average Holding Time:** 15-45 minutes
- **Daily Goal:** 2-3 quality trades maximum
- **Monthly Target:** 5-10% account growth

## Setup Criteria - The A+ Checklist

### Primary Requirements (ALL must be met)
1. **Gap Size:** 
   - Minimum: 2% (high liquidity stocks)
   - Optimal: 3-7% (best risk/reward)
   - Maximum: 15% (avoid pump & dumps)

2. **Volume Requirements:**
   - Pre-market volume > 100,000 shares
   - Relative volume > 1.5x (vs 20-day average)
   - Dollar volume > $1,000,000
   - First 5-min candle > 50% of average daily volume

3. **Price & Float Parameters:**
   - Price range: $1 - $100 (optimal $5-$50)
   - Float: < 50M shares for volatility plays
   - Market cap: > $10M (avoid micro-caps)
   - ATR: > $0.50 or 2% of stock price

4. **Catalyst Quality:**
   - **Tier 1:** Earnings beat/miss, FDA approval, major partnership
   - **Tier 2:** Analyst upgrades, product launches, guidance raise
   - **Tier 3:** Technical breakouts, sector momentum
   - **Avoid:** No catalyst gaps, crypto-related pumps

5. **Technical Structure:**
   - Above all major moving averages
   - No major resistance within 10% of entry
   - RSI < 70 (not already overbought)

## Entry Strategies - Multiple Confirmation System

### 🎯 Strategy 1: Opening Drive (Highest Probability)
```
Conditions:
- First 5-min candle closes above opening price
- Volume > 1M shares in first 5 minutes
- No immediate rejection at pre-market high

Entry: Market order after first 5-min close
Stop: Below first 5-min candle low
Target 1: +3% (sell 50%)
Target 2: +5% (sell 30%)
Runner: Trail stop at VWAP
```

### 🎯 Strategy 2: Opening Range Breakout (ORB)
```
Setup Phase: 9:30 - 9:45 AM
- Mark opening 15-minute range
- Identify support/resistance levels

Entry: Break above OR high with volume
Stop: Middle of opening range
Target: 1.5x the opening range size
Position Size: 75% of normal size (wider stop)
```

### 🎯 Strategy 3: VWAP Bounce (Conservative)
```
Wait for:
- Initial push and pullback to VWAP
- Touch VWAP with decreasing volume
- Green candle bounce with volume surge

Entry: First green candle close above VWAP
Stop: $0.10 below VWAP
Targets: Previous high, then trail
Success Rate: 65%+ when properly executed
```

### 🎯 Strategy 4: Bull Flag Breakout
```
Pattern:
- Strong initial move (the pole)
- Sideways consolidation (the flag)
- Volume drying up during consolidation

Entry: Break above flag high
Stop: Below flag low
Target: Measured move (flag pole height)
Time Frame: 5-minute chart
```

## Advanced Entry Signals (From Level 2 & Order Flow)

### Order Book Indicators
- **Bullish:** Bid size > Ask size by 2:1 ratio
- **Bullish:** Spread tightening (< 0.5% of price)
- **Bearish:** Large ask walls at resistance
- **Bearish:** Bid pulling (fake support)

### Volume Profile Analysis
- High Volume Node (HVN) = Support
- Low Volume Node (LVN) = Quick movement area
- Point of Control (POC) = Strongest support/resistance

## Position Sizing & Risk Management

### Kelly Criterion Modified Formula
```python
Position Size = Account Balance × (Win% × Avg_Win/Avg_Loss - Loss%) / (Avg_Win/Avg_Loss)
Safety Factor = 0.25 (use only 25% of Kelly suggestion)

Example:
- Account: $25,000
- Win Rate: 60%
- Avg Win/Loss: 2.0
- Kelly %: 10%
- Safe Position: 2.5% = $625 risk per trade
```

### Dynamic Position Sizing Matrix
| Signal Strength | Gap Quality | Position Size |
|----------------|-------------|---------------|
| 5/5 signals | 80+ score | 1.5% risk |
| 4/5 signals | 60-80 score | 1.0% risk |
| 3/5 signals | 40-60 score | 0.75% risk |
| <3 signals | <40 score | No trade |

### Stop Loss Management
1. **Initial Stop:** Most recent support or -2% max
2. **Breakeven Stop:** After +1% gain
3. **Trailing Stop:** 
   - Use VWAP after +2%
   - Use 9 EMA after +3%
   - ATR-based: 1.5 × ATR below current price

## Real-Time Scanner Configuration

### Polygon.io Scanner (Production)
```python
scanner_config = {
    'gap_min': 2.0,
    'gap_max': 15.0,
    'volume_min': 100000,
    'rel_volume_min': 1.5,
    'price_min': 1.0,
    'price_max': 100.0,
    'market_cap_min': 10_000_000,
    'float_max': 50_000_000
}
```

### ThinkorSwim Scanner
```
Study Filter 1: 
- Close[1] > 5 and Close[1] < 100
- Volume > 500000

Study Filter 2:
- (Open - Close[1]) / Close[1] * 100 > 2

Study Filter 3:
- Volume > Average(Volume, 20) * 1.5

Sort by: Gap %
```

### Trade Ideas Configuration
```
Window: Premarket Gappers
Filters:
- Gap: 2% to 15%
- Price: $1 to $100
- Volume: > 100K premarket
- Relative Volume: > 2
- Float: < 50M
Sort: Quality Score (custom)
```

## Time-Based Trading Rules

### Market Schedule (EST)
- **4:00 - 9:00:** Pre-market analysis only
- **9:00 - 9:30:** Identify top 3 gaps, set alerts
- **9:30 - 10:00:** Primary trading window (best setups)
- **10:00 - 10:30:** Secondary opportunities
- **10:30 - 11:00:** Close all positions (avoid chop)
- **After 11:00:** No new positions

### Daily Cutoffs
- **3 Loss Rule:** Stop after 3 consecutive losses
- **Profit Cap:** Consider stopping after +$1000 day
- **Time Stop:** Exit if no momentum by 10:30 AM

## Performance Metrics to Track

### Daily Metrics
```python
daily_metrics = {
    'total_trades': 0,
    'winning_trades': 0,
    'total_pnl': 0.00,
    'largest_win': 0.00,
    'largest_loss': 0.00,
    'win_rate': 0.0,
    'avg_hold_time': 0,
    'respect_stops': True/False
}
```

### Weekly Analysis Points
1. **Win Rate by Gap Size:**
   - 2-3%: ____%
   - 3-5%: ____%
   - 5-7%: ____%
   - 7-10%: ____%

2. **Performance by Entry Type:**
   - Opening Drive: ____%
   - ORB: ____%
   - VWAP Bounce: ____%

3. **Best/Worst Time Slots:**
   - 9:30-10:00: $____
   - 10:00-10:30: $____
   - After 10:30: $____

## Common Patterns & Success Rates

### High Probability Patterns (>60% win rate)
1. **Earnings Gap with Beat & Raise:** 65% success
2. **FDA Approval Gap:** 70% success
3. **Low Float + High Volume:** 62% success
4. **Sector Leader Sympathy:** 58% success

### Low Probability Patterns (<40% win rate)
1. **No Catalyst Gap:** 35% success
2. **Gap Above Resistance:** 38% success
3. **Afternoon Gaps:** 32% success
4. **Penny Stock Gaps:** 28% success

## Psychology & Discipline

### Pre-Trade Meditation (2 minutes)
```
1. Close eyes, deep breath
2. Visualize perfect execution
3. Accept potential loss
4. Commit to rules
5. Open eyes, execute plan
```

### Emotional States to Avoid Trading
- ❌ Revenge mode (after loss)
- ❌ Euphoria (after big win)
- ❌ Desperation (need money)
- ❌ FOMO (missed move)
- ❌ Tired/Sick

### Daily Affirmations
- "I am a disciplined trader who follows rules"
- "I accept small losses to protect capital"
- "I wait patiently for A+ setups only"
- "My edge comes from consistency, not gambling"

## Advanced Techniques

### Market Maker Behavior
- **Absorption:** Large orders absorbing selling = bullish
- **Spoofing:** Fake orders pulled quickly = trap
- **Iceberg Orders:** Hidden size = institutional interest
- **Sweep Orders:** Aggressive buying = urgency

### Tape Reading Signals
- **Bullish:** Consistent buying at ask
- **Bullish:** Higher lows on pullbacks
- **Bearish:** Selling into bid repeatedly
- **Bearish:** Lower highs on bounces

## Monthly Performance Review Template

### Quantitative Analysis
- Total Trades: ___
- Win Rate: ___%
- Profit Factor: ___
- Average Win: $___
- Average Loss: $___
- Largest Drawdown: $___
- Sharpe Ratio: ___
- Best Day: $___
- Worst Day: $___

### Qualitative Analysis
- Most profitable pattern: _________
- Most common mistake: _________
- Best improvement: _________
- Worst habit: _________
- Next month's focus: _________

## Emergency Procedures

### Flash Crash Protocol
1. Close all positions immediately
2. Cancel all pending orders
3. Step away for 15 minutes
4. Reassess market conditions
5. Only re-enter with 50% position size

### Technical Failures
1. **Internet Down:** Call broker immediately
2. **Platform Crash:** Use mobile backup
3. **Data Feed Lost:** Close positions
4. **Power Outage:** Have UPS battery backup

## Resources & Tools

### Essential Tools (Monthly Cost)
1. **Polygon.io:** $29/month (real-time data)
2. **Trade Ideas:** $118/month (scanning)
3. **DAS Trader:** $150/month (execution)
4. **Benzinga Pro:** $147/month (news)
5. **TradingView:** $30/month (charting)

### Educational Resources
- **Books:** "Trading in the Zone", "Market Wizards"
- **Courses:** SMB Capital, Warrior Trading
- **YouTube:** Live Traders, Humbled Trader
- **Discord/Slack:** Join trading communities

### Broker Recommendations
1. **Interactive Brokers:** Best for pros (low fees)
2. **Lightspeed:** Best execution speed
3. **TradeStation:** Good for automation
4. **Alpaca:** Best for API trading (free)

## Legal & Compliance

### Pattern Day Trader (PDT) Rule
- Need $25,000 minimum for day trading
- More than 4 day trades in 5 days = PDT
- Consider cash account if under $25k

### Tax Considerations
- Keep detailed records (use software)
- Consider Mark-to-Market election
- Set aside 30% for taxes
- Quarterly estimated payments

## Final Words of Wisdom

> "The Gap and Go strategy is not about being right every time - it's about being consistent, disciplined, and letting winners run while cutting losers quickly. One good gap can make your week, but one bad undisciplined trade can ruin your month. Trade the setup, not the P&L."

### The 10 Commandments of Gap Trading
1. **Thou shalt always use a stop loss**
2. **Thou shalt not chase extended moves**
3. **Thou shalt respect the VWAP**
4. **Thou shalt not average down**
5. **Thou shalt take partial profits**
6. **Thou shalt not trade without a catalyst**
7. **Thou shalt honor thy daily loss limit**
8. **Thou shalt not hold overnight**
9. **Thou shalt review every trade**
10. **Thou shalt stay humble in victory**

---

**Remember:** Professional trading is a marathon, not a sprint. Focus on process over profits, and the money will follow.

*Last Updated: 2024 | Version: Production 2.0*
