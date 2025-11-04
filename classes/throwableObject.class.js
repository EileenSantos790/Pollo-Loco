class ThrowableObject extends MoveableObject {

    constructor(x = 100, y = 100, throwLeft = false) {
        super();
        this.loadImage('components/img_pollo_loco/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png');
        this.loadImages([
            'components/img_pollo_loco/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
            'components/img_pollo_loco/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
            'components/img_pollo_loco/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
            'components/img_pollo_loco/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
            'components/img_pollo_loco/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
            'components/img_pollo_loco/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
        ]);
        this.width = 60;
        this.height = 50;
        this.throwLeft = throwLeft;
        this.isSplashing = false;
        this.splashAnimationFinished = false;
        this.throw(x, y);
    }

    throw(x, y) {
        this.x = x;
        this.y = y;
        this.speedY = 30;
        this.speed = 10;
        this.applyGravity();
        this.throwInterval = setInterval(() => {
            if (this.throwLeft) {
                this.x -= 10;
            } else {
                this.x += 10;
            }
        }, 25);
    }

    splash() {
        if (!this.isSplashing) {
            this.isSplashing = true;
            clearInterval(this.throwInterval);
            this.speedY = 0;
            this.speed = 0;
            
            let currentFrame = 0;
            const splashImages = [
                'components/img_pollo_loco/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
                'components/img_pollo_loco/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
                'components/img_pollo_loco/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
                'components/img_pollo_loco/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
                'components/img_pollo_loco/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
                'components/img_pollo_loco/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
            ];
            
            const animationInterval = setInterval(() => {
                if (currentFrame < splashImages.length) {
                    this.loadImage(splashImages[currentFrame]);
                    currentFrame++;
                } else {
                    clearInterval(animationInterval);
                    this.splashAnimationFinished = true;
                }
            }, 100);
        }
    }
}