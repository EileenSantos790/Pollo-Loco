let canvas; let world; let keyboard = new Keyboard(); let ctx; let gameState = 'start'; let startScreenImg; let gameOverImg; let winImg; let backgroundMusic; let globalSoundManager; let isMuted = false;
let assetsToLoad = 0;
let assetsLoaded = 0;

/**
 * Updates the loading progress bar and text.
 * @returns {void}
 */
function updateLoadingProgress() {
    const progress = assetsToLoad > 0 ? (assetsLoaded / assetsToLoad) * 100 : 0;
    updateLoadingProgressValue(progress);
    
    if (progress >= 100) {
        setTimeout(hideLoadingScreen, 500);
    }
}

/**
 * Hides the loading screen with a fade-out effect.
 * @returns {void}
 */
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
            loadingScreen.classList.remove('active');
            loadingScreen.classList.remove('fade-out');
            loadingScreen.style.display = 'none';
        }, 500);
    }
}

/**
 * Shows the loading screen.
 * @returns {void}
 */
function showLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    const loadingBar = document.getElementById('loadingBar');
    const loadingText = document.getElementById('loadingText');
    
    if (loadingScreen) {
        loadingScreen.classList.add('active');
        loadingScreen.style.display = 'flex';
    }
    if (loadingBar) {
        loadingBar.style.width = '0%';
    }
    if (loadingText) {
        loadingText.textContent = 'Laden... 0%';
    }
    
    // Reset counters
    assetsToLoad = 0;
    assetsLoaded = 0;
}

/**
 * Tracks loading of an image asset.
 * @param {HTMLImageElement} img - The image element to track
 * @returns {void}
 */
function trackImageLoad(img) {
    assetsToLoad++;
    img.onload = () => {
        assetsLoaded++;
        updateLoadingProgress();
    };
    img.onerror = () => {
        assetsLoaded++;
        updateLoadingProgress();
    };
}

/**
 * Tracks loading of an audio asset.
 * @param {HTMLAudioElement} audio - The audio element to track
 * @returns {void}
 */
function trackAudioLoad(audio) {
    assetsToLoad++;
    audio.addEventListener('canplaythrough', () => {
        assetsLoaded++;
        updateLoadingProgress();
    }, { once: true });
    audio.addEventListener('error', () => {
        assetsLoaded++;
        updateLoadingProgress();
    }, { once: true });
}

/**
 * Initializes the game.
 * @returns {void}
 */
function init() {
    canvas = document.getElementById("gameCanvas"); ctx = canvas.getContext("2d");
    
    startScreenImg = new Image();
    startScreenImg.src = 'components/img_pollo_loco/img/9_intro_outro_screens/start/startscreen_2.png';
    startScreenImg.onload = function () { 
        showStartScreen(); 
    };
    
    gameOverImg = new Image(); 
    gameOverImg.src = 'components/img_pollo_loco/img/You won, you lost/Game over A.png';
    
    winImg = new Image(); 
    winImg.src = 'components/img_pollo_loco/img/You won, you lost/You Won B.png';
    
    backgroundMusic = new Audio('components/audio/Run-Amok(chosic.com).mp3'); 
    backgroundMusic.loop = true; 
    backgroundMusic.volume = 0.5;
    
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
    menuButton.onclick = openMainMenuOverlay;
    canvasFrame.appendChild(menuButton);
}

/**
 * Removes the restart button and menu button.
 * @returns {void}
 */
function removeRestartButton() {
    const existingRestartButton = document.getElementById('gameOverRestartButton');
    if (existingRestartButton) { existingRestartButton.remove(); }
    const existingMenuButton = document.getElementById('gameOverMenuButton');
    if (existingMenuButton) { existingMenuButton.remove(); } 
}

/**
 * Handles canvas click events.
 * @returns {void}
 */
function handleCanvasClick() {
    if (gameState === 'start') { startGame(); } else if (gameState === 'gameOver') { restartGame(); } else if (gameState === 'win') { restartGame(); }
}

/**
 * Starts the game.
 * @returns {void}
 */
