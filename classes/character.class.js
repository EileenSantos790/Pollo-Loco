class Character extends MoveableObject {

    height = 300;
    width = 150;
    y = 130;
    speed = 10;
    IMAGES_WALKING = [
        'components/img_pollo_loco/img/2_character_pepe/2_walk/W-21.png',
        'components/img_pollo_loco/img/2_character_pepe/2_walk/W-22.png',
        'components/img_pollo_loco/img/2_character_pepe/2_walk/W-23.png',
        'components/img_pollo_loco/img/2_character_pepe/2_walk/W-24.png',
        'components/img_pollo_loco/img/2_character_pepe/2_walk/W-25.png',
        'components/img_pollo_loco/img/2_character_pepe/2_walk/W-26.png',
    ];

    IMAGES_IDLE = [
        'components/img_pollo_loco/img/2_character_pepe/1_idle/idle/I-1.png',
        'components/img_pollo_loco/img/2_character_pepe/1_idle/idle/I-2.png',
        'components/img_pollo_loco/img/2_character_pepe/1_idle/idle/I-3.png',
        'components/img_pollo_loco/img/2_character_pepe/1_idle/idle/I-4.png',
        'components/img_pollo_loco/img/2_character_pepe/1_idle/idle/I-5.png',
        'components/img_pollo_loco/img/2_character_pepe/1_idle/idle/I-6.png',
        'components/img_pollo_loco/img/2_character_pepe/1_idle/idle/I-7.png',
        'components/img_pollo_loco/img/2_character_pepe/1_idle/idle/I-8.png',
        'components/img_pollo_loco/img/2_character_pepe/1_idle/idle/I-9.png',
        'components/img_pollo_loco/img/2_character_pepe/1_idle/idle/I-10.png',
    ];

    IMAGES_LONG_IDLE = [
        'components/img_pollo_loco/img/2_character_pepe/1_idle/long_idle/I-11.png',
        'components/img_pollo_loco/img/2_character_pepe/1_idle/long_idle/I-12.png',
        'components/img_pollo_loco/img/2_character_pepe/1_idle/long_idle/I-13.png',
        'components/img_pollo_loco/img/2_character_pepe/1_idle/long_idle/I-14.png',
        'components/img_pollo_loco/img/2_character_pepe/1_idle/long_idle/I-15.png',
        'components/img_pollo_loco/img/2_character_pepe/1_idle/long_idle/I-16.png',
        'components/img_pollo_loco/img/2_character_pepe/1_idle/long_idle/I-17.png',
        'components/img_pollo_loco/img/2_character_pepe/1_idle/long_idle/I-18.png',
        'components/img_pollo_loco/img/2_character_pepe/1_idle/long_idle/I-19.png',
        'components/img_pollo_loco/img/2_character_pepe/1_idle/long_idle/I-20.png',
    ];

    IMAGES_JUMP = [
        'components/img_pollo_loco/img/2_character_pepe/3_jump/J-31.png',
        'components/img_pollo_loco/img/2_character_pepe/3_jump/J-32.png',
        'components/img_pollo_loco/img/2_character_pepe/3_jump/J-33.png',
        'components/img_pollo_loco/img/2_character_pepe/3_jump/J-34.png',
        'components/img_pollo_loco/img/2_character_pepe/3_jump/J-35.png',
        'components/img_pollo_loco/img/2_character_pepe/3_jump/J-36.png',
        'components/img_pollo_loco/img/2_character_pepe/3_jump/J-37.png',
        'components/img_pollo_loco/img/2_character_pepe/3_jump/J-38.png',
        'components/img_pollo_loco/img/2_character_pepe/3_jump/J-39.png',
    ];

    IMAGES_DEAD = [
        'components/img_pollo_loco/img/2_character_pepe/5_dead/D-51.png',
        'components/img_pollo_loco/img/2_character_pepe/5_dead/D-52.png',
        'components/img_pollo_loco/img/2_character_pepe/5_dead/D-53.png',
        'components/img_pollo_loco/img/2_character_pepe/5_dead/D-54.png',
        'components/img_pollo_loco/img/2_character_pepe/5_dead/D-55.png',
        'components/img_pollo_loco/img/2_character_pepe/5_dead/D-56.png',
        'components/img_pollo_loco/img/2_character_pepe/5_dead/D-57.png',
    ];

    IMAGES_HURT = [
        'components/img_pollo_loco/img/2_character_pepe/4_hurt/H-41.png',
        'components/img_pollo_loco/img/2_character_pepe/4_hurt/H-42.png',
        'components/img_pollo_loco/img/2_character_pepe/4_hurt/H-43.png',
    ];

    world;
    idleTimer = 0;
    isIdle = false;
    isLongIdle = false;
    bottles = 0;
    maxBottles = 5;
    lastThrowTime = 0;
    throwCooldown = 1500;
    wasAboveGround = false;
    jumpAnimationStarted = false;
    jumpAnimationIndex = 0;
    deathAnimationStarted = false;
    deathAnimationCompleted = false;
    deathAnimationIndex = 0;


    /**
     * Creates a new Character instance.
     * Initializes the character with default idle image, loads all animation image sets,
     * sets up sound management, applies gravity physics, starts animation loop,
     * and initializes bottle count to zero.
     * @constructor
     */
    constructor() {
        super().loadImage('components/img_pollo_loco/img/2_character_pepe/1_idle/idle/I-1.png');
        this.loadImages(this.IMAGES_WALKING); this.loadImages(this.IMAGES_IDLE); this.loadImages(this.IMAGES_LONG_IDLE);
        this.wasWalking = false;
        this.loadImages(this.IMAGES_JUMP); this.loadImages(this.IMAGES_DEAD); this.loadImages(this.IMAGES_HURT);
        this.soundManager = new SoundManager();
        this.applyGravity();
        this.isIdle = true;  this.idleTimer = 0; this.isLongIdle = false; this.currentImageIndex = 0;
        this.animate();
        this.bottles = 0;
    }


    /**
     * Starts all animation intervals for the character.
     * @returns {void}
     */
    animate() {
        setInterval(() => { this.handleMovement(); }, 1000 / 60);
        setInterval(() => { this.handleWalkingAnimation(); }, 80);
        setInterval(() => { this.handleIdleAnimations(); }, 160);
        setInterval(() => { this.handleIdleTimer(); }, 1000);
        setInterval(() => { this.handleJumpingAnimation(); }, 50);  
        setInterval(() => { this.updateJumpAnimationFrame(); }, 150);
        setInterval(() => { this.handleDeathAnimation(); }, 150);
        setInterval(() => { this.updateDeathAnimationFrame(); }, 150);
        setInterval(() => { this.handleHurtAnimation(); }, 250);            
    }


    /**
     * Handles character movement based on keyboard input.
     * @returns {void}
     */
    handleMovement() {
        if (this.isDead()) return;
        let isMoving = false;
        if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) { this.x += this.speed; this.otherDirection = false; isMoving = true; }
        if (this.world.keyboard.LEFT && this.x > 0) { this.x -= this.speed; this.otherDirection = true; isMoving = true; }
        if (isMoving) { this.resetIdleState(); }
        this.world.camera_x = -this.x + 100;
        if (this.world.keyboard.SPACE && !this.isAboveGround()) { this.jump(); }
    }


    /**
     * Handles the walking animation and sound effects for the character.
     * @returns {void}
     */
    handleWalkingAnimation() {
        const moving = this.world.keyboard.RIGHT || this.world.keyboard.LEFT;
        if (!this.isDead() && moving) {
            this.handleMovingAnimation();
        } else {
            this.handleStoppedMoving();
        }
    }

    /**
     * Handles animation when character is moving.
     * @returns {void}
     */
    handleMovingAnimation() {
        if (!this.isAboveGround()) {
            this.playAnimation(this.IMAGES_WALKING);
            if (!this.soundManager.isPlaying('walking')) {
                this.soundManager.playSound('walking');
            }
        } else {
            this.soundManager.stopSound('walking');
        }
        this.wasWalking = true;
    }

    /**
     * Handles transition when character stops moving.
     * @returns {void}
     */
    handleStoppedMoving() {
        this.soundManager.stopSound('walking');
        if (this.wasWalking && !this.isAboveGround()) {
            this.transitionToIdle();
        }
        this.wasWalking = false;
    }

    /**
     * Transitions character to idle state.
     * @returns {void}
     */
    transitionToIdle() {
        this.img = this.imageCache['components/img_pollo_loco/img/2_character_pepe/1_idle/idle/I-1.png'];
        this.currentImageIndex = 0;
        this.isIdle = true;
    }


    /**
     * Handles idle animation states for the character when not moving or performing actions.
     * Plays different idle animations based on how long the character has been idle.
     * Manages snoring sound effects during long idle states.
     *
     * @description This method checks if the character is in a valid idle state (not dead, not moving left/right,
     * on ground, and game is playing) and then plays appropriate animations. If the character has been idle for
     * a long time, it plays long idle animations with snoring sounds. For short idle periods, it plays regular
     * idle animations and stops any snoring sounds.
     */
    handleIdleAnimations() {
        if (!this.isDead() && !this.world.keyboard.RIGHT && !this.world.keyboard.LEFT && !this.isAboveGround() && gameState === 'playing') {
            if (this.isLongIdle) {
                this.playAnimation(this.IMAGES_LONG_IDLE);
                if (!this.soundManager.isPlaying('snoring')) { this.soundManager.playSound('snoring'); }
            } else if (this.isIdle) { this.playAnimation(this.IMAGES_IDLE); this.soundManager.stopSound('snoring'); }
        } else { this.soundManager.stopSound('snoring'); }
    }


    /**
     * Handles the jumping animation for the character.
     * @returns {void}
     */
    handleJumpingAnimation() {
        if (this.isDead()) return;
        const currentlyAboveGround = this.isAboveGround();
        if (currentlyAboveGround) { this.wasAboveGround = true;
            if (!this.jumpAnimationStarted) { this.jumpAnimationStarted = true; this.jumpAnimationIndex = 0; }
            if (this.jumpAnimationIndex < this.IMAGES_JUMP.length) { const path = this.IMAGES_JUMP[this.jumpAnimationIndex]; this.img = this.imageCache[path];
            } else { const lastFramePath = this.IMAGES_JUMP[this.IMAGES_JUMP.length - 1]; this.img = this.imageCache[lastFramePath]; }
        } else if (this.wasAboveGround && !currentlyAboveGround) { this.wasAboveGround = false; this.jumpAnimationStarted = false; this.jumpAnimationIndex = 0; this.resetIdleState(); this.isIdle = true; this.currentImageIndex = 0; }
    }


    /**
     * Updates the jump animation frame index if the jump animation is currently active.
     * Increments the jumpAnimationIndex to progress through the jump animation frames,
     * but only if the animation has started and hasn't exceeded the available frames.
     */
    updateJumpAnimationFrame() {
        if (this.jumpAnimationStarted && this.jumpAnimationIndex < this.IMAGES_JUMP.length) {
            this.jumpAnimationIndex++;
        }
    }


    /**     
     * Handles the idle timer for the character, managing different idle states.
     * Increments the idle timer when the character is not dead, not moving horizontally,
     * and not above ground. Triggers idle and long idle states based on timer thresholds.
     *
     * @method handleIdleTimer
     * @returns {void}
     */
    handleIdleTimer() {
        if (!this.isDead() && !this.world.keyboard.RIGHT && !this.world.keyboard.LEFT && !this.isAboveGround()) {
            this.idleTimer++;
            if (this.idleTimer === 2 && !this.isIdle) {  this.isIdle = true; this.currentImageIndex = 0; }
            if (this.idleTimer >= 15 && !this.isLongIdle) { this.isLongIdle = true; this.currentImageIndex = 0; }
        }
    }


    /**
     * Handles the death animation sequence for the character.
     * Initializes the death animation on first call when character is dead,
     * cycles through death animation frames, and maintains the final frame
     * when animation is complete.
     * 
     * @method handleDeathAnimation
     * @returns {void}
     */
    handleDeathAnimation() {
        if (this.isDead()) {
            if (!this.deathAnimationStarted) {
                this.deathAnimationStarted = true;
                this.deathAnimationIndex = 0;
                this.deathAnimationCompleted = false;
            }
            if (this.deathAnimationIndex < this.IMAGES_DEAD.length) {
                const path = this.IMAGES_DEAD[this.deathAnimationIndex];
                this.img = this.imageCache[path];
            } else {
                const lastFramePath = this.IMAGES_DEAD[this.IMAGES_DEAD.length - 1];
                this.img = this.imageCache[lastFramePath];
                this.deathAnimationCompleted = true;
            }
        }
    }


    /**
     * Updates the death animation frame index if the death animation is currently active.
     * Increments the deathAnimationIndex to progress through the death animation frames,
     * but only if the animation has started and hasn't exceeded the available frames.
     */
    updateDeathAnimationFrame() {
        if (this.deathAnimationStarted && this.deathAnimationIndex < this.IMAGES_DEAD.length) {
            this.deathAnimationIndex++;
        }
    }


    /**
     * Checks if the death animation has completed.
     * @returns {boolean}
     */
    isDeathAnimationCompleted() {
        return this.deathAnimationCompleted;
    }


    /**
     * Handles the hurt animation sequence for the character.
     * Plays the hurt animation frames and manages sound effects.
     * 
     * @method handleHurtAnimation
     * @returns {void}
     */
    handleHurtAnimation() {
        if (!this.isDead() && this.isHurt()) {
            this.playAnimation(this.IMAGES_HURT);

            if (!this.soundManager.hasPlayed('hurt')) { this.soundManager.playSound('hurt'); }
        } else {
            this.soundManager.resetSoundState('hurt');
        }
    }


    /**
     * Resets the idle state of the character.
     * @returns {void}
     */
    resetIdleState() {
        this.idleTimer = 0;
        this.isIdle = false;
        this.isLongIdle = false;
        this.soundManager.stopSound('snoring');
    }


    /**
     * Stops the long idle animation and resets the idle state.
     * @returns {void}
     */
    stopLongIdleAnimation() {
        if (this.isLongIdle) {
            this.isLongIdle = false;
            this.isIdle = true;
            this.currentImageIndex = 0;
            this.soundManager.stopSound('snoring');
        }
    }


    /**
     * Collects a bottle for the character.
     * Increments the bottle count and plays the collection sound.
     * @returns {void}
     */
    collectBottle() {
        if (this.bottles < this.maxBottles) {
            this.bottles++;
            this.soundManager.playSound('bottleCollect');
        }
    }


    /**
     * Checks if the character can throw a bottle.
     * @returns {boolean}
     */
    canThrowBottle() {
        let currentTime = new Date().getTime();
        return this.bottles > 0 && (currentTime - this.lastThrowTime) > this.throwCooldown;
    }


    /**
     * Throws a bottle if the character is able to.
     * @returns {void}
     */
    throwBottle() {
        if (this.canThrowBottle()) {
            this.bottles--;
            this.lastThrowTime = new Date().getTime();
        }
    }


    /**
     * Gets the current bottle percentage.
     * @returns {number}
     */
    getBottlePercentage() {
        return (this.bottles / this.maxBottles) * 100;
    }


    /**
     * Makes the character jump.
     * @returns {void}
     */
    jump() {
        this.soundManager.playSound('jump');
        super.jump();
    }
}