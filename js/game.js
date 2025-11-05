let canvas;
let world;
let keyboard = new Keyboard();
let ctx;
let gameState = 'start';
let startScreenImg;
let gameOverImg;
let winImg;
let backgroundMusic;
let globalSoundManager;
let isMuted = false;

/**
 * Initializes the game.
 * @returns {void}
 */
function init() {
    canvas = document.getElementById("gameCanvas"); ctx = canvas.getContext("2d");
    startScreenImg = new Image();
    startScreenImg.src = 'components/img_pollo_loco/img/9_intro_outro_screens/start/startscreen_2.png';
    startScreenImg.onload = function () { showStartScreen(); };
    gameOverImg = new Image(); gameOverImg.src = 'components/img_pollo_loco/img/You won, you lost/Game over A.png';
    winImg = new Image(); winImg.src = 'components/img_pollo_loco/img/You won, you lost/You Won B.png';
    backgroundMusic = new Audio('components/audio/Run-Amok(chosic.com).mp3'); backgroundMusic.loop = true; backgroundMusic.volume = 0.5;
    globalSoundManager = new SoundManager();
    loadMuteSettings();
    canvas.addEventListener('click', handleCanvasClick);
    initMobileControls();
    initRotateDeviceOverlay();
}

/**
 * Initializes the mobile controls.
 * @returns {void}
 */
function initMobileControls() {
    const leftBtn = document.getElementById('leftBtn');
    const rightBtn = document.getElementById('rightBtn');
    const jumpBtn = document.getElementById('jumpBtn');
    const throwBtn = document.getElementById('throwBtn');
    leftBtn.addEventListener('touchstart', (e) => { e.preventDefault(); keyboard.LEFT = true; });
    leftBtn.addEventListener('touchend', (e) => { e.preventDefault(); keyboard.LEFT = false; });
    rightBtn.addEventListener('touchstart', (e) => { e.preventDefault(); keyboard.RIGHT = true; });
    rightBtn.addEventListener('touchend', (e) => { e.preventDefault(); keyboard.RIGHT = false; });
    jumpBtn.addEventListener('touchstart', (e) => { e.preventDefault(); keyboard.SPACE = true; });
    jumpBtn.addEventListener('touchend', (e) => { e.preventDefault(); keyboard.SPACE = false; });
    throwBtn.addEventListener('touchstart', (e) => { e.preventDefault(); keyboard.D = true; });
    throwBtn.addEventListener('touchend', (e) => { e.preventDefault(); keyboard.D = false; });
    [leftBtn, rightBtn, jumpBtn, throwBtn].forEach(btn => { btn.addEventListener('contextmenu', (e) => { e.preventDefault(); }); });
}

/**
 * Shows the start screen.
 * @returns {void}
 */
function showStartScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(startScreenImg, 0, 0, canvas.width, canvas.height);
    canvas.classList.add('start-screen');
    ctx.fillStyle = 'black';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctx.font = 'bold 36px "Stardos Stencil", Arial';
    ctx.textAlign = 'center';
    ctx.strokeText('Klicke zum Starten', canvas.width / 2, canvas.height - 390);
    ctx.fillText('Klicke zum Starten', canvas.width / 2, canvas.height - 390);
}

/**
 * Shows the game over screen.
 * @returns {void}
 */
function showGameOver() {
    gameState = 'gameOver';
    if (backgroundMusic) { backgroundMusic.pause(); backgroundMusic.currentTime = 0; }
    if (globalSoundManager && !isMuted) { globalSoundManager.playGameOver(); }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const imgWidth = canvas.width * 0.5;
    const imgHeight = canvas.height * 0.5;
    const x = (canvas.width - imgWidth) / 2;
    const y = (canvas.height - imgHeight) / 2;
    ctx.drawImage(gameOverImg, x, y, imgWidth, imgHeight);
    canvas.classList.add('game-over-screen');
    createRestartButton();
}

/**
 * Shows the win screen.
 * @returns {void}
 */
function showWin() {
    gameState = 'win';
    if (backgroundMusic) { backgroundMusic.pause(); backgroundMusic.currentTime = 0; }
    if (world && world.character && world.character.soundManager) { world.character.soundManager.stopSound('snoring'); world.character.soundManager.stopSound('walking'); }
    if (globalSoundManager && !isMuted) { globalSoundManager.playWin(); }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const imgWidth = canvas.width * 0.5;
    const imgHeight = canvas.height * 0.3;
    const x = (canvas.width - imgWidth) / 2;
    const y = (canvas.height - imgHeight) / 2;
    ctx.drawImage(winImg, x, y, imgWidth, imgHeight);
    canvas.classList.add('win-screen');
    createRestartButton();
}