async function startGame() {
    showLoadingScreen();
    
    gameState = 'playing';
    canvas.removeEventListener('click', handleCanvasClick);
    canvas.classList.remove('start-screen');
    
    try {
        const musicPromise = new Promise((resolve) => {
            if (backgroundMusic && !isMuted) {
                backgroundMusic.addEventListener('canplaythrough', resolve, { once: true });
                backgroundMusic.play().catch(e => { 
                    console.log('Autoplay wurde blockiert:', e);
                    resolve(); // Resolve anyway to not block
                });
            } else {
                resolve();
            }
        });

        initLevel1();
        world = new World(canvas, keyboard);
        const assetPromises = [];
        if (world.character) {
            assetPromises.push(
                world.character.loadImages(world.character.IMAGES_WALKING),
                world.character.loadImages(world.character.IMAGES_IDLE),
                world.character.loadImages(world.character.IMAGES_LONG_IDLE),
                world.character.loadImages(world.character.IMAGES_JUMP),
                world.character.loadImages(world.character.IMAGES_DEAD),
                world.character.loadImages(world.character.IMAGES_HURT)
            );
        }
        
        if (world.level && world.level.enemies) {
            world.level.enemies.forEach(enemy => {
                if (enemy.IMAGES_WALKING) assetPromises.push(enemy.loadImages(enemy.IMAGES_WALKING));
                if (enemy.IMAGES_DEAD) assetPromises.push(enemy.loadImages(enemy.IMAGES_DEAD));
                if (enemy.IMAGES_ALERT) assetPromises.push(enemy.loadImages(enemy.IMAGES_ALERT));
                if (enemy.IMAGES_HURT) assetPromises.push(enemy.loadImages(enemy.IMAGES_HURT));
            });
        }
        
        if (world.level && world.level.backgroundObjects) {
            world.level.backgroundObjects.forEach(bg => {
                if (bg.img && bg.img.src) {
                    assetPromises.push(new Promise((resolve) => {
                        if (bg.img.complete) {
                            resolve();
                        } else {
                            bg.img.onload = resolve;
                            bg.img.onerror = resolve;
                        }
                    }));
                }
            });
        }
        
        const totalAssets = assetPromises.length + 1; // +1 for music
        let loadedAssets = 0;
        
        assetPromises.forEach(promise => {
            promise.then(() => {
                loadedAssets++;
                const progress = (loadedAssets / totalAssets) * 100;
                updateLoadingProgressValue(progress);
            });
        });
        
        await Promise.all([musicPromise, ...assetPromises]);
        applyMuteSettings();
        updateLoadingProgressValue(100);
        await new Promise(resolve => setTimeout(resolve, 300));
        hideLoadingScreen();
    } catch (error) {
        console.error('Error loading game assets:', error);
        hideLoadingScreen();
    }
}

/**
 * Updates loading progress with a specific value.
 * @param {number} progress - The progress percentage (0-100)
 * @returns {void}
 */
function updateLoadingProgressValue(progress) {
    const loadingBar = document.getElementById('loadingBar');
    const loadingText = document.getElementById('loadingText');
    
    if (loadingBar) {
        loadingBar.style.width = Math.min(progress, 100) + '%';
    }
    
    if (loadingText) {
        if (progress < 100) {
            loadingText.textContent = `Loading... ${Math.round(progress)}%`;
        } else {
            loadingText.textContent = 'Ready!';
        }
    }
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
    if (backgroundMusic) { backgroundMusic.pause(); backgroundMusic.currentTime = 0; }
    if (globalSoundManager) { globalSoundManager.stopSound('gameOver'); globalSoundManager.stopSound('win'); }
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
    if (event.keyCode == 39) { keyboard.RIGHT = true; }
    if (event.keyCode == 37) { keyboard.LEFT = true; }
    if (event.keyCode == 32) { keyboard.SPACE = true; }
    if (event.keyCode == 68) { keyboard.D = true; }
});

/**
 * Handles keyboard input.
 * @returns {void}
 */
window.addEventListener("keyup", (event) => {
    if (event.keyCode == 39) { keyboard.RIGHT = false; }
    if (event.keyCode == 37) { keyboard.LEFT = false; }
    if (event.keyCode == 32) { keyboard.SPACE = false; }
    if (event.keyCode == 68) { keyboard.D = false; }
});

/**
 * Hides the overlay.
 * @returns {void}
 */
function hideOverlay() {
    const overlay = document.getElementById('gameOverlay');
    if (!overlay) return;
    overlay.classList.add('hidden');
}

/**
 * Shows the main overlay menu again.
 * @returns {void}
 */
function showOverlay(endGame = false) {
    const overlay = document.getElementById('gameOverlay');
    if (!overlay) return;
    overlay.classList.remove('hidden');
    if (endGame) {
        document.getElementById('btnOverlay').onclick = () => {
            restartGame(); hideOverlay();
        }
    }
}

/**
 * Handler to open menu overlay from in-game buttons.
 * @returns {void}
 */
function openMainMenuOverlay() {
    stopAllSounds();
    showOverlay(true);
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
        try { backgroundMusic.muted = isMuted; } catch (e) {  console.log(e); } 
    }
    if (world && world.character && world.character.soundManager) { 
        try { if (isMuted) {  world.character.soundManager.muteAll(); } else { world.character.soundManager.unmuteAll(); } } catch (e) { console.log(e); }}
    if (world && world.soundManager) { 
        try { if (isMuted) {  world.soundManager.muteAll(); } else { world.soundManager.unmuteAll(); } } catch (e) { console.log(e); }
    }
    if (globalSoundManager) { 
        try { if (isMuted) { globalSoundManager.muteAll(); } else { globalSoundManager.unmuteAll(); } } catch (e) { console.log(e); }
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
    if (backgroundMusic) { try { backgroundMusic.muted = isMuted; if (!isMuted && gameState === 'playing') { backgroundMusic.play().catch((e) => {console.log(e); }); } } catch (e) {console.log(e); }}
    if (world && world.character && world.character.soundManager) { try { if (isMuted) {  world.character.soundManager.muteAll(); } else { world.character.soundManager.unmuteAll(); } } catch (e) { console.log(e); }}
    if (world && world.soundManager) {
        try { if (isMuted) {  world.soundManager.muteAll(); } else { world.soundManager.unmuteAll(); } } catch (e) { console.log(e); }
    }
    if (globalSoundManager) {
        try { 
            if (isMuted) { globalSoundManager.muteAll(); } else { globalSoundManager.unmuteAll(); } 
        } catch (e) { console.log(e); }
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
    if (isPortrait) { overlay.style.display = 'flex'; } else { overlay.style.display = 'none'; }
}