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

    constructor() {
        super().loadImage('components/img_pollo_loco/img/2_character_pepe/1_idle/idle/I-1.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONG_IDLE);
        this.loadImages(this.IMAGES_JUMP);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.applyGravity();
        this.animate();
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
        }, 100);

        setInterval(() => {
            this.handleDeathAnimation();
        }, 250);

        setInterval(() => {
            this.handleHurtAnimation();
        }, 250);

    }

    handleMovement() {
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
        if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
            this.playAnimation(this.IMAGES_WALKING);
        }
    }

    handleIdleAnimations() {
        if (!this.isDead() && !this.world.keyboard.RIGHT && !this.world.keyboard.LEFT) {
            if (this.isLongIdle) {
                this.playAnimation(this.IMAGES_LONG_IDLE);
            } else if (this.isIdle) {
                this.playAnimation(this.IMAGES_IDLE);
            }
        }
    }

    handlejumpingAnimation() {
        if (this.isAboveGround()) {
            this.playAnimation(this.IMAGES_JUMP);
        }
    }

    handleIdleTimer() {
        if (!this.isDead() && !this.world.keyboard.RIGHT && !this.world.keyboard.LEFT) {
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
            this.img = this.imageCache['components/img_pollo_loco/img/2_character_pepe/5_dead/D-51.png'];
            this.playAnimation(this.IMAGES_DEAD);
        }
    }

    handleHurtAnimation() {
        if (!this.isDead() && this.isHurt()) {
            this.playAnimation(this.IMAGES_HURT);
        }
    }

    resetIdleState() {
        this.idleTimer = 0;
        this.isIdle = false;
        this.isLongIdle = false;
    }
}
