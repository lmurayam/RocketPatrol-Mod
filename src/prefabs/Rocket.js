class Rocket extends Phaser.GameObjects.Sprite{
    constructor(scene,x,y,texture,frame){
        super(scene,x,y,texture,frame);

        scene.add.existing(this);
        this.isFiring = false;
        this.moveSpeed = 2;

        this.sfxRocket = scene.sound.add('sfx_rocket');
    }

    update(){
        if(!this.isFiring){
            if(usingMouse){
                this.x = Phaser.Math.Clamp(mouseX, borderUISize + this.width, game.config.width - borderPadding - this.width);
            }
            else{
                if(keyLEFT.isDown && this.x >= borderUISize + this.width){
                    this.x -= this.moveSpeed;
                } else if (keyRIGHT.isDown && this.x <= game.config.width - borderPadding - this.width){
                    this.x += this.moveSpeed;
                }
            }  
        }
        if(((Phaser.Input.Keyboard.JustDown(keyF)&&!usingMouse)||(mouseClick&&usingMouse))&& !this.isFiring){
            this.isFiring = true;
            this.sfxRocket.play();
        }
        if(this.isFiring && this.y >= borderUISize * 3 + borderPadding){
            this.y -= this.moveSpeed;
        }
        if (this.y <= borderUISize * 3 + borderPadding){
            this.isFiring = false;
            this.y = game.config.height - borderUISize - borderPadding;
        }
    }

    reset(){
        this.isFiring = false;
        this.y = game.config.height - borderUISize - borderPadding;
    }
}