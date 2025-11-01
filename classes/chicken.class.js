class Chicken extends MoveableObject {

    y = 350;
    height = 80;
    width = 70;
    IMAGES_WALKING = [
        'components/img_pollo_loco/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'components/img_pollo_loco/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'components/img_pollo_loco/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
    ]; 

    constructor(){
        super().loadImage('components/img_pollo_loco/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);

        this.x = 600 + Math.random() * 1500;
        this.speed = 0.15 + Math.random() * 0.25;
        this.animate();
    }

        animate(){
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);

        setInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 200);
    }


} 