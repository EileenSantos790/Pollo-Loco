class World {

    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    statusBar = new StatusBar();
    coinStatusBar = new CoinStatusBar();
    bottleStatusBar = new BottleStatusBar();
    throwableObjects = [];

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.run();
    }

    setWorld() {
        this.character.world = this;
    }

    run() {
        setInterval(() => {
            this.checkCollisions();
        }, 200);
        
        setInterval(() => {
            this.checkThrowObjects();
        }, 100);
    }

    checkCollisions() {
        this.level.enemies.forEach(enemy => {
            if (this.character.isColliding(enemy)) {
                this.character.hit();
                this.statusBar.setPercentage(this.character.energy);
            }
        });

        this.level.collectableObjects.forEach((collectableObject, index) => {
            if (collectableObject.type === 'coin' && this.character.isColliding(collectableObject)) {
                this.character.collectCoin();
                this.coinStatusBar.setPercentage(this.character.getCoinPercentage());
                this.level.collectableObjects.splice(index, 1);
            } else if (collectableObject.type === 'bottle' && this.character.isColliding(collectableObject)) {
                let isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
                if (isTouchDevice || this.keyboard.UP) {
                    this.character.collectBottle();
                    this.bottleStatusBar.setPercentage(this.character.getBottlePercentage());
                    this.level.collectableObjects.splice(index, 1);
                }
            }
        });
    }

    checkThrowObjects() {
        if (this.keyboard.D && this.character.canThrowBottle()) {
            let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100, this.character.otherDirection);
            this.throwableObjects.push(bottle);
            this.character.throwBottle();
            this.bottleStatusBar.setPercentage(this.character.getBottlePercentage());
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.level.backgroundObjects);
        this.ctx.translate(-this.camera_x, 0);
        this.addToMap(this.statusBar);
        this.addToMap(this.coinStatusBar);
        this.addToMap(this.bottleStatusBar);
        this.ctx.translate(this.camera_x, 0);
        this.addToMap(this.character);
        this.checkEndbossActivation();
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.collectableObjects);
        this.addObjectsToMap(this.throwableObjects);

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
