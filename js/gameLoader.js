let assetsToLoad = 0;
let assetsLoaded = 0;
let loadingManager = null;
const imageCache = new Map();
const audioCache = new Map();

function updateLoadingProgress() {
    const progress = assetsToLoad > 0 ? (assetsLoaded / assetsToLoad) * 100 : 0;
    updateLoadingProgressValue(progress);
    if (progress >= 100) {
        setTimeout(hideLoadingScreen, 300);
    }
}

async function preloadCriticalAssets() {
    const assets = getCriticalAssets();
    const promises = assets.map(src => loadAssetByType(src));
    try {
        await Promise.all(promises);
    } catch (error) {
        console.warn('Preload failed:', error);
    }
}

function getCriticalAssets() {
    return [
        'components/img_pollo_loco/img/9_intro_outro_screens/start/startscreen_2.png',
        'components/img_pollo_loco/img/2_character_pepe/1_idle/idle/I-1.png',
        'components/img_pollo_loco/img/2_character_pepe/2_walk/W-21.png',
        'components/audio/Run-Amok(chosic.com).mp3'
    ];
}

function loadAssetByType(src) {
    if (src.endsWith('.mp3') || src.endsWith('.wav')) {
        return loadAudioWithCache(src);
    }
    return loadImageWithCache(src);
}

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

function showLoadingScreen() {
    setupLoadingElements();
    resetLoadingProgress();
}

function setupLoadingElements() {
    showLoadingScreenElement();
    resetLoadingBarAndText();
}

function showLoadingScreenElement() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.classList.add('active');
        loadingScreen.style.display = 'flex';
    }
}

function resetLoadingBarAndText() {
    const loadingBar = document.getElementById('loadingBar');
    const loadingText = document.getElementById('loadingText');
    if (loadingBar) loadingBar.style.width = '0%';
    if (loadingText) loadingText.textContent = 'Loading... 0%';
}

function createLoadingManager() {
    return {
        totalAssets: 0, loadedAssets: 0,
        startLoading() { this.totalAssets = 0; this.loadedAssets = 0; updateLoadingProgressValue(0); },
        addAsset() { this.totalAssets++; },
        assetLoaded() {
            this.loadedAssets++;
            const progress = (this.loadedAssets / this.totalAssets) * 100;
            updateLoadingProgressValue(progress);
            if (progress >= 100) setTimeout(hideLoadingScreen, 500);
        }
    };
}

function resetLoadingProgress() {
    loadingManager = createLoadingManager();
    loadingManager.startLoading();
    assetsToLoad = 0;
    assetsLoaded = 0;
}

function saveAssetMetadata(src) {
    try {
        const metadata = { url: src, cached: Date.now(), size: 0 };
        localStorage.setItem(`polloLoco_asset_${btoa(src)}`, JSON.stringify(metadata));
    } catch (e) {
        console.warn('Could not save asset metadata:', e);
    }
}

function getAssetMetadata(src) {
    try {
        const data = localStorage.getItem(`polloLoco_asset_${btoa(src)}`);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        return null;
    }
}

function loadImageWithCache(src) {
    return new Promise((resolve, reject) => {
        if (imageCache.has(src)) {
            const cachedImg = imageCache.get(src);
            if (cachedImg.complete) { if (loadingManager) loadingManager.assetLoaded(); resolve(cachedImg); return; }
        }
        const img = new Image(); if (loadingManager) loadingManager.addAsset();
        img.onload = () => { imageCache.set(src, img); saveAssetMetadata(src); if (loadingManager) loadingManager.assetLoaded(); resolve(img); };
        img.onerror = () => { if (loadingManager) loadingManager.assetLoaded(); reject(new Error(`Failed to load ${src}`)); };
        img.src = src;
    });
}

function trackImageLoad(img) {
    if (!loadingManager) return;
    loadingManager.addAsset();
    const handleLoad = () => {
        loadingManager.assetLoaded();
        img.removeEventListener('load', handleLoad);
        img.removeEventListener('error', handleLoad);
    };
    if (img.complete) handleLoad();
    else { img.addEventListener('load', handleLoad); img.addEventListener('error', handleLoad); }
}

function loadAudioWithCache(src) {
    return new Promise((resolve, reject) => {
        if (audioCache.has(src)) {
            const cachedAudio = audioCache.get(src);
            if (cachedAudio.readyState >= 3) { if (loadingManager) loadingManager.assetLoaded(); resolve(cachedAudio); return; }
        }
        const audio = new Audio(); if (loadingManager) loadingManager.addAsset();
        const handleLoad = () => { audioCache.set(src, audio); if (loadingManager) loadingManager.assetLoaded(); resolve(audio); };
        const handleError = () => { if (loadingManager) loadingManager.assetLoaded(); reject(new Error(`Failed to load ${src}`)); };
        audio.addEventListener('canplaythrough', handleLoad, { once: true }); audio.addEventListener('error', handleError, { once: true }); audio.src = src;
    });
}

function trackAudioLoad(audio) {
    if (!loadingManager) return;
    loadingManager.addAsset();
    const handleLoad = () => {
        loadingManager.assetLoaded();
        audio.removeEventListener('canplaythrough', handleLoad);
        audio.removeEventListener('error', handleLoad);
    };
    if (audio.readyState >= 3) handleLoad();
    else { audio.addEventListener('canplaythrough', handleLoad, { once: true }); audio.addEventListener('error', handleLoad, { once: true }); }
}

function updateLoadingProgressValue(progress) {
    updateLoadingBar(progress);
    updateLoadingText(progress);
}

function updateLoadingBar(progress) {
    const loadingBar = document.getElementById('loadingBar');
    if (loadingBar) {
        loadingBar.style.width = Math.min(progress, 100) + '%';
    }
}

function updateLoadingText(progress) {
    const loadingText = document.getElementById('loadingText');
    if (loadingText) {
        if (progress < 100) {
            const tips = getLoadingTip(progress);
            loadingText.textContent = `Loading... ${Math.round(progress)}% - ${tips}`;
        } else {
            loadingText.textContent = 'Ready!';
        }
    }
}

function getLoadingTip(progress) {
    if (progress < 20) return 'Preparing Pepe\'s adventure...';
    if (progress < 40) return 'Loading character animations...';
    if (progress < 60) return 'Setting up enemies...';
    if (progress < 80) return 'Creating desert landscapes...';
    return 'Almost ready for action!';
}