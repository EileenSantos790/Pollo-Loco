let canvas;
let world;
let keyboard = new Keyboard();
let ctx;
let gameState = 'start'; // 'start', 'playing', 'gameOver'
let startScreenImg;

function init() {
    canvas = document.getElementById("gameCanvas");
    ctx = canvas.getContext("2d");
    
    // Load start screen image
    startScreenImg = new Image();
    startScreenImg.src = 'components/img_pollo_loco/img/9_intro_outro_screens/start/startscreen_2.png';
    startScreenImg.onload = function() {
        showStartScreen();
    };
    
    // Add click listener to canvas for starting the game
    canvas.addEventListener('click', handleCanvasClick);
}

function showStartScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(startScreenImg, 0, 0, canvas.width, canvas.height);
    
    // Add pointer cursor
    canvas.classList.add('start-screen');
    
    // Add "Click to start" text with better styling
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctx.font = 'bold 28px "Stardos Stencil", Arial';
    ctx.textAlign = 'center';
    
    // Draw text with outline for better visibility
    ctx.strokeText('Klicke zum Starten', canvas.width / 2, canvas.height - 50);
    ctx.fillText('Klicke zum Starten', canvas.width / 2, canvas.height - 50);
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
    world = new World(canvas, keyboard);
    
    // Show restart button
    document.getElementById('restartButton').style.display = 'block';
}

function restartGame() {
    gameState = 'start';
    if (world) {
        world = null;
    }
    canvas.addEventListener('click', handleCanvasClick);
    showStartScreen();
    
    // Hide restart button
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

    if (event.keyCode == 40) {
        keyboard.DOWN = true;
    }

    if (event.keyCode == 32) {
        keyboard.SPACE = true;
    }

    if (event.keyCode == 70) {
        keyboard.F = true;
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

    if (event.keyCode == 40) {
        keyboard.DOWN = false;
    }

    if (event.keyCode == 32) {
        keyboard.SPACE = false;
    }

    if (event.keyCode == 70) {
        keyboard.F = false;
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