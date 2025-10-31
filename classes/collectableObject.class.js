class CollectableObject extends MoveableObject {
    
    width = 80;
    height = 80;

    IMAGES_COINS = [
        'components/img_pollo_loco/img/8_coin/coin_1.png',
        'components/img_pollo_loco/img/8_coin/coin_2.png'
    ];

    IMAGES_BOTTLES = [
        'components/img_pollo_loco/img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'components/img_pollo_loco/img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ];

    constructor(type) {
        super();
        this.type = type;
        
        if (type === 'coin') {
            this.loadImage(this.IMAGES_COINS[0]);
            this.loadImages(this.IMAGES_COINS);
            
        } else if (type === 'bottle') {
            this.loadImage(this.IMAGES_BOTTLES[0]);
            this.loadImages(this.IMAGES_BOTTLES);
            this.width = 70;
            this.height = 70;
        }
        
        this.setRandomPosition();
        this.animate();
    }

    setRandomPosition() {
        this.x = 200 + Math.random() * 1800;
        
        if (this.type === 'coin') {
            this.y = 100 + Math.random() * 200;
        } else if (this.type === 'bottle') {
            this.y = 350;
        }
    }

    animate() {
        if (this.type === 'coin') {
            setInterval(() => {
                this.playAnimation(this.IMAGES_COINS);
            }, 300);
        } else if (this.type === 'bottle') {
            setInterval(() => {
                this.playAnimation(this.IMAGES_BOTTLES);
            }, 400);
        }
    }
}