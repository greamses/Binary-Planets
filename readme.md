# Binary Bulbs - Interactive Binary Conversion Game  

## Overview  
Binary Bulbs is an engaging educational game that helps players learn binary number conversion through interactive light bulbs. Players practice converting decimal numbers to binary by toggling bulbs on/off, with visual feedback and scoring.  

## Key Features  

### Core Gameplay  
- Convert decimal numbers to binary by toggling bulbs  
- Multiple difficulty levels (4-bit and 8-bit modes)  
- Dynamic scoring system with high score tracking  
- Visual feedback for correct/incorrect answers  

### Educational Components  
- Interactive binary place value visualization  
- Immediate answer verification  
- Adaptive difficulty settings  

### Technical Features  
- Responsive bulb grid that adapts to screen size  
- Confetti animation system for celebrations  
- Sound effects for interactions  
- Local storage for persistent high scores  

## Technologies Used  
- **Frontend**: Vanilla JavaScript, HTML5, CSS3  
- **Audio**: Web Audio API for sound effects  
- **Graphics**: Canvas API for confetti animations  
- **Storage**: localStorage for saving high scores  

## Game Components  

### Game State Manager  
- Tracks score, high score, and current difficulty  
- Generates random target numbers  
- Manages bulb states and answer verification  
- Handles audio playback  

### UI Controller  
- Dynamic bulb rendering with responsive sizing  
- Real-time display updates  
- Message system for feedback  
- Tutorial modal with step-by-step instructions  

### Confetti System  
- Custom ribbon-style particle effects  
- Color variations and movement patterns  
- Performance-optimized rendering  

## How to Play  
1. **Select Difficulty**: Choose between 4-bit (0-15) or 8-bit (0-255) modes  
2. **Convert the Number**: Toggle bulbs to represent the binary equivalent of the displayed decimal  
3. **Check Answer**: Verify your binary conversion  
4. **Earn Points**: Correct answers add the decimal value to your score  
5. **Track Progress**: Try to beat your high score!  

## Installation  
No installation required - runs directly in modern browsers:  
1. Clone repository  
2. Open `index.html` in any browser  

```bash
git clone https://github.com/greamses/Binary-Planets.git
```

## Development Highlights  
- Implemented responsive bulb grid that dynamically sizes based on viewport  
- Created custom confetti system with ribbon physics  
- Developed comprehensive game state management  
- Optimized performance for smooth animations  

## Future Enhancements  
- Additional difficulty levels  
- Time-attack game mode  
- Sound/music controls  
- Multiplayer/competitive modes  

## License  
MIT License - Free for educational and personal use  

---
