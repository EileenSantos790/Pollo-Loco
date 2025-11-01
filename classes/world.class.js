class World {

    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    statusBar = new StatusBar();

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.checkCollisions();
    }

    setWorld() {
        this.character.world = this;
    }

    checkCollisions() {
        setInterval(() => {
            this.level.enemies.forEach(enemy => {
                if (this.character.isColliding(enemy)) {
                    this.character.hit();
                    this.statusBar.setPercentage(this.character.energy);
                }
            });
        }, 200);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.level.backgroundObjects);
        this.ctx.translate(-this.camera_x, 0);
        this.addToMap(this.statusBar);
        this.ctx.translate(this.camera_x, 0);
        this.addToMap(this.character);
        this.checkEndbossActivation();
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.collectableObjects);

        this.ctx.translate(-this.camera_x, 0);

        requestAnimationFrame(() => this.draw());
    }

    checkEndbossActivation() {
        this.level.enemies.forEach(enemy => {
            if (enemy instanceof Endboss && !enemy.isActivated) {
                let endbossOnScreen = enemy.x < (-this.camera_x + 720);
                if (endbossOnScreen) {
                    enemy.activate();
                }
            }
        });
    }

    addObjectsToMap(objects) {
        objects.forEach((o) => {
            this.addToMap(o);
        });
    }

    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
            this.flipImageBack(mo);
        } else {
            mo.draw(this.ctx);
        }

        mo.drawFrame(this.ctx);
    }

    flipImage(mo) {
        this.ctx.save();
        this.ctx.scale(-1, 1);
        this.ctx.drawImage(mo.img, -mo.x - mo.width, mo.y, mo.width, mo.height);
        this.ctx.restore();
    }

    flipImageBack(mo) {
        this.ctx.restore();
    }

}
