/**
 * Represents a level in the game.
 * @class
 */
class Level {
    enemies;
    clouds;
    backgroundObjects;
    collectableObjects;
    level_end_x = 2200;

    
    /**
     * Creates an instance of the Level class.
     * @constructor
     * @param {Array} enemies - The enemies in the level.
     * @param {Array} clouds - The clouds in the level.
     * @param {Array} backgroundObjects - The background objects in the level.
     * @param {Array} collectableObjects - The collectable objects in the level.
     */
    constructor(enemies, clouds, backgroundObjects, collectableObjects) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.collectableObjects = collectableObjects || [];
    }
}