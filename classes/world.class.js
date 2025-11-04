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
            this.checkBottleCollisions();
        }, 1000 / 60);
        
        setInterval(() => {
            this.checkThrowObjects();
        }, 100);
    }

    checkCollisions() {
        this.level.enemies.forEach((enemy) => {
            if (!this.character.isColliding(enemy) || enemy.isDying) {
                return;
            }

            if (enemy instanceof Chicken || enemy instanceof smallChicken) {
                const characterHitboxY = this.character.y + 120;
                const characterHitboxHeight = this.character.height - 140;
                const characterHitboxBottom = characterHitboxY + characterHitboxHeight;
                
                const enemyOffset = enemy instanceof smallChicken ? 4 : 10;
                const enemyHitboxY = enemy.y + enemyOffset;
                const enemyHitboxTop = enemyHitboxY;
                const wasDescending = typeof this.character.prevY === 'number' && this.character.prevY < this.character.y;
                const baseMargin = Math.floor(enemy.height * 0.3);
                const margin = enemy instanceof smallChicken
                    ? Math.max(16, Math.min(22, baseMargin))
                    : Math.max(12, Math.min(22, baseMargin));
                const isStomping = characterHitboxBottom <= (enemyHitboxTop + margin) && wasDescending;
                
                if (isStomping) {
                    this.character.speedY = 12;
                    enemy.die();
                    this.soundManager.playCrush();
                    setTimeout(() => {
                        const enemyIndex = this.level.enemies.indexOf(enemy);
                        if (enemyIndex > -1) {
                            this.level.enemies.splice(enemyIndex, 1);
                        }
                    }, 1500);
                    return;
                } else {
                    this.character.hit();
                    this.statusBar.setPercentage(this.character.energy);
                }
            } else {
                this.character.hit();
                this.statusBar.setPercentage(this.character.energy);
            }
        });

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

    checkBottleCollisions() {
        this.throwableObjects.forEach((bottle, bottleIndex) => {
            this.level.enemies.forEach((enemy, enemyIndex) => {
                if (bottle.isColliding(enemy) && !bottle.isSplashing) {
                    bottle.splash();
                    this.soundManager.playSound('glassBroken');
                    
                    setTimeout(() => {
                        const index = this.throwableObjects.indexOf(bottle);
                        if (index > -1) {
                            this.throwableObjects.splice(index, 1);
                        }
                    }, 600);
                    
                    if (enemy instanceof Endboss) {
                        enemy.hitByBottle();
                        this.soundManager.playSound('endbossHurt');
                        this.updateEndbossStatusBar(enemy);
                        if (enemy.isDead()) {
                            setTimeout(() => {
                                this.level.enemies.splice(enemyIndex, 1);
                                this.endbossStatusBar.hide();
                            }, 2000);
                        }
                    } else {
                        enemy.die();
                        setTimeout(() => {
                            this.level.enemies.splice(enemyIndex, 1);
                        }, 1000);
                    }
                }
            });
        });
    }

    updateEndbossStatusBar(endboss) {
        let remainingLives = 3 - endboss.hitCount;
        let healthPercentage;
        
        if (remainingLives === 3) {
            healthPercentage = 100;
        } else if (remainingLives === 2) {
            healthPercentage = 66.67;
        } else if (remainingLives === 1) {
            healthPercentage = 33.33;
        } else {
            healthPercentage = 0;
        }
        
        this.endbossStatusBar.setPercentage(healthPercentage);
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
        this.addObjectsToMap(this.level.clouds);
        this.ctx.translate(-this.camera_x, 0);
        this.addToMap(this.statusBar);
        this.addToMap(this.coinStatusBar);
        this.addToMap(this.bottleStatusBar);
        if (this.endbossStatusBar.isVisible) {
            this.addToMap(this.endbossStatusBar);
        }
        this.ctx.translate(this.camera_x, 0);
        this.addToMap(this.character);
        this.checkEndbossActivation();
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.collectableObjects);
        this.addObjectsToMap(this.throwableObjects);

        this.ctx.translate(-this.camera_x, 0);

        if (this.character.isDead() && gameState === 'playing' && !this.gameOverTriggered) {
            this.gameOverTriggered = true;
            setTimeout(() => {
                showGameOver();
            }, 1000);
            return;
        }

        if (this.checkEndbossDead() && gameState === 'playing' && !this.gameOverTriggered) {
            this.gameOverTriggered = true;
            setTimeout(() => {
                showWin();
            }, 1000);
            return;
        }

        requestAnimationFrame(() => this.draw());
    }

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

    checkEndbossDead() {
        return this.level.enemies.every(enemy => {
            if (enemy instanceof Endboss) {
                return enemy.isDead();
            }
            return true; 
        }) && this.level.enemies.some(enemy => enemy instanceof Endboss);
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
