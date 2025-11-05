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
    throwCooldown = 500;
    wasAboveGround = false;
    jumpAnimationStarted = false;
    jumpAnimationIndex = 0;
    deathAnimationStarted = false;
    deathAnimationCompleted = false;
    deathAnimationIndex = 0;
    constructor() {
        super().loadImage('components/img_pollo_loco/img/2_character_pepe/1_idle/idle/I-1.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONG_IDLE);
        this.loadImages(this.IMAGES_JUMP);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);

        this.soundManager = new SoundManager();

        this.applyGravity();
        this.animate();
        this.bottles = 0;
    }

    animate() {
        setInterval(() => {
            this.handleMovement();
        }, 1000 / 60);

        setInterval(() => {
            this.handleWalkingAnimation();
        }, 80);

        setInterval(() => {
            this.handleIdleAnimations();
        }, 160);

        setInterval(() => {
            this.handleIdleTimer();
        }, 1000);

        setInterval(() => {
            this.handlejumpingAnimation();
        }, 50);

        setInterval(() => {
            this.updateJumpAnimationFrame();
        }, 150);

        setInterval(() => {
            this.handleDeathAnimation();
        }, 150);

        setInterval(() => {
            this.updateDeathAnimationFrame();
        }, 150);

        setInterval(() => {
            this.handleHurtAnimation();
        }, 250);

    }

    handleMovement() {
        if (this.isDead()) return;
        
        let isMoving = false;

        if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
            this.x += this.speed;
            this.otherDirection = false;
            isMoving = true;
        }

        if (this.world.keyboard.LEFT && this.x > 0) {
            this.x -= this.speed;
            this.otherDirection = true;
            isMoving = true;
        }

        if (isMoving) {
            this.resetIdleState();
        }

        this.world.camera_x = -this.x + 100;
        if (this.world.keyboard.SPACE && !this.isAboveGround()) {
            this.jump();
        }
    }

    handleWalkingAnimation() {
        if (!this.isDead() && (this.world.keyboard.RIGHT || this.world.keyboard.LEFT)) {
            this.playAnimation(this.IMAGES_WALKING);

            if (!this.isAboveGround()) {
                if (!this.soundManager.isPlaying('walking')) {
                    console.log('Starting walking sound');
                    this.soundManager.playSound('walking');
                }
            } else {
                this.soundManager.stopSound('walking');
            }
        } else {
            this.soundManager.stopSound('walking');
        }
    }

    handleIdleAnimations() {
        if (!this.isDead() && !this.world.keyboard.RIGHT && !this.world.keyboard.LEFT && !this.isAboveGround() && gameState === 'playing') {
            if (this.isLongIdle) {
                this.playAnimation(this.IMAGES_LONG_IDLE);

                if (!this.soundManager.isPlaying('snoring')) {
                    this.soundManager.playSound('snoring');
                }
            } else if (this.isIdle) {
                this.playAnimation(this.IMAGES_IDLE);
                this.soundManager.stopSound('snoring');
            }
        } else {
            this.soundManager.stopSound('snoring');
        }
    }

    handlejumpingAnimation() {
        if (this.isDead()) return;
        
        const currentlyAboveGround = this.isAboveGround();
        
        if (currentlyAboveGround) {
            this.wasAboveGround = true;
            
            if (!this.jumpAnimationStarted) {
                this.jumpAnimationStarted = true;
                this.jumpAnimationIndex = 0;
            }
            
            if (this.jumpAnimationIndex < this.IMAGES_JUMP.length) {
                const path = this.IMAGES_JUMP[this.jumpAnimationIndex];
                this.img = this.imageCache[path];
            } else {
                const lastFramePath = this.IMAGES_JUMP[this.IMAGES_JUMP.length - 1];
                this.img = this.imageCache[lastFramePath];
            }
        } else if (this.wasAboveGround && !currentlyAboveGround) {
            this.wasAboveGround = false;
            this.jumpAnimationStarted = false;
            this.jumpAnimationIndex = 0;
            this.resetIdleState();
            this.isIdle = true;
            this.currentImageIndex = 0;
        }
    }

    updateJumpAnimationFrame() {
        if (this.jumpAnimationStarted && this.jumpAnimationIndex < this.IMAGES_JUMP.length) {
            this.jumpAnimationIndex++;
        }
    }

    handleIdleTimer() {
        if (!this.isDead() && !this.world.keyboard.RIGHT && !this.world.keyboard.LEFT && !this.isAboveGround()) {
            this.idleTimer++;

            if (this.idleTimer === 2 && !this.isIdle) {
                this.isIdle = true;
                this.currentImageIndex = 0;
            } else if (this.idleTimer > 4 && !this.isLongIdle) {
                this.isLongIdle = true;
                this.currentImageIndex = 0;
            }
        }
    }

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

    updateDeathAnimationFrame() {
        if (this.deathAnimationStarted && this.deathAnimationIndex < this.IMAGES_DEAD.length) {
            this.deathAnimationIndex++;
        }
    }

    isDeathAnimationCompleted() {
        return this.deathAnimationCompleted;
    }

    handleHurtAnimation() {
        if (!this.isDead() && this.isHurt()) {
            this.playAnimation(this.IMAGES_HURT);

            if (!this.soundManager.hasPlayed('hurt')) {
                this.soundManager.playSound('hurt');
            }
        } else {
            this.soundManager.resetSoundState('hurt');
        }
    }

    resetIdleState() {
        this.idleTimer = 0;
        this.isIdle = false;
        this.isLongIdle = false;
        this.soundManager.stopSound('snoring');
    }

    stopLongIdleAnimation() {
        if (this.isLongIdle) {
            this.isLongIdle = false;
            this.isIdle = true;
            this.currentImageIndex = 0;
            this.soundManager.stopSound('snoring');
        }
    }

    collectBottle() {
        if (this.bottles < this.maxBottles) {
            this.bottles++;
            this.soundManager.playSound('bottleCollect');
        }
    }

    canThrowBottle() {
        let currentTime = new Date().getTime();
        return this.bottles > 0 && (currentTime - this.lastThrowTime) > this.throwCooldown;
    }

    throwBottle() {
        if (this.canThrowBottle()) {
            this.bottles--;
            this.lastThrowTime = new Date().getTime();
        }
    }

    getBottlePercentage() {
        return (this.bottles / this.maxBottles) * 100;
    }

    jump() {
        this.soundManager.playSound('jump');
        super.jump();
    }
}
