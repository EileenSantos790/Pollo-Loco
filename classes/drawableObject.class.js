class DrawableObject {
    img;
    imageCache = {};
    currentImageIndex = 0;
    x = 120;
    y = 280;
    height = 150;
    width = 100;

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    loadImages(arr) {
        arr.forEach(path => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    drawFrame(ctx) {

        if (this instanceof Character || this instanceof Chicken || this instanceof smallChicken || this instanceof Endboss) {
            ctx.beginPath();
            ctx.lineWidth = '5';
            ctx.strokeStyle = 'red';

            if (this instanceof Character) {
                ctx.rect(this.x + 30, this.y + 120, this.width - 60, this.height - 140);
            } else {
                ctx.rect(this.x + 10, this.y + 10, this.width - 20, this.height - 20);
            }
            ctx.stroke();
        }
    }
}