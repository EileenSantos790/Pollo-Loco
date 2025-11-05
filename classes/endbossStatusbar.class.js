class EndbossStatusBar extends DrawableObject {

    IMAGES = [
        'components/img_pollo_loco/img/7_statusbars/2_statusbar_endboss/blue/blue0.png',
        'components/img_pollo_loco/img/7_statusbars/2_statusbar_endboss/blue/blue20.png',
        'components/img_pollo_loco/img/7_statusbars/2_statusbar_endboss/blue/blue40.png',
        'components/img_pollo_loco/img/7_statusbars/2_statusbar_endboss/blue/blue60.png',
        'components/img_pollo_loco/img/7_statusbars/2_statusbar_endboss/blue/blue80.png',
        'components/img_pollo_loco/img/7_statusbars/2_statusbar_endboss/blue/blue100.png',
    ];

    percentage = 100;
    isVisible = true;


    /**
     * Creates an instance of the EndbossStatusBar class.
     * @constructor
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 390;
        this.y = 8;
        this.width = 200;
        this.height = 60;
        this.setPercentage(100);
    }


    /**
     * Sets the percentage of the end boss's health.
     * @param {number} percentage - The health percentage to set.
     * @returns {void}
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }


    /**
     * Resolves the image index based on the current health percentage.
     * @returns {number} - The index of the image to display.
     */
    resolveImageIndex() {
        if (this.percentage >= 100) {
            return 5;
        } else if (this.percentage >= 60) {
            return 3;
        } else if (this.percentage >= 30) {
            return 1;
        } else {
            return 0;
        }
    }


    /**
     * Shows the status bar.
     * @returns {void}
     */
    show() {
        this.isVisible = true;
    }


    /**
     * Hides the status bar.
     * @returns {void}
     */
    hide() {
        this.isVisible = false;
    }
}