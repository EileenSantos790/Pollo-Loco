class Endboss extends MoveableObject {

    height = 400;
    width = 250;
    y = 70;
    isActivated = false;
    speed = 1;
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

    constructor() {
        super().loadImage(this.IMAGES_ALERT[0]);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);

        this.x = 720 * 3 + 150;
    }

    activate() {
        if (!this.isActivated) {
            this.isActivated = true;
            this.animate();
        }
    }

    animate() {
        let alertInterval = setInterval(() => {
            this.playAnimation(this.IMAGES_ALERT);
        }, 200);

        setTimeout(() => {
            clearInterval(alertInterval);
            this.startWalkingAndMovement();
        }, 2000);
    }

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

    hitByBottle() {
        this.hitCount++;
        
        if (this.hitCount >= 3) {
            this.showHurtAnimationBeforeDeath();
        } else {
            this.showHurtAnimation();
        }
    }

    showHurtAnimation() {
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

    showHurtAnimationBeforeDeath() {
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

    die() {
        this.isDying = true;
        this.isHurting = false;
        
        let deathAnimationInterval = setInterval(() => {
            this.playAnimation(this.IMAGES_DEAD);
        }, 200);

        setTimeout(() => {
            clearInterval(deathAnimationInterval);
        }, 2000);
    }

    isDead() {
        return this.isDying;
    }
}