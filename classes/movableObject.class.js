class MoveableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    coins = 0;
    bottles = 0;
    lastHit = 0;


    /**
     * Applies gravity to the object.
     * @returns {void}
     */
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


    /**
     * Checks if the object is above ground.
     * @returns {boolean} - True if the object is above ground, false otherwise.
     */
    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return this.y < 350;
        } else {
            return this.y < 130;
        }
    }


    /**
     * Checks if the object is jumping.
     * @returns {boolean} - True if the object is jumping, false otherwise.
     */
    isJumping() {
        return this.y < 130 && this.speedY < 0;
    }


    /**
     * Moves the object to the left.
     * @returns {void}
     */
    moveLeft() {
        this.x -= this.speed;
    }


    /**
     * Plays the animation for the object.
     * @param {Array} images - The array of image paths for the animation.
     * @returns {void}
     */
    playAnimation(images) {
        let i = this.currentImageIndex % images.length;
        const path = images[i];
        this.img = this.imageCache[path];
        this.currentImageIndex++;
    }


    /**
     * Makes the object jump.
     * @returns {void}
     */
    jump() {
        this.speedY = 30;
    }


    /**
     * Checks for collision with another movable object.
     * @param {MoveableObject} mo - The other movable object to check for collision.
     * @returns {boolean} - True if the objects are colliding, false otherwise.
     */
    isColliding(mo) {
        const thisBounds = this.getAdjustedBounds();
        const moBounds = this.getAdjustedBoundsForObject(mo);
        
        return thisBounds.x + thisBounds.width > moBounds.x && 
               thisBounds.y + thisBounds.height > moBounds.y && 
               thisBounds.x < moBounds.x + moBounds.width && 
               thisBounds.y < moBounds.y + moBounds.height;
    }

    /**
     * Gets adjusted bounds for this object.
     * @returns {Object} - Object with x, y, width, height properties.
     */
    getAdjustedBounds() {
        return this.getAdjustedBoundsForObject(this);
    }

    /**
     * Gets adjusted bounds for a given object.
     * @param {MoveableObject} obj - The object to get bounds for.
     * @returns {Object} - Object with x, y, width, height properties.
     */
    getAdjustedBoundsForObject(obj) {
        let bounds = { x: obj.x, y: obj.y, width: obj.width, height: obj.height };
        if (obj instanceof Character) {
            this.adjustCharacterBounds(bounds);
        } else if (obj instanceof smallChicken) {
            this.adjustSmallChickenBounds(bounds);
        } else if (obj instanceof Chicken || obj instanceof Endboss) {
            this.adjustChickenBounds(bounds);
        } else if (obj instanceof ThrowableObject) {
            this.adjustThrowableBounds(bounds);
        } else if (obj instanceof CollectableObject) {
            this.adjustCollectableBounds(bounds, obj);
        }
        return bounds;
    }

    /**
     * Adjusts bounds for Character objects.
     * @param {Object} bounds - Bounds object to modify.
     */
    adjustCharacterBounds(bounds) {
        bounds.x += 30;
        bounds.y += 120;
        bounds.width -= 60;
        bounds.height -= 140;
    }

    /**
     * Adjusts bounds for small chicken objects.
     * @param {Object} bounds - Bounds object to modify.
     */
    adjustSmallChickenBounds(bounds) {
        bounds.x += 4;
        bounds.y += 4;
        bounds.width -= 8;
        bounds.height -= 8;
    }

    /**
     * Adjusts bounds for chicken objects.
     * @param {Object} bounds - Bounds object to modify.
     */
    adjustChickenBounds(bounds) {
        bounds.x += 10;
        bounds.y += 10;
        bounds.width -= 20;
        bounds.height -= 20;
    }

    /**
     * Adjusts bounds for throwable objects.
     * @param {Object} bounds - Bounds object to modify.
     */
    adjustThrowableBounds(bounds) {
        bounds.x += 5;
        bounds.y += 5;
        bounds.width -= 10;
        bounds.height -= 10;
    }

    /**
     * Adjusts bounds for collectable objects.
     * @param {Object} bounds - Bounds object to modify.
     * @param {CollectableObject} obj - The collectable object.
     */
    adjustCollectableBounds(bounds, obj) {
        if (obj.type === 'coin') {
            bounds.x += 25; bounds.y += 25; bounds.width -= 50; bounds.height -= 50;
        } else if (obj.type === 'bottle') {
            bounds.x += 28; bounds.y += 28; bounds.width -= 56; bounds.height -= 56;
        } else {
            bounds.x += 22; bounds.y += 22; bounds.width -= 44; bounds.height -= 44;
        }
    }


    /**
     * Reduces the energy of the object when it is hit.
     * @param {number} amount - The amount of energy to reduce.
     * @returns {void}
     */
    hit(amount = 20) {
        if (this.isHurt()) { return; } 
        if (this instanceof Character) {
            try { this.stopLongIdleAnimation(); this.idleTimer = 0; } catch (e) { console.log(e); }
        }
        this.energy -= amount;
        if (this.energy < 0) {
            this.energy = 0;
        }
        this.lastHit = new Date().getTime();
    }


    /**
     * Checks if the object is dead.
     * @returns {boolean} - True if the object is dead, false otherwise.
     */
    isDead() {
        return this.energy === 0;
    }


    /**
     * Checks if the object is hurt.
     * @returns {boolean} - True if the object is hurt, false otherwise.
     */
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 1;
    }


    /**
     * Collects a coin.
     * @returns {void}
     */
    collectCoin() {
        this.coins++;
    }


    /**
     * Gets the percentage of coins collected.
     * @returns {number} - The percentage of coins collected (0-100).
     */
    getCoinPercentage() {
        return Math.min(this.coins * 10, 100);
    }


    /**
     * Collects a bottle.
     * @returns {void}
     */
    collectBottle() {
        this.bottles++;
    }


    /**
     * Gets the percentage of bottles collected.
     * @returns {number} - The percentage of bottles collected (0-100).
     */
    getBottlePercentage() {
        return Math.min(this.bottles * 10, 100);
    }
}
