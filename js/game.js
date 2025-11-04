let canvas;
let world;
let keyboard = new Keyboard();
let ctx;
let gameState = 'start';
let startScreenImg;
let backgroundMusic;
let isMuted = false; // global mute state for backgroundMusic and SoundManager

function init() {
    canvas = document.getElementById("gameCanvas");
    ctx = canvas.getContext("2d");
    
    startScreenImg = new Image();
    startScreenImg.src = 'components/img_pollo_loco/img/9_intro_outro_screens/start/startscreen_2.png';
    startScreenImg.onload = function() {
        showStartScreen();
    };
    
    backgroundMusic = new Audio('components/audio/Run-Amok(chosic.com).mp3');
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.5;
    
    canvas.addEventListener('click', handleCanvasClick);
    initMobileControls();
    initRotateDeviceOverlay();
}

function initMobileControls() {
    const leftBtn = document.getElementById('leftBtn');
    const rightBtn = document.getElementById('rightBtn');
    const jumpBtn = document.getElementById('jumpBtn');
    const throwBtn = document.getElementById('throwBtn');

    leftBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard.LEFT = true;
    });
    leftBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        keyboard.LEFT = false;
    });

    rightBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard.RIGHT = true;
    });
    rightBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        keyboard.RIGHT = false;
    });

    jumpBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard.SPACE = true;
        keyboard.UP = true;
    });
    jumpBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        keyboard.SPACE = false;
        keyboard.UP = false;
    });

    throwBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard.D = true;
    });
    throwBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        keyboard.D = false;
    });

    [leftBtn, rightBtn, jumpBtn, throwBtn].forEach(btn => {
        btn.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    });
}

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

function handleCanvasClick() {
    if (gameState === 'start') {
        startGame();
    }
}

function startGame() {
    gameState = 'playing';
    canvas.removeEventListener('click', handleCanvasClick);
    canvas.classList.remove('start-screen');
    
    if (backgroundMusic) {
        backgroundMusic.play().catch(e => {
            console.log('Autoplay wurde blockiert:', e);
        });
    }
    
    initLevel1();
    world = new World(canvas, keyboard);
    
    document.getElementById('restartButton').style.display = 'block';
}

function restartGame() {
    gameState = 'start';
    
    if (backgroundMusic) {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
    }
    
    if (world) {
        world = null;
    }
    canvas.addEventListener('click', handleCanvasClick);
    showStartScreen();
    
    document.getElementById('restartButton').style.display = 'none';
}

window.addEventListener("keydown", (event) => {
    if (event.keyCode == 39) {
        keyboard.RIGHT = true;
    }

    if (event.keyCode == 37) {
        keyboard.LEFT = true;
    }

    if (event.keyCode == 38) {
        keyboard.UP = true;
    }

    if (event.keyCode == 32) {
        keyboard.SPACE = true;
    }

    if (event.keyCode == 68) {
        keyboard.D = true;
    }
});

window.addEventListener("keyup", (event) => {

if (event.keyCode == 39) {
        keyboard.RIGHT = false;
    }

    if (event.keyCode == 37) {
        keyboard.LEFT = false;
    }

    if (event.keyCode == 38) {
        keyboard.UP = false;
    }

    if (event.keyCode == 32) {
        keyboard.SPACE = false;
    }

    if (event.keyCode == 68) {
        keyboard.D = false;
    }
});

function hideOverlay() {
    const overlay = document.getElementById('gameOverlay');
    overlay.classList.add('hidden');
    
    setTimeout(() => {
        if (overlay && overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
        }
    }, 500);
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

function toggleMute() {
    isMuted = !isMuted;

    if (backgroundMusic) {
        try {
            backgroundMusic.muted = isMuted;
            if (!isMuted && gameState === 'playing') {
                backgroundMusic.play().catch(() => {});
            }
        } catch (e) {}
    }

    if (world && world.character && world.character.soundManager) {
        try {
            if (isMuted) {
                world.character.soundManager.muteAll();
            } else {
                world.character.soundManager.unmuteAll();
            }
        } catch (e) {}
    }

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

function initRotateDeviceOverlay() {
    checkOrientation();
    window.addEventListener('orientationchange', () => {
        setTimeout(checkOrientation, 100);
    });
    window.addEventListener('resize', checkOrientation);
}

function checkOrientation() {
    const overlay = document.getElementById('rotateDeviceOverlay');
    const isMobile = window.innerWidth <= 771;
    const isPortrait = window.innerHeight > window.innerWidth;
    
    if (isMobile && isPortrait) {
        overlay.style.display = 'flex';
    } else {
        overlay.style.display = 'none';
    }
}