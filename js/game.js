// Global game variables
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
    canvas = document.getElementById("gameCanvas"); 
    ctx = canvas.getContext("2d");
    
    loadGameAssets();
    setupGameEvents();
    loadMuteSettings(); 
}

/**
 * Loads all game assets.
 * @returns {void}
 */
function loadGameAssets() {
    startScreenImg = new Image();
    startScreenImg.src = 'components/img_pollo_loco/img/9_intro_outro_screens/start/startscreen_2.png';
    startScreenImg.onload = () => showStartScreen();
    gameOverImg = new Image(); 
    gameOverImg.src = 'components/img_pollo_loco/img/You won, you lost/Game over A.png';
    winImg = new Image(); 
    winImg.src = 'components/img_pollo_loco/img/You won, you lost/You Won B.png';
    backgroundMusic = new Audio('components/audio/Run-Amok(chosic.com).mp3'); 
    backgroundMusic.loop = true; 
    backgroundMusic.volume = 0.5;
    globalSoundManager = new SoundManager();
}

/**
 * Sets up game event listeners.
 * @returns {void}
 */
function setupGameEvents() {
    canvas.addEventListener('click', handleCanvasClick); 
    initMobileControls(); 
    initRotateDeviceOverlay();
}

/**
 * Handles canvas click events.
 * @returns {void}
 */
function handleCanvasClick() {
    if (gameState === 'start') { 
        startGame(); 
    } else if (gameState === 'gameOver' || gameState === 'win') { 
        restartGame(); 
    }
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
        await initializeWorld();
        applyMuteSettings();
        hideLoadingScreen();
    } catch (error) {
        console.error('Error loading game assets:', error);
        hideLoadingScreen();
    }
}

/**
 * Initializes the game world and loads assets.
 * @returns {Promise}
 */
async function initializeWorld() {
    const musicPromise = setupBackgroundMusic();
    initLevel1();
    world = new World(canvas, keyboard);
    
    const assetPromises = loadWorldAssets();
    await Promise.race([
        Promise.all([musicPromise, ...assetPromises]),
        new Promise(resolve => setTimeout(resolve, 5000))
    ]);
}

/**
 * Sets up background music playback.
 * @returns {Promise}
 */
function setupBackgroundMusic() {
    return new Promise((resolve) => {
        const timeout = setTimeout(() => resolve(), 2000);
        
        if (backgroundMusic && !isMuted) {
            handleMusicReady(resolve, timeout);
        } else {
            clearTimeout(timeout);
            resolve();
        }
    });
}

/**
 * Handles music ready state and playback.
 * @returns {void}
 */
function handleMusicReady(resolve, timeout) {
    if (backgroundMusic.readyState >= 3) {
        clearTimeout(timeout);
        resolve();
    } else {
        backgroundMusic.addEventListener('canplaythrough', () => {
            clearTimeout(timeout);
            resolve();
        }, { once: true });
    }
    
    startMusicPlayback(resolve, timeout);
}

/**
 * Starts music playback with error handling.
 * @returns {void}
 */
function startMusicPlayback(resolve, timeout) {
    backgroundMusic.play().catch(e => { 
        console.log('Autoplay blocked:', e);
        clearTimeout(timeout);
        resolve();
    });
}

/**
 * Loads all world assets.
 * @returns {Array} Array of asset loading promises
 */
function loadWorldAssets() {
    const assetPromises = [];
    
    loadCharacterAssets(assetPromises);
    loadEnemyAssets(assetPromises);
    loadBackgroundAssets(assetPromises);
    
    return assetPromises;
}

/**
 * Loads character image assets.
 * @param {Array} assetPromises - Array to add promises to
 * @returns {void}
 */
function loadCharacterAssets(assetPromises) {
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
}

/**
 * Loads enemy assets.
 * @param {Array} assetPromises - Array to add promises to
 * @returns {void}
 */
function loadEnemyAssets(assetPromises) {
    if (world.level && world.level.enemies) {
        world.level.enemies.forEach(enemy => {
            if (enemy.IMAGES_WALKING) assetPromises.push(enemy.loadImages(enemy.IMAGES_WALKING));
            if (enemy.IMAGES_DEAD) assetPromises.push(enemy.loadImages(enemy.IMAGES_DEAD));
            if (enemy.IMAGES_ALERT) assetPromises.push(enemy.loadImages(enemy.IMAGES_ALERT));
            if (enemy.IMAGES_HURT) assetPromises.push(enemy.loadImages(enemy.IMAGES_HURT));
        });
    }
}

/**
 * Loads background assets.
 * @param {Array} assetPromises - Array to add promises to  
 * @returns {void}
 */
function loadBackgroundAssets(assetPromises) {
    if (world.level && world.level.backgroundObjects) {
        world.level.backgroundObjects.forEach(bg => {
            if (bg.img && bg.img.src) {
                assetPromises.push(createImageLoadPromise(bg.img));
            }
        });
    }
}

/**
 * Creates a promise for image loading.
 * @param {HTMLImageElement} img - Image element to load
 * @returns {Promise}
 */
function createImageLoadPromise(img) {
    return new Promise((resolve) => {
        if (img.complete) {
            resolve();
        } else {
            img.onload = resolve;
            img.onerror = resolve;
        }
    });
}

/**
 * Restarts the game.
 * @returns {void}
 */
function restartGame() {
    gameState = 'start';
    stopAllSounds();
    cleanupGameState();
    canvas.addEventListener('click', handleCanvasClick);
    showStartScreen();
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
 * Cleans up the game state and UI elements.
 * @returns {void}
 */
function cleanupGameState() {
    world = null;
    canvas.classList.remove('game-over-screen', 'win-screen');
    removeRestartButton();
    canvas.removeEventListener('click', handleCanvasClick);
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