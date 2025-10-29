# ViralBase Streaming Features

## Overview
ViralBase now features a comprehensive streaming system with categorized content, seamless auto-scrolling, multi-stream viewing, and XP rewards for content creators.

## 🎬 Stream Features

### Stream Tags
- Content is organized by **hashtag streams** (e.g., #Bali, #Vegas, #Tokyo)
- Uploaders tag their content when posting
- Videos with the same tag are grouped into continuous streams
- Each stream has its own color theme and identity

### Seamless Auto-Scrolling
- Videos automatically transition to the next in the stream
- **Seamless transitions** happen 1 second before video end
- Almost "remixed" feel with smooth crossfades
- Endless content loop within each stream
- Progress indicators show your position in the stream

### Multi-Stream Viewing

#### Single View (Full Screen)
- Watch one stream in full screen
- Complete focus on one location/tag
- All betting and interaction features available

#### Split-2 View
- Watch 2 streams side by side
- Compare different locations simultaneously
- Bet on which stream will be more popular
- Independent stream controls for each

#### Split-3 View
- Watch up to 3 streams at once
- Maximum engagement across multiple locations
- Competition mode with live XP tracking
- Bet on the winning stream

## 🎮 Competition Mode

When viewing multiple streams:
- **XP tracking** for each stream
- **Live leaderboard** showing which stream is winning
- **Real-time stats** (likes, views, XP) for each stream
- **Bet on winners** - predict which stream will have most engagement
- **Visual indicators** showing the leading stream

## ⭐ XP Points System

### For Content Creators
- Earn XP when viewers watch your content
- XP shared among all creators in a stream
- Higher engagement = more XP
- Track total XP and earnings in profile
- Leaderboards per stream tag

### XP Distribution
- **Per view**: Base XP earned
- **Per like**: Bonus XP multiplier
- **Virality bonus**: Extra XP for trending content
- **Stream bonus**: XP shared across tag community

### XP Display
- Real-time XP notifications while watching
- Creator XP totals shown on videos
- Stream XP pools visible in competition mode
- Top creators featured per stream tag

## 📱 User Interface

### Stream Selector
- Browse all available streams
- See video count and total XP per stream
- View top creators for each tag
- Select up to 3 streams for multi-view
- Color-coded tags for easy identification

### View Mode Controls
- **Full**: Single stream full screen
- **Split 2**: Two streams side by side
- **Split 3**: Three streams grid view
- Quick toggle between modes
- Remembers your preference

### Stream Navigation
- **Bottom selector bar**: Quick switch between streams
- **Progress dots**: Show position in stream
- **Auto-advance**: Seamless video transitions
- **Manual controls**: Skip forward/back if needed

## 💰 Betting Features

### Bet on Virality (Single Stream)
- Bet that a video will go viral
- Track virality score in real-time
- Payouts based on engagement metrics
- Pay with Base Pay

### Bet on Winners (Multi-Stream)
- Choose which stream will dominate
- Based on XP accumulation
- Live tracking of all streams
- Winner determined by engagement

## 🎨 Stream Tags Available

### Current Streams
- 🌴 **#Bali** - Indonesia beach & culture
- 🎰 **#Vegas** - USA nightlife & entertainment
- 🗼 **#Tokyo** - Japan city life & culture
- 🦁 **#Safari** - Kenya wildlife & adventure
- 🌊 **#Miami** - USA beach & party scene
- 🗼 **#Paris** - France art & culture

### Adding New Streams
Creators can add new stream tags when posting content. Popular tags automatically become new streams.

## 🚀 How to Use

### For Viewers

1. **Choose Your Streams**
   - Click "Streams" button in top-right
   - Select up to 3 streams to watch
   - Each stream shows preview stats

2. **Select View Mode**
   - Start with Full screen for single stream
   - Switch to Split-2 or Split-3 for multiple streams
   - Use view mode buttons in top-left

3. **Enjoy Auto-Scrolling**
   - Videos automatically advance
   - Seamless transitions between content
   - No manual scrolling needed

4. **Participate in Betting**
   - Connect your wallet (top-right)
   - Bet on virality or winning streams
   - Track your bets in real-time

### For Creators

1. **Post Content**
   - Click the "+" button
   - Tag your content with stream hashtags
   - Pay $0.10 posting fee (Base Pay)

2. **Earn XP**
   - Earn XP as viewers watch your content
   - XP accumulates with likes and engagement
   - Shared across your stream community

3. **Track Performance**
   - See your XP on each video
   - Track total XP across all streams
   - Climb stream leaderboards

## 🎯 Technical Features

### Seamless Transitions
- Pre-loading next video in stream
- Crossfade animation (300ms)
- Scale transition for "remixed" feel
- No buffering interruptions

### Performance
- Optimized video loading
- Efficient stream management
- Smooth 60fps animations
- Minimal memory footprint

### Responsive Design
- Works on desktop and mobile
- Touch gestures for mobile
- Adaptive layouts
- Optimized for all screen sizes

## 🔧 Development

### Key Components
- `MultiStreamViewer` - Main streaming interface
- `StreamPlayer` - Individual stream player with auto-advance
- `StreamSelector` - Stream browsing and selection
- `VideoCard` - Video display with XP tracking

### Data Structure
```typescript
interface Stream {
  id: string
  tag: StreamTag
  videos: VideoContent[]
  currentVideoIndex: number
  totalViews: number
  activeViewers: number
  xpPool: number
}
```

## 🎊 Future Features

- [ ] User-created stream tags
- [ ] Stream mixing/remixing
- [ ] Cross-stream challenges
- [ ] Stream tournaments
- [ ] Premium stream subscriptions
- [ ] Stream creator tools
- [ ] Advanced analytics
- [ ] Mobile apps

---

**Built with Base Pay on Base Sepolia Testnet**
