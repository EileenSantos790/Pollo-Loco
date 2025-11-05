class CoinStatusBar extends DrawableObject {

    IMAGES = [
        'components/img_pollo_loco/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png',
        'components/img_pollo_loco/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png',
        'components/img_pollo_loco/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png',
        'components/img_pollo_loco/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png',
        'components/img_pollo_loco/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png',
        'components/img_pollo_loco/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png',
    ];

    percentage = 0;

    
    /**
     * Creates a new CoinStatusbar instance.
     * Initializes the coin status bar with default position, dimensions, and percentage.
     * Loads the required images and sets the initial coin count to 0.
     * 
     * @constructor
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 40;
        this.y = 60;
        this.width = 200;
        this.height = 60;
        this.setPercentage(0);
    }


    /**
    * Sets the percentage of the coin status bar.
    * @param {number} percentage - The new percentage value.
    * @returns {void}
    */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }


    /**
    * Resolves the image index based on the current percentage.
    * @returns {number} - The index of the image to be displayed.
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