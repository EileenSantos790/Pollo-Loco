/**
 * Shows the start screen.
 * @returns {void}
 */
function showStartScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(startScreenImg, 0, 0, canvas.width, canvas.height);
    canvas.classList.add('start-screen');
    setupStartScreenText();
}

/**
 * Sets up the text for the start screen.
 * @returns {void}
 */
function setupStartScreenText() {
    ctx.fillStyle = 'black';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctx.font = 'bold 36px "Stardos Stencil", Arial';
    ctx.textAlign = 'center';
    const textY = canvas.height - 390;
    ctx.strokeText('Klicke zum Starten', canvas.width / 2, textY);
    ctx.fillText('Klicke zum Starten', canvas.width / 2, textY);
}

/**
 * Shows the game over screen.
 * @returns {void}
 */
function showGameOver() {
    gameState = 'gameOver';
    stopBackgroundMusic();
    if (globalSoundManager && !isMuted) { 
        globalSoundManager.playGameOver(); 
    }
    drawGameOverScreen();
    createRestartButton();
}

/**
 * Draws the game over screen image.
 * @returns {void}
 */
function drawGameOverScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const imgWidth = canvas.width * 0.5;
    const imgHeight = canvas.height * 0.5;
    const x = (canvas.width - imgWidth) / 2;
    const y = (canvas.height - imgHeight) / 2;
    ctx.drawImage(gameOverImg, x, y, imgWidth, imgHeight);
    canvas.classList.add('game-over-screen');
}

/**
 * Shows the win screen.
 * @returns {void}
 */
function showWin() {
    gameState = 'win';
    stopBackgroundMusic();
    stopCharacterSounds();
    if (globalSoundManager && !isMuted) { 
        globalSoundManager.playWin(); 
    }
    drawWinScreen();
    createRestartButton();
}

/**
 * Draws the win screen image.
 * @returns {void}
 */
function drawWinScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const imgWidth = canvas.width * 0.5;
    const imgHeight = canvas.height * 0.3;
    const x = (canvas.width - imgWidth) / 2;
    const y = (canvas.height - imgHeight) / 2;
    ctx.drawImage(winImg, x, y, imgWidth, imgHeight);
    canvas.classList.add('win-screen');
}

/**
 * Stops character sounds when needed.
 * @returns {void}
 */
function stopCharacterSounds() {
    if (world && world.character && world.character.soundManager) { 
        world.character.soundManager.stopSound('snoring'); 
        world.character.soundManager.stopSound('walking'); 
    }
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
    createMenuButton(canvasFrame);
}

/**
 * Creates the menu button.
 * @returns {void}
 */
function createMenuButton(canvasFrame) {
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
    if (existingRestartButton) { 
        existingRestartButton.remove(); 
    }
    const existingMenuButton = document.getElementById('gameOverMenuButton');
    if (existingMenuButton) { 
        existingMenuButton.remove(); 
    } 
}