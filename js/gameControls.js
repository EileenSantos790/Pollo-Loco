/**
 * Initializes the mobile controls.
 * @returns {void}
 */
function initMobileControls() {
    const buttons = getMobileControlButtons();
    setupTouchEvents(buttons);
    preventContextMenu(buttons);
}

/**
 * Gets all mobile control button elements.
 * @returns {Object} Object containing button elements
 */
function getMobileControlButtons() {
    return {
        leftBtn: document.getElementById('leftBtn'),
        rightBtn: document.getElementById('rightBtn'),
        jumpBtn: document.getElementById('jumpBtn'),
        throwBtn: document.getElementById('throwBtn')
    };
}

/**
 * Sets up touch events for mobile control buttons.
 * @param {Object} buttons - Object containing button elements
 * @returns {void}
 */
function setupTouchEvents(buttons) {
    setupLeftButton(buttons.leftBtn);
    setupRightButton(buttons.rightBtn);
    setupJumpButton(buttons.jumpBtn);
    setupThrowButton(buttons.throwBtn);
}

/**
 * Sets up left button events.
 * @param {Element} leftBtn - Left button element
 * @returns {void}
 */
function setupLeftButton(leftBtn) {
    leftBtn.addEventListener('touchstart', (e) => { 
        e.preventDefault(); 
        keyboard.LEFT = true; 
    });
    leftBtn.addEventListener('touchend', (e) => { 
        e.preventDefault(); 
        keyboard.LEFT = false; 
    });
}

/**
 * Sets up right button events.
 * @param {Element} rightBtn - Right button element
 * @returns {void}
 */
function setupRightButton(rightBtn) {
    rightBtn.addEventListener('touchstart', (e) => { 
        e.preventDefault(); 
        keyboard.RIGHT = true; 
    });
    rightBtn.addEventListener('touchend', (e) => { 
        e.preventDefault(); 
        keyboard.RIGHT = false; 
    });
}

/**
 * Sets up jump button events.
 * @param {Element} jumpBtn - Jump button element
 * @returns {void}
 */
function setupJumpButton(jumpBtn) {
    jumpBtn.addEventListener('touchstart', (e) => { 
        e.preventDefault(); 
        keyboard.SPACE = true; 
    });
    jumpBtn.addEventListener('touchend', (e) => { 
        e.preventDefault(); 
        keyboard.SPACE = false; 
    });
}

/**
 * Sets up throw button events.
 * @param {Element} throwBtn - Throw button element
 * @returns {void}
 */
function setupThrowButton(throwBtn) {
    throwBtn.addEventListener('touchstart', (e) => { 
        e.preventDefault(); 
        keyboard.D = true; 
    });
    throwBtn.addEventListener('touchend', (e) => { 
        e.preventDefault(); 
        keyboard.D = false; 
    });
}

/**
 * Prevents context menu on mobile controls.
 * @param {Object} buttons - Button elements object
 * @returns {void}
 */
function preventContextMenu(buttons) {
    const { leftBtn, rightBtn, jumpBtn, throwBtn } = buttons;
    [leftBtn, rightBtn, jumpBtn, throwBtn].forEach(btn => {
        btn.addEventListener('contextmenu', (e) => { 
            e.preventDefault(); 
        });
    });
}

/**
 * Handles keyboard input down events.
 * @returns {void}
 */
window.addEventListener("keydown", (event) => {
    if (event.keyCode == 39) { keyboard.RIGHT = true; }
    if (event.keyCode == 37) { keyboard.LEFT = true; }
    if (event.keyCode == 32) { keyboard.SPACE = true; }
    if (event.keyCode == 68) { keyboard.D = true; }
});

/**
 * Handles keyboard input up events.
 * @returns {void}
 */
window.addEventListener("keyup", (event) => {
    if (event.keyCode == 39) { keyboard.RIGHT = false; }
    if (event.keyCode == 37) { keyboard.LEFT = false; }
    if (event.keyCode == 32) { keyboard.SPACE = false; }
    if (event.keyCode == 68) { keyboard.D = false; }
});