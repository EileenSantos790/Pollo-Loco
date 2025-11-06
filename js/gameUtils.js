/**
 * Prevents default touch behavior on canvas.
 * @param {HTMLElement} canvas - The canvas element.
 * @returns {void}
 */
function preventDefaultTouch(canvas) {
    canvas.addEventListener('touchstart', (e) => e.preventDefault());
    canvas.addEventListener('touchend', (e) => e.preventDefault());
    canvas.addEventListener('touchmove', (e) => e.preventDefault());
}

/**
 * Checks if the device is mobile.
 * @returns {boolean} True if mobile device.
 */
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
        || (window.orientation !== undefined && 'ontouchstart' in window);
}

/**
 * Checks if screen width requires mobile controls.
 * @returns {boolean} True if mobile controls needed.
 */
function shouldShowMobileControls() {
    return isMobile() && window.innerWidth < 1024;
}

/**
 * Shows or hides mobile controls based on device type.
 * @returns {void}
 */
function updateMobileControlsVisibility() {
    const mobileControls = document.getElementById('mobileControls');
    if (!mobileControls) return;
    
    if (shouldShowMobileControls()) {
        mobileControls.style.display = 'flex';
    } else {
        mobileControls.style.display = 'none';
    }
}

/**
 * Sets up fullscreen functionality.
 * @returns {void}
 */
function setupFullscreen() {
    const canvas = document.getElementById('canvas');
    const gameContainer = canvas.closest('.game-container');
    
    if (gameContainer) {
        gameContainer.addEventListener('click', enterFullscreen);
    }
}

/**
 * Enters fullscreen mode.
 * @returns {void}
 */
function enterFullscreen() {
    const canvas = document.getElementById('canvas');
    if (canvas.requestFullscreen) {
        canvas.requestFullscreen();
    } else if (canvas.webkitRequestFullscreen) {
        canvas.webkitRequestFullscreen();
    } else if (canvas.msRequestFullscreen) {
        canvas.msRequestFullscreen();
    }
}

/**
 * Exits fullscreen mode.
 * @returns {void}
 */
function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

/**
 * Handles window resize events.
 * @returns {void}
 */
function handleResize() {
    updateMobileControlsVisibility();
    const canvas = document.getElementById('canvas');
    if (canvas && world) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        world.camera_x = 0;
    }
}

/**
 * Gets element by ID with error handling.
 * @param {string} id - Element ID.
 * @returns {HTMLElement|null} Element or null.
 */
function getElement(id) {
    const element = document.getElementById(id);
    if (!element) {
        console.warn(`Element with ID '${id}' not found`);
    }
    return element;
}

/**
 * Shows an element by ID.
 * @param {string} id - Element ID.
 * @returns {void}
 */
function showElement(id) {
    const element = getElement(id);
    if (element) {
        element.style.display = 'block';
    }
}

/**
 * Hides an element by ID.
 * @param {string} id - Element ID.
 * @returns {void}
 */
function hideElement(id) {
    const element = getElement(id);
    if (element) {
        element.style.display = 'none';
    }
}

/**
 * Toggles element visibility.
 * @param {string} id - Element ID.
 * @returns {void}
 */
function toggleElement(id) {
    const element = getElement(id);
    if (!element) return;
    
    if (element.style.display === 'none' || element.style.display === '') {
        element.style.display = 'block';
    } else {
        element.style.display = 'none';
    }
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
    if (!overlay) return;
    
    const isPortrait = window.innerWidth < window.innerHeight;
    if (isPortrait) { 
        overlay.style.display = 'flex'; 
    } else { 
        overlay.style.display = 'none'; 
    }
}

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
        const btnOverlay = document.getElementById('btnOverlay');
        if (btnOverlay) {
            btnOverlay.onclick = () => {
                restartGame(); 
                hideOverlay();
            }
        }
    }
}