/**
 * Creates a restart button.
 * @returns {void}
 */
function createRestartButton() {
    removeRestartButton();
    const canvasFrame = document.querySelector('.canvas-frame');
    const restartButton = document.createElement('button');
    restartButton.id = 'gameOverRestartButton';
    restartButton.className = 'game-over-restart-button';
    restartButton.innerHTML = '<img src="components/img_pollo_loco/img/icons8-reload-50.png" alt="Neues Spiel starten">';
    restartButton.onclick = restartGameDirectly;
    canvasFrame.appendChild(restartButton);
    const menuButton = document.createElement('button');
    menuButton.id = 'gameOverMenuButton';
    menuButton.className = 'game-over-menu-button';
    menuButton.innerHTML = '<img src="components/img_pollo_loco/img/icons8-menu-50.png" alt="Menü">';
    canvasFrame.appendChild(menuButton);
}

/**
 * Removes the restart button and menu button.
 * @returns {void}
 */
function removeRestartButton() {
    const existingRestartButton = document.getElementById('gameOverRestartButton');
    if (existingRestartButton) {
        existingRestartButton.remove();
    }
    const existingMenuButton = document.getElementById('gameOverMenuButton');
    if (existingMenuButton) {
        existingMenuButton.remove();
    }
}

/**
 * Handles canvas click events.
 * @returns {void}
 */
function handleCanvasClick() {
    if (gameState === 'start') {
        startGame();
    } else if (gameState === 'gameOver') {
        restartGame();
    } else if (gameState === 'win') {
        restartGame();
    }
}

/**
 * Starts the game.
 * @returns {void}
 */
function startGame() {
    gameState = 'playing';
    canvas.removeEventListener('click', handleCanvasClick);
    canvas.classList.remove('start-screen');
    if (backgroundMusic && !isMuted) {
        backgroundMusic.play().catch(e => {
            console.log('Autoplay wurde blockiert:', e);
        });
    }
    initLevel1();
    world = new World(canvas, keyboard);
    applyMuteSettings();
}

/**
 * Restarts the game.
 * @returns {void}
 */
function restartGame() {
    gameState = 'start';
    if (backgroundMusic) { backgroundMusic.pause(); backgroundMusic.currentTime = 0; }
    if (globalSoundManager) { globalSoundManager.stopSound('gameOver'); globalSoundManager.stopSound('win'); }
    if (world) { world = null; }
    canvas.removeEventListener('click', handleCanvasClick);
    canvas.classList.remove('game-over-screen');
    canvas.classList.remove('win-screen');
    removeRestartButton();
    canvas.addEventListener('click', handleCanvasClick);
    showStartScreen();
}

/**
 * Stops all game sounds and resets background music.
 * @returns {void}
 */
function stopAllSounds() {
    if (backgroundMusic) {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
    }
    if (globalSoundManager) {
        globalSoundManager.stopSound('gameOver');
        globalSoundManager.stopSound('win');
    }
}

/**
 * Cleans up the game state and UI elements.
 * @returns {void}
 */
function cleanupGameState() {
    world = null;
    canvas.classList.remove('game-over-screen', 'win-screen');
    removeRestartButton();
}

/**
 * Restarts the game directly without showing the start screen.
 * @returns {void}
 */
function restartGameDirectly() {
    stopAllSounds();
    cleanupGameState();
    startGame();
}

/**
 * Handles keyboard input.
 * @returns {void}
 */
window.addEventListener("keydown", (event) => {
    if (event.keyCode == 39) {
        keyboard.RIGHT = true;
    }
    if (event.keyCode == 37) {
        keyboard.LEFT = true;
    }
    if (event.keyCode == 32) {
        keyboard.SPACE = true;
    }
    if (event.keyCode == 68) {
        keyboard.D = true;
    }
});

/**
 * Handles keyboard input.
 * @returns {void}
 */
window.addEventListener("keyup", (event) => {
    if (event.keyCode == 39) {
        keyboard.RIGHT = false;
    }
    if (event.keyCode == 37) {
        keyboard.LEFT = false;
    }
    if (event.keyCode == 32) {
        keyboard.SPACE = false;
    }
    if (event.keyCode == 68) {
        keyboard.D = false;
    }
});

/**
 * Hides the overlay.
 * @returns {void}
 */
function hideOverlay() {
    const overlay = document.getElementById('gameOverlay');
    overlay.classList.add('hidden');
    setTimeout(() => { if (overlay && overlay.parentNode) { overlay.parentNode.removeChild(overlay); } }, 500);
}

