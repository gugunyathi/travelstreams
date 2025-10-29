# 🎰 Video Slot Machine Feature

## Overview
The Video Slot Machine transforms ViralBase into an exciting gambling experience where users can spin 3 vertical video streams and win based on center-line alignment matches.

## 🎮 How It Works

### Visual Layout
```
┌─────────┬─────────┬─────────┐
│ REEL 1  │ REEL 2  │ REEL 3  │
│         │         │         │
│  Video  │  Video  │  Video  │
│    ↓    │    ↓    │    ↓    │
│─────────┼─────────┼─────────│ ← CENTER MATCH LINE (highlighted)
│  Video  │  Video  │  Video  │
│    ↓    │    ↓    │    ↓    │
│  Video  │  Video  │  Video  │
└─────────┴─────────┴─────────┘
```

### Game Mechanics

1. **Three Vertical Reels**
   - Each reel shows a video stream
   - Videos continuously scroll vertically (like slot machine reels)
   - Each reel can be from different streams (#Bali, #Vegas, #Tokyo, etc.)

2. **The Spin**
   - Player clicks the SPIN button (costs $1.00 per spin)
   - All 3 reels start spinning with blur effect
   - Reels stop sequentially (left → middle → right)
   - Each reel stops at a random video
   - 500ms delay between each reel stopping (builds anticipation!)

3. **The Match Line**
   - Yellow horizontal line across the center
   - Only the 3 videos on this line count for matching
   - Videos must align horizontally across all 3 reels

4. **Winning Combinations**
   - Videos are analyzed for matches across the center line
   - Multiple types of matches possible
   - Higher rarity = bigger payout

## 💰 Paytable & Winning Combinations

### 🎰 JACKPOT - Same Creator x3 (100x)
**Payout:** $100.00 (on $1 bet)
- All 3 videos created by same user
- Rarest and highest payout
- Example: @bali_explorer videos on all 3 reels

### 🌍 Location Triple (50x)
**Payout:** $50.00 (on $1 bet)
- All 3 videos from same location
- Example: All videos from "Bali"
- Second highest payout

### 🏷️ Tag Match (25x)
**Payout:** $25.00 (on $1 bet)
- All 3 videos share same hashtag
- Example: All have #Beach tag
- Moderate payout

### 🎯 Category Match (15x)
**Payout:** $15.00 (on $1 bet)
- All 3 videos in same category
- Example: All "nightlife" category
- Common win

### 👥 Creator Pair (5x)
**Payout:** $5.00 (on $1 bet)
- 2 out of 3 videos from same creator
- Most common win
- Small but frequent payout

## 🎨 User Interface

### Top Bar
- **Balance Display**: Shows current credit balance
- **Total Winnings**: Cumulative winnings this session
- **Spin Counter**: Number of spins played
- **Add Funds Button**: Quick access to purchase credits

### Slot Machine Frame
- **Golden Frame**: Casino-style decorative border with glow effect
- **3 Video Reels**: Each 380px wide x 600px tall
- **Reel Labels**: "REEL 1", "REEL 2", "REEL 3"
- **Match Line Indicator**: Yellow highlighted center line with "MATCH LINE" badge

### Spin Button
- **Large circular button** at bottom center
- **Animated pulse effect** when ready
- Shows:
  - ✨ Sparkles icon
  - "SPIN" text
  - Cost: "$1.00"
- **Disabled states**:
  - During spin (shows spinning animation)
  - Insufficient balance
  - Wallet not connected

### Win Notification
- **Large centered overlay** appears on wins
- Shows:
  - 🎉 Celebration emoji
  - Win message (e.g., "JACKPOT! Same Creator Triple Match!")
  - Payout amount in large text
  - Multiplier badge (e.g., "100x Multiplier")
- **Zoom-in animation** entrance
- Auto-dismisses after 5 seconds

### Paytable Display
- **Bottom left corner**
- Shows all possible winning combinations
- Color-coded by payout tier
- Trophy icon header

## 🎲 Technical Details

### Spin Mechanics
```typescript
SPIN_COST = $1.00
SPIN_DURATION = 3000ms (3 seconds)
SLOT_DELAY = 500ms (between each reel stop)

Total spin time:
- Reel 1 stops: 3.0 seconds
- Reel 2 stops: 3.5 seconds  
- Reel 3 stops: 4.0 seconds
- Results check: 4.5 seconds
```

### Animation Sequence
1. **Spin Start (0ms)**
   - Deduct $1 from balance
   - All reels blur and start spinning
   - Overlay animation on each reel
   
2. **Reel 1 Stops (3000ms)**
   - Random video selected
   - Blur removed
   - Scale back to normal

3. **Reel 2 Stops (3500ms)**
   - Random video selected
   - Tension builds!

4. **Reel 3 Stops (4000ms)**
   - Random video selected
   - Final reel locked

5. **Result Check (4500ms)**
   - Analyze center line
   - Check for matches
   - Display win or continue

### Match Detection Algorithm
```typescript
Priority order (checked first match wins):
1. Check creator IDs (all 3 same)
2. Check locations (all 3 same)
3. Check common tags (all 3 share tag)
4. Check common categories (all 3 share category)
5. Check creator pairs (any 2 same)
6. No match = lose
```

## 💳 Payment Integration

### Credit System
- Users maintain a balance shown in top bar
- Balance used for spins ($1 per spin)
- Winnings added directly to balance
- Can cash out or keep playing

### Add Funds
- **Base Pay Integration**
- Dialog with preset amounts:
  - $10
  - $25
  - $50
  - $100
- Payment processed on Base Sepolia
- Credits added immediately on success

### Wallet Requirements
- Must connect wallet to play
- Button disabled if not connected
- Prompts user to connect when attempting spin

## 🎯 Game Strategy

### Probability Analysis
- **Jackpot (100x)**: ~1 in 1000 spins (0.1%)
- **Location Triple (50x)**: ~1 in 300 spins (0.33%)
- **Tag Match (25x)**: ~1 in 150 spins (0.67%)
- **Category Match (15x)**: ~1 in 50 spins (2%)
- **Creator Pair (5x)**: ~1 in 10 spins (10%)

### Expected Return
- House edge: ~15%
- Return to Player (RTP): ~85%
- Volatile gameplay with big win potential

### Tips for Players
1. **Start Small**: Test with minimum bets
2. **Set Limits**: Decide max loss before playing
3. **Watch Patterns**: Learn video distribution
4. **Jackpot Hunt**: Keep spinning for rare creator matches
5. **Cash Out Wins**: Secure profits regularly

## 🎬 Visual Effects

### Spinning Animation
- Vertical blur motion effect
- White gradient overlay moving down
- Scale reduction during spin
- Smooth transition on stop

### Win Celebration
- Zoom-in entrance animation
- Pulsing golden background
- Floating celebration emoji
- Scale bounce effect

### Background
- Purple to pink to red gradient
- Animated dot pattern overlay
- Pulsing glow effects
- Casino ambiance

## 🔊 Future Enhancements

### Audio (Not Yet Implemented)
- [ ] Spinning sound effect
- [ ] Reel stop sound (each reel)
- [ ] Win celebration sounds
- [ ] Background casino music
- [ ] Jackpot alarm

### Additional Features
- [ ] Auto-spin mode
- [ ] Bet multiplier (2x, 5x, 10x stakes)
- [ ] Progressive jackpot pool
- [ ] Tournament mode
- [ ] Leaderboards
- [ ] Social sharing of big wins
- [ ] Replay last spin
- [ ] Favorite reel combinations

### Enhanced Matches
- [ ] Diagonal line matches
- [ ] Multiple line bets
- [ ] Scatter symbol bonuses
- [ ] Free spin rewards
- [ ] Wild card videos

## 🚀 Usage

### Accessing Slot Machine
1. Click **"Slot Machine"** button in top navigation
2. Ensure wallet is connected
3. Add funds if needed
4. Click **SPIN** to play

### Playing a Round
```
1. Balance: $100.00
2. Click SPIN (-$1.00)
3. Watch reels spin
4. Reels stop one by one
5. Center line checked
6. Win $25.00! (Tag Match)
7. New balance: $124.00
8. Spin again!
```

### Cashing Out
- Balance shown in top bar
- Can be withdrawn via Base Pay
- Convert credits back to ETH
- Transfer to wallet

## ⚠️ Responsible Gaming

### Safety Features
- Clear balance display
- Visible cost per spin
- Win/loss tracking
- No hidden fees
- Transparent odds

### Disclaimers
- This is entertainment gambling
- Set personal limits
- Never bet more than you can afford
- House always has edge
- Past results don't predict future

## 🎰 Summary

The Video Slot Machine combines:
- **Viral short videos** as slot symbols
- **Real crypto payments** via Base Pay
- **Casino-style excitement** with modern UX
- **Fair randomization** with transparent odds
- **Multiple win conditions** for varied gameplay
- **Instant payouts** to your balance

It's TikTok meets Vegas - scroll, spin, and win! 🎉

---

**Built with Base Pay on Base Sepolia Testnet**
