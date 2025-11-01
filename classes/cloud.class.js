class Cloud extends MoveableObject {
    y = 20;
    width = 600;
    height = 250;

    constructor (imagePath, x, y) {
        super().loadImage(imagePath);
        this.x = x;
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);
    }
}
