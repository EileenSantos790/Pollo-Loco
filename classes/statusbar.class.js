class StatusBar extends DrawableObject {

    IMAGES = [
        'components/img_pollo_loco/img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png',
        'components/img_pollo_loco/img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png',
        'components/img_pollo_loco/img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png',
        'components/img_pollo_loco/img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png',
        'components/img_pollo_loco/img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png',
        'components/img_pollo_loco/img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png',
    ];

    percentage = 100;


    /**
     * Constructor for the StatusBar class.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 40;
        this.y = 0;
        this.width = 200;
        this.height = 60;
        this.setPercentage(100);
    }


    /**
     * Sets the percentage of the status bar.
     * @param {number} percentage - The percentage to set (0 to 100).
     * @returns {void}
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }


    /**
     * Resolves the image index based on the current percentage.
     * @returns {number} - The index of the image to use.
     */
    resolveImageIndex() {
        if (this.percentage == 100) {
            return 5;
        } else if (this.percentage >= 80) {
            return 4;
        } else if (this.percentage >= 60) {
            return 3;
        } else if (this.percentage >= 40) {
            return 2;
        } else if (this.percentage >= 20) {
            return 1;
        } else {
            return 0;
        }
    }
}