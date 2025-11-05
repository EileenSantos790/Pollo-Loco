/**
 * BottleStatusBar class represents a visual status bar for bottles in the game.
 * Extends DrawableObject to provide rendering capabilities with different states
 * based on percentage values (0%, 20%, 40%, 60%, 80%, 100%).
 * 
 * @class BottleStatusBar
 * @extends DrawableObject
 */
class BottleStatusBar extends DrawableObject {

    IMAGES = [
        'components/img_pollo_loco/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png',
        'components/img_pollo_loco/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png',
        'components/img_pollo_loco/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png',
        'components/img_pollo_loco/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png',
        'components/img_pollo_loco/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png',
        'components/img_pollo_loco/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png',
    ];

    percentage = 0;

    /**
     * Creates an instance of BottleStatusbar.
     * Initializes the bottle status bar with default images, position, dimensions, and sets initial percentage to 0.
     * 
     * @constructor
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 40;
        this.y = 120;
        this.width = 200;
        this.height = 60;
        this.setPercentage(0);
    }


    /**
     * Sets the percentage value and updates the displayed image based on the percentage.
     * The method resolves the appropriate image index from the percentage and loads
     * the corresponding image from the image cache.
     * 
     * @param {number} percentage - The percentage value to set (typically 0-100)
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    
    /**
     * Resolves the appropriate image index based on the current percentage value.
     * Returns an index from 0 to 5 corresponding to different visual states.
     * 
     * @returns {number} Image index where:
     *   - 5: percentage == 100
     *   - 4: percentage >= 80 and < 100
     *   - 3: percentage >= 60 and < 80
     *   - 2: percentage >= 40 and < 60
     *   - 1: percentage >= 20 and < 40
     *   - 0: percentage < 20
     */
    resolveImageIndex() {
        if (this.percentage == 100) { return 5;
        } else if (this.percentage >= 80) { return 4;
        } else if (this.percentage >= 60) { return 3;
        } else if (this.percentage >= 40) { return 2;
        } else if (this.percentage >= 20) { return 1;
        } else { return 0; }
    }
}