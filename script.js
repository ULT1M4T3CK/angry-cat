// DOM elements
const catEmoji = document.getElementById('catEmoji');
const message = document.getElementById('message');
const clickCount = document.getElementById('clickCount');
const resetBtn = document.getElementById('resetBtn');

// Game state
let clicks = 0;
let catState = 0;
let clickTimer = null;
let clickCountForDetection = 0;
let rainbowMode = false;

// Cat states configuration
const catStates = [
    { emoji: '😸', message: 'Click me if you dare!' },
    { emoji: '😾', message: 'Hey! That tickles...' },
    { emoji: '😡', message: 'Stop it! I\'m getting mad!' },
    { emoji: '💀', message: 'You killed me! I\'m dead now!' }
];

// Initialize the game
function init() {
    updateDisplay();
    addEventListeners();
}

// Add event listeners
function addEventListeners() {
    catEmoji.addEventListener('click', handleCatClick);
    resetBtn.addEventListener('click', resetGame);
}

// Handle cat click (now handles both single and double clicks)
function handleCatClick(event) {
    clickCountForDetection++;

    if (clickCountForDetection === 1) {
        // First click, start timer to check for double-click
        clickTimer = setTimeout(() => {
            // This is a single click
            clicks++;
            
            // Progress cat state
            if (catState < catStates.length - 1) {
                catState++;
            }
            
            // Add shake animation for angry states
            if (catState >= 1) {
                catEmoji.classList.add('shake');
                setTimeout(() => {
                    catEmoji.classList.remove('shake');
                }, 500);
            }
            
            // Add glow effect for final state
            if (catState === catStates.length - 1) {
                catEmoji.classList.add('glow');
            }
            
            updateDisplay();
            playClickSound();
            
            // Create particles for single click
            createParticles();
            
            // Show fun fact every 10 clicks
            checkForFunFact();
            
            clickCountForDetection = 0; // Reset for next click sequence
        }, 300); // 300ms threshold for double click
    } else if (clickCountForDetection === 2) {
        // Second click within threshold, it's a double click
        clearTimeout(clickTimer); // Clear the single click timer
        triggerRainbowMode();
        clickCountForDetection = 0; // Reset for next click sequence
    }
}

// Create particles function
function createParticles() {
    const rect = catEmoji.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            createParticle(x, y, colors[Math.floor(Math.random() * colors.length)]);
        }, i * 100);
    }
}

// Trigger rainbow mode easter egg
function triggerRainbowMode() {
    if (rainbowMode) return;
    
    rainbowMode = true;
    catEmoji.classList.add('rainbow');
    message.textContent = '🌈 RAINBOW CAT MODE! 🌈';
    message.style.color = '#ffeb3b';
    message.style.textShadow = '0 0 10px #ffeb3b';
    
    // Remove rainbow mode after 5 seconds
    setTimeout(() => {
        rainbowMode = false;
        catEmoji.classList.remove('rainbow');
        updateDisplay();
    }, 5000);
}

// Reset the game
function resetGame() {
    clicks = 0;
    catState = 0;
    rainbowMode = false;
    
    // Remove all special classes
    catEmoji.classList.remove('shake', 'glow', 'rainbow');
    
    // Reset message styling
    message.style.color = '';
    message.style.textShadow = '';
    
    updateDisplay();
    playResetSound();
}

// Update display
function updateDisplay() {
    if (!rainbowMode) {
        catEmoji.textContent = catStates[catState].emoji;
        message.textContent = catStates[catState].message;
    }
    clickCount.textContent = clicks;
}

// Play click sound effect (using Web Audio API)
function playClickSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
        // Fallback for browsers that don't support Web Audio API
        console.log('Audio not supported');
    }
}

// Play reset sound effect
function playResetSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
    } catch (error) {
        console.log('Audio not supported');
    }
}

// Add some educational fun facts
function showFunFact() {
    const funFacts = [
        "Did you know? Cats have over 20 muscles that control their ears!",
        "Fun fact: A cat's purr vibrates at a frequency that promotes bone healing!",
        "Interesting: Cats spend 70% of their lives sleeping!",
        "Amazing: A cat's whiskers help them determine if they can fit through spaces!"
    ];
    
    const randomFact = funFacts[Math.floor(Math.random() * funFacts.length)];
    
    // Show fact as a temporary message
    const originalMessage = message.textContent;
    message.textContent = randomFact;
    message.style.color = '#ffeb3b';
    
    setTimeout(() => {
        if (!rainbowMode) {
            message.textContent = originalMessage;
            message.style.color = '';
        }
    }, 3000);
}

// Show fun fact every 10 clicks
function checkForFunFact() {
    if (clicks > 0 && clicks % 10 === 0) {
        showFunFact();
    }
}

// Remove the old enhanced click handler since we now handle everything in handleCatClick

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Add keyboard shortcuts
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        event.preventDefault();
        handleCatClick();
    } else if (event.code === 'KeyR') {
        event.preventDefault();
        resetGame();
    }
});

// Add touch support for mobile devices
catEmoji.addEventListener('touchstart', (event) => {
    event.preventDefault();
    handleCatClick();
}, { passive: false });

// Prevent context menu on cat emoji
catEmoji.addEventListener('contextmenu', (event) => {
    event.preventDefault();
});

// Add some particle effects for special moments
function createParticle(x, y, color) {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.width = '4px';
    particle.style.height = '4px';
    particle.style.backgroundColor = color;
    particle.style.borderRadius = '50%';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '1000';
    
    document.body.appendChild(particle);
    
    // Animate particle
    const animation = particle.animate([
        { transform: 'translate(0, 0) scale(1)', opacity: 1 },
        { transform: 'translate(' + (Math.random() * 100 - 50) + 'px, ' + (Math.random() * 100 - 50) + 'px) scale(0)', opacity: 0 }
    ], {
        duration: 1000,
        easing: 'ease-out'
    });
    
    animation.onfinish = () => {
        document.body.removeChild(particle);
    };
}

// Remove the old enhanced click handler since we now handle everything in handleCatClick 