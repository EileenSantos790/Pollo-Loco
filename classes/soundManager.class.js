class SoundManager {
    constructor() {
        this.sounds = {};
        this.soundStates = {};
        this.isMuted = false;
        this.originalVolumes = {};
        this.initializeSounds();
    }

    initializeSounds() {
        this.createSound('hurt', 'components/audio/hurt.wav', { volume: 1.0 });
        this.createSound('coin', 'components/audio/collectingMoney.wav', { volume: 0.8 });
        this.createSound('snoring', 'components/audio/Snoring-Child-chosic.com_ (1).mp3', { 
            volume: 0.6, 
            loop: true 
        });
        this.createSound('walking', 'components/audio/walk.wav', { 
            volume: 1.0, 
            loop: true 
        });
        this.createSound('jump', 'components/audio/jump.wav', { volume: 0.8 });
        this.createSound('bottleCollect', 'components/audio/bottleCollecting.wav', { volume: 0.8 });
        this.createSound('endbossAlert', 'components/audio/chicken.wav', { volume: 0.8 });
    }

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
        } catch (error) {}
    }

    playSound(name) {
        const sound = this.sounds[name];
        if (!sound) {
            return false;
        }

        try {
            sound.currentTime = 0;
            sound.play().then(() => {
                this.soundStates[name].isPlaying = true;
                this.soundStates[name].hasPlayed = true;
            }).catch(e => {
                this.soundStates[name].isPlaying = false;
            });
            return true;
        } catch (error) {
            return false;
        }
    }

    stopSound(name) {
        const sound = this.sounds[name];
        if (!sound) {
            return;
        }

        try {
            sound.pause();
            sound.currentTime = 0;
            this.soundStates[name].isPlaying = false;
        } catch (error) {}
    }

    pauseSound(name) {
        const sound = this.sounds[name];
        if (!sound) {
            return;
        }

        try {
            sound.pause();
            this.soundStates[name].isPlaying = false;
        } catch (error) {}
    }

    isPlaying(name) {
        return this.soundStates[name]?.isPlaying || false;
    }

    hasPlayed(name) {
        return this.soundStates[name]?.hasPlayed || false;
    }

    resetSoundState(name) {
        if (this.soundStates[name]) {
            this.soundStates[name].hasPlayed = false;
        }
    }

    setVolume(name, volume) {
        const sound = this.sounds[name];
        if (sound && volume >= 0 && volume <= 1) {
            sound.volume = volume;
        }
    }

    muteAll() {
        this.isMuted = true;
        Object.values(this.sounds).forEach(sound => {
            sound.volume = 0;
        });
    }

    unmuteAll() {
        this.isMuted = false;
        Object.keys(this.originalVolumes).forEach(name => {
            this.setVolume(name, this.originalVolumes[name]);
        });
    }

    toggleMute() {
        if (this.isMuted) {
            this.unmuteAll();
        } else {
            this.muteAll();
        }
        return this.isMuted;
    }
    
    playEndbossAlert() {
        return this.playSound('endbossAlert');
    }
}