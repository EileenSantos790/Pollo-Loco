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

    world;

    constructor() {
        super().loadImage('components/img_pollo_loco/img/2_character_pepe/2_walk/W-21.png');
        this.loadImages(this.IMAGES_WALKING);
        this.animate();
    }

    animate() {

        setInterval(() => {
            if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                this.x += this.speed;
                this.otherDirection = false;
            }

            if (this.world.keyboard.LEFT && this.x > 0) {
                this.x -= this.speed;
                this.otherDirection = true;
            }

            this.world.camera_x = -this.x + 100;

        }, 1000 / 60);

        setInterval(() => {

            if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {

                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 80);
    }

    jump() {
        console.log('jump');
    }
}
