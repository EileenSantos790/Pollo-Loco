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
    muteBackgroundMusic();
    muteCharacterSounds();
    muteWorldSounds();
    muteGlobalSounds();
}

/**
 * Mutes or unmutes background music.
 * @returns {void}
 */
function muteBackgroundMusic() {
    if (backgroundMusic) {
        try { 
            backgroundMusic.muted = isMuted; 
        } catch (e) { 
            console.log(e); 
        }
    }
}

/**
 * Mutes or unmutes character sounds.
 * @returns {void}
 */
function muteCharacterSounds() {
    if (world && world.character && world.character.soundManager) {
        try {
            if (isMuted) {
                world.character.soundManager.muteAll();
            } else {
                world.character.soundManager.unmuteAll();
            }
        } catch (e) {
            console.log(e);
        }
    }
}

/**
 * Mutes or unmutes world sounds.
 * @returns {void}
 */
function muteWorldSounds() {
    if (world && world.soundManager) {
        try {
            if (isMuted) {
                world.soundManager.muteAll();
            } else {
                world.soundManager.unmuteAll();
            }
        } catch (e) {
            console.log(e);
        }
    }
}

/**
 * Mutes or unmutes global sounds.
 * @returns {void}
 */
function muteGlobalSounds() {
    if (globalSoundManager) {
        try {
            if (isMuted) {
                globalSoundManager.muteAll();
            } else {
                globalSoundManager.unmuteAll();
            }
        } catch (e) {
            console.log(e);
        }
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
    handleMuteToggle();
    updateMuteIcon();
}

/**
 * Handles mute toggle for background music.
 * @returns {void}
 */
function handleMuteToggle() {
    if (backgroundMusic) {
        try {
            backgroundMusic.muted = isMuted;
            if (!isMuted && gameState === 'playing') {
                backgroundMusic.play().catch((e) => { console.log(e); });
            }
        } catch (e) { }
    }
    muteCharacterSounds();
    muteWorldSounds();
    muteGlobalSounds();
}

/**
 * Stops background music.
 * @returns {void}
 */
function stopBackgroundMusic() {
    if (backgroundMusic) {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
    }
}

/**
 * Stops all game sounds and resets background music.
 * @returns {void}
 */
function stopAllSounds() {
    stopBackgroundMusic();
    if (globalSoundManager) {
        globalSoundManager.stopSound('gameOver');
        globalSoundManager.stopSound('win');
    }
    if (window.world) {
        try {
            if (world.soundManager) world.soundManager.stopAll();
            if (world.character && world.character.soundManager) world.character.soundManager.stopAll();
        } catch (e) { }
    }
}