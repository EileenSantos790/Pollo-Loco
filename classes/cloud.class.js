class Cloud extends MoveableObject {
    y = 20;
    width = 600;
    height = 250;


    /**
     * Creates an instance of the Cloud class.
     * Initializes the cloud's position and starts the animation.
     * @constructor
     */
    constructor(imagePath, x, y) {
        super().loadImage(imagePath);
        this.x = x;
        this.animate();
    }


    /**
     * Starts the animation loop for the cloud.
     * @returns {void}
     */
    animate() {
        this.moveInterval = setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);
    }
}
