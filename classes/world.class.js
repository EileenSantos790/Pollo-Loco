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
    endbossStatusBar = new EndbossStatusBar();
    throwableObjects = [];
    soundManager = new SoundManager();
    gameOverTriggered = false;


    /**
     * Constructor for the World class.
     * @param {HTMLCanvasElement} canvas - The canvas element to draw on.
     * @param {Keyboard} keyboard - The keyboard input handler.
     */
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.run();
    }


    /**
     * Sets up the world.
     * @returns {void}
     */
    setWorld() {
        this.character.world = this;
    }


    /**
     * Starts the game loop.
     * @returns {void}
     */
    run() {
        setInterval(() => {
            this.checkCollisions();
            this.checkBottleCollisions();
        }, 1000 / 60);

        setInterval(() => {
            this.checkThrowObjects();
        }, 100);
    }


    /**
     * Checks for collisions between the character and enemies.
     * @returns {void}
     */
    checkCollisions() {
        this.checkEnemyCollisions();
        this.checkCollectableCollisions();
    }

    /**
     * Checks for collisions between the character and enemies.
     * @returns {void}
     */
    checkEnemyCollisions() {
        this.level.enemies.forEach((enemy) => {
            if (!this.character.isColliding(enemy) || enemy.isDying) { return; }
            if (enemy instanceof Chicken || enemy instanceof smallChicken) {
                this.handleChickenCollision(enemy);
            } else if (enemy instanceof Endboss) {
                this.handleEndbossBlock(enemy);
                this.character.hit();
                this.statusBar.setPercentage(this.character.energy);
            } else {
                this.character.hit();
                this.statusBar.setPercentage(this.character.energy);
            }
        });
    }

    /**
     * Handles collision with chicken enemies (stomp vs hit).
     * @param {Object} enemy - The chicken enemy to handle collision with.
     * @returns {void}
     */
    handleChickenCollision(enemy) {
        const characterHitboxY = this.character.y + 120;
        const characterHitboxHeight = this.character.height - 140;
        const characterHitboxBottom = characterHitboxY + characterHitboxHeight;
        const enemyOffset = enemy instanceof smallChicken ? 4 : 10;
        const enemyHitboxY = enemy.y + enemyOffset;
        const wasDescending = typeof this.character.prevY === 'number' && this.character.prevY < this.character.y;
        const baseMargin = Math.floor(enemy.height * 0.3);
        const margin = enemy instanceof smallChicken ? Math.max(16, Math.min(22, baseMargin)) : Math.max(12, Math.min(22, baseMargin));
        const isStomping = characterHitboxBottom <= (enemyHitboxY + margin) && wasDescending;

        if (isStomping) {
            this.performStomp(enemy);
        } else {
            this.character.hit();
            this.statusBar.setPercentage(this.character.energy);
        }
    }

    /**
     * Performs stomp action on enemy.
     * @param {Object} enemy - The enemy to stomp on.
     * @returns {void}
     */
    performStomp(enemy) {
        this.character.speedY = 12;
        enemy.die();
        this.soundManager.playCrush();
        setTimeout(() => {
            const enemyIndex = this.level.enemies.indexOf(enemy);
            if (enemyIndex > -1) {
                this.level.enemies.splice(enemyIndex, 1);
            }
        }, 1500);
    }

    /**
     * Blocks Pepe from crossing the Endboss by clamping his position to the boss boundary.
     * @param {Endboss} endboss
     */
    handleEndbossBlock(endboss) {
        const ch = this.character;
        const boss = endboss;
        const charHitbox = {x: ch.x + 30, y: ch.y + 120, w: ch.width - 60, h: ch.height - 140};
        const bossHitbox = {x: boss.x + 10, y: boss.y + 10, w: boss.width - 20, h: boss.height - 20};  
        const charCenter = charHitbox.x + charHitbox.w / 2;
        const bossCenter = bossHitbox.x + bossHitbox.w / 2;
        const buffer = 1;
        if (charCenter < bossCenter) { const bossLeft = bossHitbox.x; ch.x = (bossLeft - buffer) - (ch.width - 30);
        } else { const bossRight = bossHitbox.x + bossHitbox.w; ch.x = (bossRight + buffer) - 30; }
    }

    /**
     * Checks for collisions with collectable objects.
     * @returns {void}
     */
    checkCollectableCollisions() {
        this.level.collectableObjects.forEach((collectableObject, index) => {
            if (collectableObject.type === 'coin' && this.character.isColliding(collectableObject)) {
                this.character.collectCoin();
                this.coinStatusBar.setPercentage(this.character.getCoinPercentage());
                this.soundManager.playCoin();
                this.level.collectableObjects.splice(index, 1);
            } else if (collectableObject.type === 'bottle' && this.character.isColliding(collectableObject)) {
                this.character.collectBottle();
                this.bottleStatusBar.setPercentage(this.character.getBottlePercentage());
                this.level.collectableObjects.splice(index, 1);
            }
        });
    }


    /**
     * Checks for collisions between throwable objects (bottles) and enemies.
     * @returns {void}
     */
    checkBottleCollisions() {
        this.throwableObjects.forEach((bottle, bottleIndex) => {
            this.level.enemies.forEach((enemy, enemyIndex) => {
                if (bottle.isColliding(enemy) && !bottle.isSplashing) { bottle.splash(); this.soundManager.playSound('glassBroken');
                    setTimeout(() => { const index = this.throwableObjects.indexOf(bottle); if (index > -1) { this.throwableObjects.splice(index, 1); } }, 600);
                    if (enemy instanceof Endboss) { if (!enemy.isDying) { enemy.hitByBottle(); this.soundManager.playSound('endbossHurt'); this.updateEndbossStatusBar(enemy); }
                        if (enemy.isDead()) { setTimeout(() => { this.level.enemies.splice(enemyIndex, 1); this.endbossStatusBar.hide(); }, 2000); }
                    } else { enemy.die(); setTimeout(() => { this.level.enemies.splice(enemyIndex, 1); }, 1000); } 
                }
            });
            if (!bottle.isAboveGround() && !bottle.isSplashing) { bottle.splash(); this.soundManager.playSound('glassBroken'); setTimeout(() => { const index = this.throwableObjects.indexOf(bottle); if (index > -1) { this.throwableObjects.splice(index, 1); } }, 600); }
        });
    }


    /**
     * Updates the endboss status bar based on the endboss's current health.
     * @param {Endboss} endboss - The endboss instance to update the status bar for.
     * @returns {void}
     */
    updateEndbossStatusBar(endboss) {
        let remainingLives = 3 - endboss.hitCount;
        let healthPercentage;
        if (remainingLives === 3) { healthPercentage = 100;
        } else if (remainingLives === 2) { healthPercentage = 66.67;
        } else if (remainingLives === 1) { healthPercentage = 33.33;
        } else { healthPercentage = 0; }
        this.endbossStatusBar.setPercentage(healthPercentage);
    }


    /**
     * Checks for throwable object input and creates a new throwable object if the conditions are met.
     * @returns {void}
     */
    checkThrowObjects() {
        if (this.keyboard.D && this.character.canThrowBottle()) {
            this.character.stopLongIdleAnimation();
            let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100, this.character.otherDirection);
            this.throwableObjects.push(bottle);
            this.character.throwBottle();
            this.bottleStatusBar.setPercentage(this.character.getBottlePercentage());
        }
    }


    /**
     * Draws the game world, including all objects and the status bars.
     * @returns {void}
     */
    draw() {
        if (typeof gameState !== 'undefined' && gameState !== 'playing') { return; } 
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); this.ctx.translate(this.camera_x, 0); this.addObjectsToMap(this.level.backgroundObjects); this.addObjectsToMap(this.level.clouds); this.ctx.translate(-this.camera_x, 0);
        this.addToMap(this.statusBar); this.addToMap(this.coinStatusBar); this.addToMap(this.bottleStatusBar);
        if (this.endbossStatusBar.isVisible) { this.addToMap(this.endbossStatusBar); }
        this.ctx.translate(this.camera_x, 0); this.addToMap(this.character); this.checkEndbossActivation();
        this.addObjectsToMap(this.level.enemies); this.addObjectsToMap(this.level.collectableObjects); this.addObjectsToMap(this.throwableObjects);
        this.ctx.translate(-this.camera_x, 0);
        if (this.character.isDead() && gameState === 'playing' && !this.gameOverTriggered) {
            if (this.character.isDeathAnimationCompleted()) { this.gameOverTriggered = true; setTimeout(() => { showGameOver(); }, 500); return; }
        }
        if (this.checkEndbossDead() && gameState === 'playing' && !this.gameOverTriggered) { this.gameOverTriggered = true; setTimeout(() => { showWin(); }, 2000);}
        requestAnimationFrame(() => this.draw());
    }


    /**
     * Checks for endboss activation based on the player's position.
     * @returns {void}
     */
    checkEndbossActivation() {
        this.level.enemies.forEach(enemy => {
            if (enemy instanceof Endboss && !enemy.isActivated) {
                let endbossOnScreen = enemy.x < (-this.camera_x + 720);
                if (endbossOnScreen) {
                    enemy.activate();
                    this.endbossStatusBar.show();
                    this.soundManager.playSound('endbossAlert');
                }
            }
        });
    }


    /**
    * Checks if the endboss is dead.
    * @returns {boolean}
    */
    checkEndbossDead() {
        return this.level.enemies.every(enemy => {
            if (enemy instanceof Endboss) {
                return enemy.isDead();
            }
            return true;
        }) && this.level.enemies.some(enemy => enemy instanceof Endboss);
    }


    /**
    * Adds multiple objects to the map.
    * @param {Array} objects - The objects to add.
    * @returns {void}
    */
    addObjectsToMap(objects) {
        objects.forEach((o) => {
            this.addToMap(o);
        });
    }


    /**
    * Adds an object to the map.
    * @param {Object} mo - The object to add.
    * @returns {void}
    */
    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
            this.flipImageBack(mo);
        } else {
            mo.draw(this.ctx);
        }
    }


    /**
    * Flips the image of the object horizontally.
    * @param {Object} mo - The object to flip.
    * @returns {void}
    */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.scale(-1, 1);
        this.ctx.drawImage(mo.img, -mo.x - mo.width, mo.y, mo.width, mo.height);
        this.ctx.restore();
    }


    /**
    * Flips the image of the object back to its original orientation.
    * @param {Object} mo - The object to flip back.
    * @returns {void}
    */
    flipImageBack(mo) {
        this.ctx.restore();
    }

}
