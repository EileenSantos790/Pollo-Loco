class SoundManager {

    /**
     * Constructor for the SoundManager class.
     */
    constructor() {
        this.sounds = {};
        this.soundStates = {};
        this.isMuted = false;
        this.originalVolumes = {};
        this.initializeSounds();
    }


    /**
     * Initializes the sound effects.
     * @returns {void}
     */
    initializeSounds() {
        this.createSound('hurt', 'components/audio/hurt.wav', { volume: 0.4 });
        this.createSound('coin', 'components/audio/collectingMoney.wav', { volume: 0.6 });
        this.createSound('snoring', 'components/audio/Snoring-Child-chosic.com_ (1).mp3', { volume: 0.1, loop: true });
        this.createSound('walking', 'components/audio/walk.wav', { volume: 0.3, loop: true });
        this.createSound('jump', 'components/audio/jump.wav', { volume: 0.3 });
        this.createSound('bottleCollect', 'components/audio/bottleCollecting.wav', { volume: 0.3 });
        this.createSound('endbossAlert', 'components/audio/chicken.wav', { volume: 0.3 });
        this.createSound('endbossHurt', 'components/audio/chicken.wav', { volume: 0.3 });
        this.createSound('gameOver', 'components/audio/gameOver.wav', { volume: 0.4 });
        this.createSound('win', 'components/audio/Winning.wav', { volume: 0.4 });
        this.createSound('crush', 'components/audio/crush.wav', { volume: 0.3 });
        this.createSound('glassBroken', 'components/audio/glassBroken.wav', { volume: 0.4 });
    }


    /**
     * Creates a sound object.
     * @param {string} name - The name of the sound.
     * @param {string} path - The path to the sound file.
     * @param {Object} options - Additional options for the sound.
     * @returns {void}
     */
    createSound(name, path, options = {}) {
        try {
            const audio = new Audio(path);
            const volume = options.volume || 0.5;
            audio.volume = volume;
            audio.loop = options.loop || false;
            audio.preload = 'auto';
            this.sounds[name] = audio;
            this.originalVolumes[name] = volume;
            this.soundStates[name] = {
                isPlaying: false,
                hasPlayed: false
            };
        } catch (error) { }
    }


    /**
     * Plays a sound.
     * @param {string} name - The name of the sound to play.
     * @returns {boolean} - Returns true if the sound was played successfully, false otherwise.
     */
    playSound(name) {
        const sound = this.sounds[name];
        if (!sound) { return false; }
        try {
            sound.currentTime = 0;
            sound.play().then(() => {
                this.soundStates[name].isPlaying = true;
                this.soundStates[name].hasPlayed = true;
            }).catch(e => {
                this.soundStates[name].isPlaying = false;
            });
            return true;
        } catch (error) { return false; }
    }


    /**
     * Stops a sound.
     * @param {string} name - The name of the sound to stop.
     * @returns {void}
     */
    stopSound(name) {
        const sound = this.sounds[name];
        if (!sound) {
            return;
        }
        try {
            sound.pause();
            sound.currentTime = 0;
            this.soundStates[name].isPlaying = false;
        } catch (error) { }
    }


    /**
     * Pauses a sound.
     * @param {string} name - The name of the sound to pause.
     * @returns {void}
     */
    pauseSound(name) {
        const sound = this.sounds[name];
        if (!sound) {
            return;
        }
        try {
            sound.pause();
            this.soundStates[name].isPlaying = false;
        } catch (error) { }
    }


    /**
     * Checks if a sound is currently playing.
     * @param {string} name - The name of the sound to check.
     * @returns {boolean} - Returns true if the sound is playing, false otherwise.
     */
    isPlaying(name) {
        return this.soundStates[name]?.isPlaying || false;
    }


    /**
     * Checks if a sound has been played at least once.
     * @param {string} name - The name of the sound to check.
     * @returns {boolean} - Returns true if the sound has been played, false otherwise.
     */
    hasPlayed(name) {
        return this.soundStates[name]?.hasPlayed || false;
    }


    /**
     * Resets the sound state.
     * @param {string} name - The name of the sound to reset.
     * @returns {void}
     */
    resetSoundState(name) {
        if (this.soundStates[name]) {
            this.soundStates[name].hasPlayed = false;
        }
    }


    /**
     * Sets the volume of a sound.
     * @param {string} name - The name of the sound to set the volume for.
     * @param {number} volume - The volume level (0 to 1).
     * @returns {void}
     */
    setVolume(name, volume) {
        const sound = this.sounds[name];
        if (sound && volume >= 0 && volume <= 1) {
            sound.volume = volume;
        }
    }


    /**
     * Mutes all sounds.
     * @returns {void}
     */
    muteAll() {
        this.isMuted = true;
        Object.values(this.sounds).forEach(sound => {
            sound.volume = 0;
        });
    }


    /**
     * Unmutes all sounds.
     * @returns {void}
     */
    unmuteAll() {
        this.isMuted = false;
        Object.keys(this.originalVolumes).forEach(name => {
            this.setVolume(name, this.originalVolumes[name]);
        });
    }


    /**
     * Toggles the mute state of all sounds.
     * @returns {boolean} - Returns the new mute state.
     */
    toggleMute() {
        if (this.isMuted) {
            this.unmuteAll();
        } else {
            this.muteAll();
        }
        return this.isMuted;
    }


    /**
     * Plays the end boss alert sound.
     * @returns {Promise<boolean>} - Returns true if the sound started playing, false otherwise.
     */
    playEndbossAlert() {
        return this.playSound('endbossAlert');
    }


    /**
     * Plays the game over sound.
     * @returns {Promise<boolean>} - Returns true if the sound started playing, false otherwise.
     */
    playGameOver() {
        return this.playSound('gameOver');
    }


    /**
     * Plays the win sound.
     * @returns {Promise<boolean>} - Returns true if the sound started playing, false otherwise.
     */
    playWin() {
        return this.playSound('win');
    }


    /**
     * Plays the crush sound.
     * @returns {Promise<boolean>} - Returns true if the sound started playing, false otherwise.
     */
    playCrush() {
        return this.playSound('crush');
    }


    /**
     * Plays the coin sound.
     * @returns {Promise<boolean>} - Returns true if the sound started playing, false otherwise.
     */
    playCoin() {
        return this.playSound('coin');
    }
}