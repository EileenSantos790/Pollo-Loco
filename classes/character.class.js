class Character extends MoveableObject {

    height = 300;
    width = 150;
    y = 135;
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

    world;
    idleTimer = 0;
    isIdle = false;
    isLongIdle = false;

    constructor() {
        super().loadImage('components/img_pollo_loco/img/2_character_pepe/1_idle/idle/I-1.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONG_IDLE);
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
    }

    handleWalkingAnimation() {
        if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
            this.playAnimation(this.IMAGES_WALKING);
        }
    }

    handleIdleAnimations() {
        if (!this.world.keyboard.RIGHT && !this.world.keyboard.LEFT) {
            if (this.isLongIdle) {
                this.playAnimation(this.IMAGES_LONG_IDLE);
            } else if (this.isIdle) {
                this.playAnimation(this.IMAGES_IDLE);
            }
        }
    }

    handleIdleTimer() {
        if (!this.world.keyboard.RIGHT && !this.world.keyboard.LEFT) {
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

    resetIdleState() {
        this.idleTimer = 0;
        this.isIdle = false;
        this.isLongIdle = false;
    }

    jump() {
        console.log('jump');
    }
}
