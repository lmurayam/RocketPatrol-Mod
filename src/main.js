/*
    Luke Murayama
    Rocket Patrol 2: Electric Boogaloo
    5 Hours
    
    Implement the 'FIRE' UI text from the original game (1)
    Implement the speed increase that happens after 30 seconds in the original game (1)
    Display the time remaining (in seconds) on the screen (3)
    Implement a new timing/scoring mechanism that adds time to the clock for successful hits (5)
    Implement mouse control for player movement and mouse click to fire (5)
    Use Phaser's particle emitter to create a particle explosion when the rocket hits the spaceship (5)
    Create a new enemy Spaceship type (w/ new artwork) that's smaller, moves faster, and is worth more points (5)

*/ 


let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [Menu, Play]
}

let game = new Phaser.Game(config);

// UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

let keyF,keyR,keyLEFT,keyRIGHT, keyUP,keyDOWN, mouseX, mouseClick;
let usingMouse = false;
