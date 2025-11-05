class DrawableObject {
    img;
    imageCache = {};
    currentImageIndex = 0;
    x = 120;
    y = 280;
    height = 150;
    width = 100;


    /**
     * Loads an image from the specified path.
     * @param {string} path - The path to the image file.
     * @returns {void}
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }


    /**
     * Draws the object on the canvas.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     * @returns {void}
     */
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }


    /**
     * Loads multiple images from an array of paths.
     * @param {string[]} arr - The array of image paths.
     * @returns {void}
     */
    loadImages(arr) {
        arr.forEach(path => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }
}