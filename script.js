// ===== GAME CONSTANTS =====
const DIFFICULTY_SETTINGS = {
  4: { max: 15, label: "4 Planets (0-15)" },
  8: { max: 255, label: "8 Planets (0-255)" },
};

const AUDIO_URLS = {
  click: "https://assets.mixkit.co/active_storage/sfx/2575/2575-preview.mp3",
  win: "https://assets.mixkit.co/active_storage/sfx/2588/2588-preview.mp3"
};

// ===== GAME STATE =====
class GameState {
  constructor() {
    this.score = 0;
    this.highScore = localStorage.getItem('binaryHighScore') || 0;
    this.currentDifficulty = 4;
    this.currentDecimal = 0;
    this.bulbStates = [];
    this.audioElements = {};
  }

  init() {
    this.loadAudio();
    this.setDifficulty(this.currentDifficulty);
    this.generateNewNumber();
  }

  setDifficulty(bitCount) {
    this.currentDifficulty = bitCount;
    this.bulbStates = new Array(bitCount).fill(0);
    this.generateNewNumber();
  }

  generateNewNumber() {
    const max = DIFFICULTY_SETTINGS[this.currentDifficulty].max;
    this.currentDecimal = Math.floor(Math.random() * max) + 1;
    this.resetBulbs();
  }

  resetBulbs() {
    this.bulbStates = new Array(this.currentDifficulty).fill(0);
  }

  toggleBulb(index) {
    this.bulbStates[index] = this.bulbStates[index] ? 0 : 1;
    this.playSound('click');
  }

  checkAnswer() {
    const correctBinary = this.currentDecimal.toString(2).padStart(this.currentDifficulty, '0');
    const userBinary = this.bulbStates.join('');
    
    if (userBinary === correctBinary) {
      
      this.handleCorrectAnswer();
      return true;
    } else {
      this.handleIncorrectAnswer();
      return false;
    }
  }

  handleCorrectAnswer() {
    this.score += this.currentDecimal;
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('binaryHighScore', this.highScore);
    }
    this.playSound('win');
  }

  handleIncorrectAnswer() {
    this.score = Math.max(0, this.score - 10);
  }

  loadAudio() {
    Object.entries(AUDIO_URLS).forEach(([name, url]) => {
      this.audioElements[name] = new Audio(url);
    });
  }

  playSound(name) {
    if (this.audioElements[name]) {
      this.audioElements[name].currentTime = 0;
      this.audioElements[name].play();
    }
  }
}

// ===== UI CONTROLLER =====
class UIController {
  constructor(gameState) {
    this.gameState = gameState;
    this.cacheDOM();
    this.initUI();
    this.setupEventListeners();
  }

  cacheDOM() {
    this.elements = {
      bulbsContainer: document.getElementById('bulbs'),
      decimalDisplay: document.getElementById('decimalNumber'),
      binaryDigits: document.getElementById('binaryDigits'),
      checkButton: document.getElementById('checkButton'),
      nextButton: document.getElementById('nextButton'),
      helpButton: document.getElementById('helpButton'),
      difficultySelect: document.getElementById('difficulty'),
      highScoreDisplay: document.getElementById('highScore'),
      message: document.getElementById('message'),
      tutorialModal: document.getElementById('tutorialModal'),
      confettiCanvas: document.getElementById('confetti-canvas')
    };
  }

  initUI() {
    this.populateDifficultyOptions();
    this.renderBulbs();
    this.updateDisplay();
  }

  populateDifficultyOptions() {
    const select = this.elements.difficultySelect;
    select.innerHTML = Object.entries(DIFFICULTY_SETTINGS)
      .map(([value, { label }]) => `<option value="${value}">${label}</option>`)
      .join('');
    
    select.value = this.gameState.currentDifficulty;
  }

