class smallChicken extends MoveableObject {

    y = 390;
    height = 40;
    width = 35;
    isDying = false;
    walkInterval;
    animationInterval;
    
    IMAGES_WALKING = [
        'components/img_pollo_loco/img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'components/img_pollo_loco/img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'components/img_pollo_loco/img/3_enemies_chicken/chicken_small/1_walk/3_w.png',
    ];
    
    IMAGES_DEAD = [
        'components/img_pollo_loco/img/3_enemies_chicken/chicken_small/2_dead/dead.png'
    ]; 

    constructor(){
        super().loadImage('components/img_pollo_loco/img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);

        this.x = 600 + Math.random() * 1500;
        this.speed = 0.15 + Math.random() * 0.25;
        this.animate();
    }

    animate(){
        this.walkInterval = setInterval(() => {
            if (!this.isDying) {
                this.moveLeft();
            }
        }, 1000 / 60);

        this.animationInterval = setInterval(() => {
            if (!this.isDying) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);
    }

    die() {
        if (!this.isDying) {
            this.isDying = true;
            clearInterval(this.walkInterval);
            clearInterval(this.animationInterval);
            this.loadImage('components/img_pollo_loco/img/3_enemies_chicken/chicken_small/2_dead/dead.png');
        }
    }


} 