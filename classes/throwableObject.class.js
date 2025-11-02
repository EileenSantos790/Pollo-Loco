class ThrowableObject extends MoveableObject {

    constructor(x = 100, y = 100, throwLeft = false) {
        super();
        this.loadImage('components/img_pollo_loco/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png');
        this.width = 60;
        this.height = 50;
        this.throwLeft = throwLeft;
        this.throw(x, y);
    }

    throw(x, y) {
        this.x = x;
        this.y = y;
        this.speedY = 30;
        this.speed = 10;
        this.applyGravity();
        setInterval(() => {
            if (this.throwLeft) {
                this.x -= 10;
            } else {
                this.x += 10;
            }
        }, 25);
    }
}