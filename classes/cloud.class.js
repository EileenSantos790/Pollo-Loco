class Cloud extends MoveableObject {
    y = 20;
    width = 500;
    height = 250;

    constructor() {
        super().loadImage('components/img_pollo_loco/img/5_background/layers/4_clouds/1.png');

        this.x = 0 + Math.random() * 500;

        this.animate();
    }

    animate() {
        this.moveLeft();
    }
}
