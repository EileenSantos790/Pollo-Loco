class Endboss extends MoveableObject {

    height = 400;
    width = 250;
    y = 60;

    IMAGES_WALKING = [
        'components/img_pollo_loco/img/4_enemie_boss_chicken/2_alert/G5.png',
        'components/img_pollo_loco/img/4_enemie_boss_chicken/2_alert/G6.png',
        'components/img_pollo_loco/img/4_enemie_boss_chicken/2_alert/G7.png',
        'components/img_pollo_loco/img/4_enemie_boss_chicken/2_alert/G8.png',
        'components/img_pollo_loco/img/4_enemie_boss_chicken/2_alert/G9.png',
        'components/img_pollo_loco/img/4_enemie_boss_chicken/2_alert/G10.png',
        'components/img_pollo_loco/img/4_enemie_boss_chicken/2_alert/G11.png',
        'components/img_pollo_loco/img/4_enemie_boss_chicken/2_alert/G12.png',
    ];

    constructor(){
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);

        this.x = 700;
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 200);
    }
}