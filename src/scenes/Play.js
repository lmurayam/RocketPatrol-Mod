class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('supership', './assets/supership.png');
        this.load.image('starfield', './assets/starfield.png');
        this.load.image('particle', './assets/particle.png');

        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }

    create(){
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        mouseClick = false;
        this.input.on('pointerdown', () => {mouseClick = true;});
        this.input.on('pointerup', () => {mouseClick = false;});

        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);

        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);

        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5,0);

        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 10).setOrigin(0,0);
        this.ship04 = new Supership(this, game.config.width, borderUISize*6 + borderPadding*16, 'supership', 0, 50).setOrigin(0,0);
        
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        this.p1Score = 0;
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);

        this.timeCounter = this.add.text(game.config.width - borderUISize - borderPadding - scoreConfig.fixedWidth, borderUISize + borderPadding*2, game.settings.gameTimer/1000, scoreConfig);

        this.timeElapsed = 0;
        this.timeMax = game.settings.gameTimer/1000;
        this.time.addEvent({
            delay: 1000,
            callback: function(){
                if (this.timeElapsed<this.timeMax){
                    this.timeElapsed++; 
                    this.timeCounter.text = this.timeMax - this.timeElapsed; 
                }
                if (this.timeElapsed%30==0){ //speed up every 30 seconds
                    console.log("speed up");
                    this.ship01.moveSpeed += 2
                    this.ship02.moveSpeed += 2
                    this.ship03.moveSpeed += 2
                }
                if (this.timeElapsed==this.timeMax){
                    scoreConfig.fixedWidth = 0;
                    this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
                    this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu', scoreConfig).setOrigin(0.5);
                    this.gameOver = true;
                }
            },
            callbackScope: this,
            loop: true,
        })

        
        scoreConfig.align = 'center'
        this.fireText = this.add.text(game.config.width/2 - scoreConfig.fixedWidth/2, borderUISize + borderPadding*2, "FIRE", scoreConfig);
        this.fireText.setVisible(false);

        this.gameOver = false;
    }

    update() {
        mouseX = game.input.mousePointer.x;
        this.p1Rocket.isFiring ? this.fireText.setVisible(true) : this.fireText.setVisible(false);

        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        if (!this.gameOver){
            this.p1Rocket.update();
        
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();
            this.ship04.update();
        }

        this.starfield.tilePositionX -= 4;

        if(this.checkCollision(this.p1Rocket, this.ship04)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship04);
            this.ship04.moveSpeed = 0
        }
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
    }

    checkCollision(rocket,ship){
        if (rocket.x < ship.x + ship.width && rocket.x + rocket.width > ship.x && rocket.y < ship.y + ship.height && rocket.height + rocket.y > ship. y) {
            return true;
        } 
        else {
            return false;
        }
    }
    shipExplode(ship){
        ship.alpha = 0;
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        let fragments = this.add.particles(ship.x, ship.y, 'particle', {
            speed: 100,
            lifespan: 5000,
            gravityY: 500,
            emitting: false
        });
        fragments.explode(16);
        boom.anims.play('explode'); 
        boom.on('animationcomplete', () => { 
            ship.reset();
            ship.alpha = 1;
            boom.destroy();
        }); 
        this.p1Score += ship.points;
        this.timeMax += (ship.points/10)*2;
        this.scoreLeft.text = this.p1Score;

        this.sound.play('sfx_explosion');
    }
}