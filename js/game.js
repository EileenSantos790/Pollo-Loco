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

async function init() {
    canvas = document.getElementById("gameCanvas"); 
    ctx = canvas.getContext("2d");
    
    setupGameEvents();
    loadMuteSettings();
    await loadGameAssets();
}

async function loadGameAssets() {
    try {
        startScreenImg = await loadImageWithCache('components/img_pollo_loco/img/9_intro_outro_screens/start/startscreen_2.png');
        gameOverImg = await loadImageWithCache('components/img_pollo_loco/img/You won, you lost/Game over A.png');
        winImg = await loadImageWithCache('components/img_pollo_loco/img/You won, you lost/You Won B.png');
        backgroundMusic = await loadAudioWithCache('components/audio/Run-Amok(chosic.com).mp3');
        backgroundMusic.loop = true;
        backgroundMusic.volume = 0.5;
        globalSoundManager = new SoundManager();
        showStartScreen();
    } catch (error) {
        console.error('Error loading initial assets:', error);
        showStartScreen();
    }
}

function setupGameEvents() {
    canvas.addEventListener('click', handleCanvasClick); 
    initMobileControls(); 
    initRotateDeviceOverlay();
}

function handleCanvasClick() {
    if (gameState === 'start') { 
        startGame(); 
    } else if (gameState === 'gameOver' || gameState === 'win') { 
        restartGame(); 
    }
}

async function startGame() {
    showLoadingScreen();
    gameState = 'playing';
    canvas.removeEventListener('click', handleCanvasClick);
    canvas.classList.remove('start-screen'); 
    try {
        await initializeWorldWithProgress();
        applyMuteSettings();
    } catch (error) {
        console.error('Error loading game assets:', error);
        hideLoadingScreen();
    }
}

async function initializeWorldWithProgress() {
    resetLoadingProgress();
    const musicPromise = setupBackgroundMusic();
    initLevel1();
    world = new World(canvas, keyboard);
    const assetPromises = await loadWorldAssetsWithTracking();
    await Promise.race([
        Promise.all([musicPromise, ...assetPromises]),
        new Promise(resolve => setTimeout(resolve, 8000))
    ]);
}

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

function startMusicPlayback(resolve, timeout) {
    backgroundMusic.play().catch(e => { 
        console.log('Autoplay blocked:', e);
        clearTimeout(timeout);
        resolve();
    });
}

async function loadWorldAssetsWithTracking() {
    const assetPromises = [];
    if (world.character) { loadingManager.addAsset(); loadingManager.addAsset(); loadingManager.addAsset(); loadingManager.addAsset(); loadingManager.addAsset(); loadingManager.addAsset(); }
    countEnemyAssets();
    countBackgroundAssets();
    loadCharacterAssetsWithTracking(assetPromises);
    loadEnemyAssetsWithTracking(assetPromises);
    loadBackgroundAssetsWithTracking(assetPromises);
    return assetPromises;
}

function countEnemyAssets() {
    if (world.level && world.level.enemies) {
        world.level.enemies.forEach(enemy => {
            if (enemy.IMAGES_WALKING) loadingManager.addAsset();
            if (enemy.IMAGES_DEAD) loadingManager.addAsset();
            if (enemy.IMAGES_ALERT) loadingManager.addAsset();
            if (enemy.IMAGES_HURT) loadingManager.addAsset();
        });
    }
}

function countBackgroundAssets() {
    if (world.level && world.level.backgroundObjects) {
        world.level.backgroundObjects.forEach(bg => {
            if (bg.img && bg.img.src) {
                loadingManager.addAsset();
            }
        });
    }
}

function loadCharacterAssetsWithTracking(assetPromises) {
    if (world.character) {
        const trackLoadImages = (images) => {
            return world.character.loadImages(images).then(() => {
                loadingManager.assetLoaded();
            });
        };
        assetPromises.push(
            trackLoadImages(world.character.IMAGES_WALKING),
            trackLoadImages(world.character.IMAGES_IDLE),
            trackLoadImages(world.character.IMAGES_LONG_IDLE),
            trackLoadImages(world.character.IMAGES_JUMP),
            trackLoadImages(world.character.IMAGES_DEAD),
            trackLoadImages(world.character.IMAGES_HURT)
        );
    }
}

function loadEnemyAssetsWithTracking(assetPromises) {
    if (world.level && world.level.enemies) {
        world.level.enemies.forEach(enemy => {
            const trackEnemyLoad = (images) => {
                return enemy.loadImages(images).then(() => {
                    loadingManager.assetLoaded();
                });
            };     
            if (enemy.IMAGES_WALKING) assetPromises.push(trackEnemyLoad(enemy.IMAGES_WALKING));
            if (enemy.IMAGES_DEAD) assetPromises.push(trackEnemyLoad(enemy.IMAGES_DEAD));
            if (enemy.IMAGES_ALERT) assetPromises.push(trackEnemyLoad(enemy.IMAGES_ALERT));
            if (enemy.IMAGES_HURT) assetPromises.push(trackEnemyLoad(enemy.IMAGES_HURT));
        });
    }
}

function loadBackgroundAssetsWithTracking(assetPromises) {
    if (world.level && world.level.backgroundObjects) {
        world.level.backgroundObjects.forEach(bg => {
            if (bg.img && bg.img.src) {
                const trackBgLoad = createImageLoadPromise(bg.img).then(() => {
                    loadingManager.assetLoaded();
                });
                assetPromises.push(trackBgLoad);
            }
        });
    }
}

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

function restartGame() {
    gameState = 'start';
    stopAllSounds();
    cleanupGameState();
    canvas.addEventListener('click', handleCanvasClick);
    showStartScreen();
}

function restartGameDirectly() {
    stopAllSounds();
    cleanupGameState();
    startGame();
}

function cleanupGameState() {
    world = null;
    canvas.classList.remove('game-over-screen', 'win-screen');
    removeRestartButton();
    canvas.removeEventListener('click', handleCanvasClick);
}

function openMainMenuOverlay() {
    stopAllSounds();
    showOverlay(true);
}

function flipCard(cardId) {
    const card = document.getElementById(cardId);
    if (card) {
        card.classList.toggle('flipped');
    }
}

function navigateTo(url, event) {
    if (event) {
        event.stopPropagation();
        event.preventDefault();
    }
    window.location.href = url;
}

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

document.addEventListener('fullscreenchange', () => {
    const icon = document.getElementById('fullscreenIcon');
    if (!document.fullscreenElement) {
        icon.style.transform = 'rotate(0deg)';
        icon.title = 'Vollbild aktivieren';
    }
});