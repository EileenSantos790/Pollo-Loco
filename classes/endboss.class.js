class Endboss extends MoveableObject {

    height = 400;
    width = 250;
    y = 70;
    isActivated = false;
    speed = 1;

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

    constructor() {
        super().loadImage(this.IMAGES_ALERT[0]);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_WALKING);

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

        setInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 200);

        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);
    }
}