  renderBulbs() {
  this.elements.bulbsContainer.innerHTML = '';
  
  // Calculate max possible bulb size based on viewport width
  const bulbCount = this.gameState.bulbStates.length;
  const viewportWidth = window.innerWidth;
  const maxBulbSize = Math.min(
    (viewportWidth * 0.9 - (bulbCount * 8)) / bulbCount, // Account for gaps
    50 // Maximum size in px
  );
  
  this.gameState.bulbStates.forEach((_, index) => {
    const bulb = document.createElement('div');
    bulb.className = 'bulb';
    bulb.style.setProperty('--size', `${Math.max(30, maxBulbSize)}px`);
    bulb.dataset.index = index;
    
    const value = Math.pow(2, this.gameState.currentDifficulty - 1 - index);
    bulb.dataset.value = value;
    
    bulb.addEventListener('click', () => this.handleBulbClick(index));
    this.elements.bulbsContainer.appendChild(bulb);
  });
  
  this.updateBulbStates();
}

  updateBulbStates() {
    this.elements.bulbsContainer.querySelectorAll('.bulb').forEach((bulb, index) => {
      bulb.classList.toggle('on', this.gameState.bulbStates[index] === 1);
    });
  }

  updateDisplay() {
    this.elements.decimalDisplay.textContent = this.gameState.currentDecimal;
    this.elements.binaryDigits.textContent = this.gameState.bulbStates.join('');
    this.elements.highScoreDisplay.textContent = this.gameState.highScore;
    this.hideMessage();
  }

  showMessage(text, type) {
    const { message } = this.elements;
    message.textContent = text;
    message.className = `message show ${type}`;
  }

  hideMessage() {
    this.elements.message.className = 'message';
  }

  handleBulbClick(index) {
    this.gameState.toggleBulb(index);
    this.updateBulbStates();
    this.updateDisplay();
  }

  handleCheckAnswer() {
    const isCorrect = this.gameState.checkAnswer();
    
    if (isCorrect) {
      this.showMessage(`Correct! +${this.gameState.currentDecimal} points! 🎉`, 'success');
      this.triggerConfetti();
      setTimeout(() => {
        this.gameState.generateNewNumber();
        this.updateDisplay();
      }, 1500);
    } else {
      this.showMessage('Oops! Try again! 👾', 'error');
    }
    
    this.updateDisplay();
  }

  handleNextNumber() {
    this.gameState.generateNewNumber();
    this.updateDisplay();
  }

  handleDifficultyChange() {
    const bitCount = parseInt(this.elements.difficultySelect.value);
    this.gameState.setDifficulty(bitCount);
    this.renderBulbs();
    this.updateDisplay();
  }

  toggleTutorial() {
    this.elements.tutorialModal.classList.toggle('active');
  }

  triggerConfetti() {
    const canvas = this.elements.confettiCanvas;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const confetti = new ConfettiSystem(canvas);
    confetti.start(4000);
    
    setTimeout(() => {
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    }, 2500);
  }

  setupEventListeners() {
    this.elements.checkButton.addEventListener('click', () => this.handleCheckAnswer());
    this.elements.nextButton.addEventListener('click', () => this.handleNextNumber());
    this.elements.helpButton.addEventListener('click', () => this.toggleTutorial());
    this.elements.difficultySelect.addEventListener('change', () => this.handleDifficultyChange());
    
    this.elements.tutorialModal.addEventListener('click', (e) => {
      if (e.target === this.elements.tutorialModal) {
        this.toggleTutorial();
      }
    });
    
    const closeModal = document.querySelector('.close');
    const nextStepBtn = document.querySelector('.btn-next-step');
    
    if (closeModal) closeModal.addEventListener('click', () => this.toggleTutorial());
    if (nextStepBtn) nextStepBtn.addEventListener('click', () => this.nextTutorialStep());
  }

