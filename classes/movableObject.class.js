class MoveableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    coins = 0;
    bottles = 0;
    lastHit = 0;

    applyGravity() {
        setInterval(() => {
            const previousY = this.y;

            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;

                if (!this.isAboveGround() && this.speedY < 0) {
                    this.speedY = 0;
                }
            } else {
                this.speedY = 0;
            }

            this.prevY = previousY;
        }, 1000 / 25);
    }

    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        } else {
            return this.y < 130;
        }
    }

    isJumping() {
        return this.y < 130 && this.speedY < 0;
    }

    moveLeft() {
        this.x -= this.speed;
    }

    playAnimation(images) {
        let i = this.currentImageIndex % images.length;
        const path = images[i];
        this.img = this.imageCache[path];
        this.currentImageIndex++;
    }

    jump() {
        this.speedY = 30;
    }

    isColliding(mo) {
        let thisX = this.x;
        let thisY = this.y;
        let thisWidth = this.width;
        let thisHeight = this.height;
        
        let moX = mo.x;
        let moY = mo.y;
        let moWidth = mo.width;
        let moHeight = mo.height;
        
        if (this instanceof Character) {
            thisX += 30;
            thisY += 120;
            thisWidth -= 60;
            thisHeight -= 140;
        } else if (this instanceof smallChicken) {
            thisX += 4;
            thisY += 4;
            thisWidth -= 8;
            thisHeight -= 8;
        } else if (this instanceof Chicken || this instanceof Endboss) {
            thisX += 10;
            thisY += 10;
            thisWidth -= 20;
            thisHeight -= 20;
        } else if (this instanceof ThrowableObject) {
            thisX += 5;
            thisY += 5;
            thisWidth -= 10;
            thisHeight -= 10;
        }
        
        if (mo instanceof Character) {
            moX += 30;
            moY += 120;
            moWidth -= 60;
            moHeight -= 140;
        } else if (mo instanceof smallChicken) {
            moX += 4;
            moY += 4;
            moWidth -= 8;
            moHeight -= 8;
        } else if (mo instanceof Chicken || mo instanceof Endboss) {
            moX += 10;
            moY += 10;
            moWidth -= 20;
            moHeight -= 20;
        } else if (mo instanceof ThrowableObject) {
            moX += 5;
            moY += 5;
            moWidth -= 10;
            moHeight -= 10;
        }
        
        return thisX + thisWidth > moX &&
            thisY + thisHeight > moY &&
            thisX < moX + moWidth &&
            thisY < moY + moHeight;
    }

    hit() {
        this.energy -= 5;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    isDead() {
        return this.energy === 0;
    }

    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 1;
    }

    collectCoin() {
        this.coins++;
        
        // Coin Sound abspielen wenn es sich um den Character handelt
        if (this instanceof Character && this.coinSound) {
            this.coinSound.currentTime = 0; // Sound von Anfang starten
            this.coinSound.play().catch(e => {
                console.log('Coin sound konnte nicht abgespielt werden:', e);
            });
        }
    }

    getCoinPercentage() {
        return Math.min(this.coins * 10, 100);
    }

    collectBottle() {
        this.bottles++;
    }

    getBottlePercentage() {
        return Math.min(this.bottles * 10, 100);
    }
}
