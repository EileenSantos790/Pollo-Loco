class Endboss extends MoveableObject {

    height = 400;
    width = 250;
    y = 70;
    isActivated = false;
    speed = 3;
    hitCount = 0;
    isDying = false;
    isHurting = false;
    walkInterval;
    animationInterval;

    IMAGES_ALERT = [
        'components/img_pollo_loco/img/4_enemie_boss_chicken/2_alert/G5.png',
        'components/img_pollo_loco/img/4_enemie_boss_chicken/2_alert/G6.png',
        'components/img_pollo_loco/img/4_enemie_boss_chicken/2_alert/G7.png',
        'components/img_pollo_loco/img/4_enemie_boss_chicken/2_alert/G8.png',
        'components/img_pollo_loco/img/4_enemie_boss_chicken/2_alert/G9.png',
        'components/img_pollo_loco/img/4_enemie_boss_chicken/2_alert/G10.png',
        'components/img_pollo_loco/img/4_enemie_boss_chicken/2_alert/G11.png',
        'components/img_pollo_loco/img/4_enemie_boss_chicken/2_alert/G12.png',
    ];

    IMAGES_WALKING = [
        'components/img_pollo_loco/img/4_enemie_boss_chicken/1_walk/G1.png',
        'components/img_pollo_loco/img/4_enemie_boss_chicken/1_walk/G2.png',
        'components/img_pollo_loco/img/4_enemie_boss_chicken/1_walk/G3.png',
        'components/img_pollo_loco/img/4_enemie_boss_chicken/1_walk/G4.png',
    ];

    IMAGES_HURT = [
        'components/img_pollo_loco/img/4_enemie_boss_chicken/4_hurt/G21.png',
        'components/img_pollo_loco/img/4_enemie_boss_chicken/4_hurt/G22.png',
        'components/img_pollo_loco/img/4_enemie_boss_chicken/4_hurt/G23.png',
    ];

    IMAGES_DEAD = [
        'components/img_pollo_loco/img/4_enemie_boss_chicken/5_dead/G24.png',
        'components/img_pollo_loco/img/4_enemie_boss_chicken/5_dead/G25.png',
        'components/img_pollo_loco/img/4_enemie_boss_chicken/4_hurt/G23.png',
    ];


    /**
     * Creates an instance of the Endboss class.
     * @constructor
     */
    constructor() {
        super().loadImage(this.IMAGES_ALERT[0]);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);

        this.x = 720 * 3 + 150;
    }


    /**
     * Activates the end boss.
     * @returns {void}
     */
    activate() {
        if (!this.isActivated) {
            this.isActivated = true;
            this.animate();
        }
    }


    /**
     * Starts the animation loop for the end boss.
     * @returns {void}
     */
    animate() {
        let alertInterval = setInterval(() => {
            this.playAnimation(this.IMAGES_ALERT);
        }, 200);

        setTimeout(() => {
            clearInterval(alertInterval);
            this.startWalkingAndMovement();
        }, 2000);
    }


    /**
     * Starts the walking and movement behavior for the end boss.
     * @returns {void}
     */
    startWalkingAndMovement() {
        this.animationInterval = setInterval(() => {
            if (!this.isDying && !this.isHurting) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);

        this.walkInterval = setInterval(() => {
            if (!this.isDying) {
                this.moveLeft();
            }
        }, 1000 / 60);
    }


    /**
     * Moves the endboss to the left, but prevents it from going beyond the left boundary.
     * @returns {void}
     */
    moveLeft() {
        if (this.x > 0) {
            this.x -= this.speed;
        }
    }


    /**
     * Handles the event when the end boss is hit by a bottle.
     * @returns {void}
     */
    hitByBottle() {
        if (this.isDying) { return; }
        this.hitCount++;
        if (this.hitCount >= 3) {
            this.showHurtAnimationBeforeDeath();
        } else {
            this.showHurtAnimation();
        }
    }


    /**
     * Shows the hurt animation for the end boss.
     * @returns {void}
     */
    showHurtAnimation() {
        if (this.isDying || this.isHurting) { return; } 
        this.isHurting = true;
        clearInterval(this.animationInterval);
        let hurtAnimationInterval = setInterval(() => {
            this.playAnimation(this.IMAGES_HURT);
        }, 150);
        setTimeout(() => {
            clearInterval(hurtAnimationInterval);
            this.isHurting = false;
            if (!this.isDying) {
                this.startWalkingAndMovement();
            }
        }, 1000);
    }


    /**
     * Shows the hurt animation before the end boss dies.
     * @returns {void}
     */
    showHurtAnimationBeforeDeath() {
        if (this.isDying || this.isHurting) { return; } 
        this.isHurting = true;
        clearInterval(this.walkInterval);
        clearInterval(this.animationInterval);

        let hurtAnimationInterval = setInterval(() => {
            this.playAnimation(this.IMAGES_HURT);
        }, 150);

        setTimeout(() => {
            clearInterval(hurtAnimationInterval);
            this.die();
        }, 1000);
    }


    /**
     * Handles the event when the end boss dies.
     * @returns {void}
     */
    die() {
        if (this.isDying) { return; }
        this.isDying = true;
        this.isHurting = false;
        clearInterval(this.walkInterval);
        clearInterval(this.animationInterval);
        let deathAnimationInterval = setInterval(() => {
            this.playAnimation(this.IMAGES_DEAD);
        }, 200);
        setTimeout(() => {
            clearInterval(deathAnimationInterval);
        }, 2000);
    }


    /**
     * Checks if the end boss is dead.
     * @returns {boolean}
     */
    isDead() {
        return this.hitCount >= 3 && this.isDying;
    }
}