  nextTutorialStep() {
    const currentStep = document.querySelector('.tutorial-step.active');
    const nextStep = currentStep.nextElementSibling;
    
    if (nextStep?.classList.contains('tutorial-step')) {
      currentStep.classList.remove('active');
      nextStep.classList.add('active');
    } else {
      this.toggleTutorial();
      document.querySelector('[data-step="1"]').classList.add('active');
    }
  }
}

// ===== FINAL RIBBON CONFETTI SYSTEM =====
class ConfettiSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.animationId = null;
    this.colors = [
      '#ff6b6b', '#6bff6b', '#6b6bff', 
      '#ffff6b', '#ff6bff', '#6bffff',
      '#ffb86b', '#b86bff', '#6bb8ff'
    ];
  }
  
  start(duration = 3500) {
    this.createParticles();
    this.animate();
    setTimeout(() => this.stop(), duration);
  }
  
  stop() {
    cancelAnimationFrame(this.animationId);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  
  createParticles() {
    const particleCount = Math.min(200, window.innerWidth / 3);
    for (let i = 0; i < particleCount; i++) {
      const size = Math.random() * 5 + 5; 
      const length = Math.random() * 30 + 20; 
      
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * -this.canvas.height * 1.2,
        size: size,
        length: length,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        speed: Math.random() * 3 + 1.5,
        sway: Math.random() * 0.5 - 1.25, 
        swaySpeed: Math.random() * 0.02 + 0.01,
        opacity: Math.random() * 0.95 + 0.05,
        wave: Math.random() * 0.15 - 0.15
      });
    }
  }
  
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      
      // Update position - no rotation
      p.y += p.speed;
      p.x += Math.sin(p.y * p.swaySpeed) * p.sway;
      
      // Add subtle vertical wave
      const waveOffset = Math.sin(p.y * 0.02) * p.wave * 5;
      
      // Remove off-screen particles
      if (p.y > this.canvas.height + p.length) {
        this.particles.splice(i, 1);
        continue;
      }
      
      // Draw ribbon without rotation
      this.ctx.save();
      this.ctx.translate(p.x, p.y + waveOffset);
      this.ctx.globalAlpha = p.opacity;
      
      // Ribbon body with slight taper
      this.ctx.beginPath();
      this.ctx.moveTo(-p.size / 2, -p.length / 2);
      this.ctx.lineTo(p.size / 2, -p.length / 2);
      this.ctx.lineTo(p.size / 2.5, p.length / 2);
      this.ctx.lineTo(-p.size / 2.5, p.length / 2);
      this.ctx.closePath();
      
      // Gradient fill
      const gradient = this.ctx.createLinearGradient(0, -p.length / 2, 0, p.length / 2);
      gradient.addColorStop(0, p.color);
      gradient.addColorStop(1, this.lightenColor(p.color, 15));
      this.ctx.fillStyle = gradient;
      this.ctx.fill();
      
      // Subtle center highlight
      this.ctx.globalCompositeOperation = 'overlay';
      this.ctx.fillStyle = `rgba(255, 255, 255, 0.15)`;
      this.ctx.beginPath();
      this.ctx.moveTo(-p.size / 3, -p.length / 3);
      this.ctx.lineTo(p.size / 3, -p.length / 3);
      this.ctx.lineTo(p.size / 4, p.length / 3);
      this.ctx.lineTo(-p.size / 4, p.length / 3);
      this.ctx.closePath();
      this.ctx.fill();
      
      this.ctx.restore();
    }
    
    if (this.particles.length > 0) {
      this.animationId = requestAnimationFrame(() => this.animate());
    } else {
      this.stop();
    }
  }
  
  lightenColor(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, (num >> 16) + amt);
    const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
    const B = Math.min(255, (num & 0x0000FF) + amt);
    return `#${(1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1)}`;
  }
}

// ===== INITIALIZE GAME =====
document.addEventListener('DOMContentLoaded', () => {
  const gameState = new GameState();
  gameState.init();
  
  const uiController = new UIController(gameState);
});