/**
 * Flips a card.
 * @param {string} cardId - The ID of the card to flip.
 * @returns {void}
 */
function flipCard(cardId) {
    const card = document.getElementById(cardId);
    if (card) {
        card.classList.toggle('flipped');
    }
}

/**
 * Navigates to a specified URL.
 * @param {string} url - The URL to navigate to.
 * @param {Event} event - The event that triggered the navigation.
 * @returns {void}
 */
function navigateTo(url, event) {
    if (event) {
        event.stopPropagation();
        event.preventDefault();
    }
    window.location.href = url;
}

/**
 * Toggles fullscreen mode.
 * @returns {void}
 */
function toggleFullscreen() {
    const element = document.getElementById('fullscreen');
    const icon = document.getElementById('fullscreenIcon');

    if (!document.fullscreenElement) {
        element.requestFullscreen();
        icon.style.transform = 'rotate(180deg)';
        icon.title = 'Vollbild verlassen (ESC)';
    } else {
        document.exitFullscreen();
        icon.style.transform = 'rotate(0deg)';
        icon.title = 'Vollbild aktivieren';
    }
}

/**
 * Handles fullscreen change events.
 * @returns {void}
 */
document.addEventListener('fullscreenchange', () => {
    const icon = document.getElementById('fullscreenIcon');
    if (!document.fullscreenElement) {
        icon.style.transform = 'rotate(0deg)';
        icon.title = 'Vollbild aktivieren';
    }
});

/**
 * Loads the mute settings from local storage.
 * @returns {void}
 */
function loadMuteSettings() {
    const savedMuteState = localStorage.getItem('polloLoco_isMuted');
    if (savedMuteState !== null) {
        isMuted = JSON.parse(savedMuteState);
    }

    updateMuteIcon();
    applyMuteSettings();
}

/**
 * Saves the mute settings to local storage.
 * @returns {void}
 */
function saveMuteSettings() {
    localStorage.setItem('polloLoco_isMuted', JSON.stringify(isMuted));
}

/**
 * Applies the mute settings.
 * @returns {void}
 */
function applyMuteSettings() {
    if (backgroundMusic) {
        try { backgroundMusic.muted = isMuted; } catch (e) { }
    }

    if (world && world.character && world.character.soundManager) {
        try { if (isMuted) { world.character.soundManager.muteAll(); } else { world.character.soundManager.unmuteAll(); } } catch (e) { }
    }

    if (globalSoundManager) {
        try { if (isMuted) { globalSoundManager.muteAll(); } else { globalSoundManager.unmuteAll(); } } catch (e) { }
    }
}

/**
 * Updates the mute icon.
 * @returns {void}
 */
function updateMuteIcon() {
    const icon = document.getElementById('muteIcon');
    if (!icon) return;
    if (isMuted) {
        icon.src = 'components/img_pollo_loco/icons8-no-sound-50.png';
        icon.alt = 'Unmute';
        icon.title = 'Sound einschalten';
    } else {
        icon.src = 'components/img_pollo_loco/img/icons8-sound-50.png';
        icon.alt = 'Mute';
        icon.title = 'Sound ausschalten';
    }
}

/**
 * Toggles the mute state.
 * @returns {void}
 */
function toggleMute() {
    isMuted = !isMuted;
    saveMuteSettings();
    if (backgroundMusic) {
        try {backgroundMusic.muted = isMuted; if (!isMuted && gameState === 'playing') { backgroundMusic.play().catch(() => { }); } } catch (e) { }
    }
    if (world && world.character && world.character.soundManager) {
        try { if (isMuted) { world.character.soundManager.muteAll(); } else { world.character.soundManager.unmuteAll(); } } catch (e) { }
    }
    if (globalSoundManager) {
        try { if (isMuted) { globalSoundManager.muteAll(); } else { globalSoundManager.unmuteAll(); } } catch (e) { }
    }
    updateMuteIcon();
}

/**
 * Initializes the rotate device overlay.
 * @returns {void}
 */
function initRotateDeviceOverlay() {
    checkOrientation();
    window.addEventListener('orientationchange', () => {
        setTimeout(checkOrientation, 100);
    });
    window.addEventListener('resize', checkOrientation);
}

/**
 * Checks the device orientation and shows/hides the rotate overlay.
 * @returns {void}
 */
function checkOrientation() {
    const overlay = document.getElementById('rotateDeviceOverlay');
    const isPortrait = window.innerWidth < window.innerHeight;

    if (isPortrait) {
        overlay.style.display = 'flex';
    } else {
        overlay.style.display = 'none';
    }
}