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
    setupLoadingElements();
    resetLoadingProgress();
}

/**
 * Sets up loading screen elements.
 * @returns {void}
 */
function setupLoadingElements() {
    showLoadingScreenElement();
    resetLoadingBarAndText();
}

/**
 * Shows the loading screen element.
 * @returns {void}
 */
function showLoadingScreenElement() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.classList.add('active');
        loadingScreen.style.display = 'flex';
    }
}

/**
 * Resets loading bar and text.
 * @returns {void}
 */
function resetLoadingBarAndText() {
    const loadingBar = document.getElementById('loadingBar');
    const loadingText = document.getElementById('loadingText');
    
    if (loadingBar) {
        loadingBar.style.width = '0%';
    }
    if (loadingText) {
        loadingText.textContent = 'Loading... 0%';
    }
}

// Global variables for asset tracking
let assetsToLoad = 0;
let assetsLoaded = 0;

/**
 * Resets loading progress counters.
 * @returns {void}
 */
function resetLoadingProgress() {
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
 * Updates loading progress with a specific value.
 * @param {number} progress - The progress percentage (0-100)
 * @returns {void}
 */
function updateLoadingProgressValue(progress) {
    updateLoadingBar(progress);
    updateLoadingText(progress);
}

/**
 * Updates the loading bar width.
 * @param {number} progress - The progress percentage
 * @returns {void}
 */
function updateLoadingBar(progress) {
    const loadingBar = document.getElementById('loadingBar');
    if (loadingBar) {
        loadingBar.style.width = Math.min(progress, 100) + '%';
    }
}

/**
 * Updates the loading text.
 * @param {number} progress - The progress percentage
 * @returns {void}
 */
function updateLoadingText(progress) {
    const loadingText = document.getElementById('loadingText');
    if (loadingText) {
        if (progress < 100) {
            loadingText.textContent = `Loading... ${Math.round(progress)}%`;
        } else {
            loadingText.textContent = 'Ready!';
        }
    }
}