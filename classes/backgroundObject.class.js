/**
 * Represents a background object that extends MoveableObject functionality.
 * Background objects are typically used for scenery elements like clouds, mountains, or buildings.
 * 
 * @class BackgroundObject
 * @extends MoveableObject
 */
class BackgroundObject extends MoveableObject {

    width = 720;
    height = 480;

    constructor(imagePath, x, y) {
        super().loadImage(imagePath);
        this.x = x;
        this.y = 480 - this.height;
    }
}