var AM = new AssetManager();

function Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
    this.iterations = 0;
    this.currFrame = 0;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y, row, animating) {
    this.animating = animating;
    this.elapsedTime += tick;
    if (this.loop) {
        if (this.isDone()) {
            this.elapsedTime = 0;
        }
    }

    if(animating) {
      this.currFrame = this.currentFrame();
    } else {
      this.currFrame = 0;
    }

    var xindex = 0;
    var yindex = 0;
    this.row = row;
    xindex = this.currFrame % this.sheetWidth;
    yindex = Math.floor(this.currFrame / this.sheetWidth);

    ctx.drawImage(this.spriteSheet,
                 xindex * this.frameWidth, yindex * this.frameHeight + this.row * this.frameHeight,  // source from sheet
                 this.frameWidth, this.frameHeight,
                 x, y,
                 this.frameWidth * this.scale,
                 this.frameHeight * this.scale);
}


// Animation.prototype.drawFrame = function (tick, ctx, x, y, row) {
//     this.elapsedTime += tick;
//     if (this.isDone()) {
//         if (this.loop) this.elapsedTime = 0;
//     }
//     var frame = this.currentFrame();
//     var xindex = 0;
//     var yindex = 0;
//     this.row = row;
//     xindex = frame % this.sheetWidth;
//     yindex = Math.floor(frame / this.sheetWidth);

//     ctx.drawImage(this.spriteSheet,
//                  xindex * this.frameWidth, yindex * this.frameHeight + (this.row - 1) * this.frameHeight,  // source from sheet
//                  this.frameWidth, this.frameHeight,
//                  x, y,
//                  this.frameWidth * this.scale,
//                  this.frameHeight * this.scale);
// }

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

Animation.prototype.setScale = function(scale) {
    this.scale = scale;
}

Animation.prototype.setFrames = function (frames) {
  this.frames = frames;
  this.sheetWidth = frames;
  this.totalTime = this.frameDuration * frames;

}
Animation.prototype.drawSpecificFrame = function (ctx, x, y , row, col) {

  ctx.drawImage(this.spriteSheet,
               col * this.frameWidth,
               row * this.frameHeight,  // source from sheet
               this.frameWidth, this.frameHeight,
               x, y,
               this.frameWidth * this.scale,
               this.frameHeight * this.scale);
}

// function Background(game, spritesheet) {
//     this.x = 0;
//     this.y = 0;
//     this.spritesheet = spritesheet;
//     this.game = game;
//     this.ctx = game.ctx;
// };

// Background.prototype.draw = function () {
//     // console.log("width" + this.game.worldWidth + "height" + this.game.worldHeight);
//     this.ctx.drawImage(this.spritesheet,
//                    this.x, this.y);
// };

// Background.prototype.update = function () {

// };

// function tronMainCharacter(game, spritesheet) {
//     this.animation = new Animation(spritesheet, 64, 64, 9, 0.1, 9, true, 1 );
//     this.speed = 100;
//     this.ctx = game.ctx;
//     this.x = 300;
//     this.y = 2030;
//     this.game = game;
//     this.row = 12;
//     this.width = 64;
//     this.height = 64;
//     this.step = game.STEP;
//     this.camera = game.camera;
//     // this.game.camera.follow();
// }


function Platform(boundingRect) {
  this.boundingRect = boundingRect;
  this.isCurrent = false;
}

// AM.queueDownload("./img/backgrounds/town_background.jpg");
AM.queueDownload("./img/backgrounds/finished level 1.png");
//main character image
AM.queueDownload("./img/characters/TronWithBow.png")
AM.queueDownload("./img/extras/chest.png");
AM.queueDownload("./img/characters/redhead.png");
AM.queueDownload("./img/characters/skeleton.png");
AM.queueDownload("./img/arrow_skeleton.png");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    // gameEngine.init(ctx, AM.getAsset("./img/backgrounds/town_background.jpg"));
    gameEngine.init(ctx, AM.getAsset("./img/backgrounds/finished level 1.png"));

    var startingPlatform = new Platform(new BoundingRect(0, 2067, 260, 63, gameEngine));
    var redhead1SP = new Platform(new BoundingRect(388, 1940, 503, 187, gameEngine));
    var skull1SP = new Platform(new BoundingRect(388, 1940, 503, 187, gameEngine));
    var redhead2SP = new Platform(new BoundingRect(3045, 2067, 1558, 61, gameEngine));
    var redhead3SP = new Platform(new BoundingRect(4356, 1589, 726, 52, gameEngine));
    var redhead4SP = new Platform(new BoundingRect(470, 1140, 1827, 23, gameEngine));
    startingPlatform.isCurrent = true;

    gameEngine.addPlatform(startingPlatform);
    gameEngine.addPlatform(redhead1SP); // redhead 1
    gameEngine.addPlatform(redhead2SP); // redhead 2
    gameEngine.addPlatform(redhead3SP);
    gameEngine.addPlatform(redhead4SP);
    gameEngine.addPlatform(new Platform(new BoundingRect(260, 2005, 130, 65, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(1140, 1940, 606, 187, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(1755, 2004, 768, 125, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(1123, 1810, 26, 318, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(1730, 1810, 26, 208, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(5572, 1940, 55, 55, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(5829, 1940, 55, 55, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(6118, 1940, 282, 55, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(3589, 1877, 285, 50, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(3717, 1813, 138, 70, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(3845, 1749, 308, 179, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(4101, 1684, 308, 149, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(4407, 1780, 68, 53, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(4356, 1635, 54, 158, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(5060, 1460, 437, 53, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(5060, 1508, 55, 196, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(5109, 1652, 103, 55, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(5445, 1332, 245, 53, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(5445, 1376, 54, 138, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(5636, 1204, 764, 51, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(5636, 1250, 54, 136, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(6341, 1747, 59, 53, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(6341, 1044, 59, 53, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(2949, 1492, 246, 52, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(3492, 1492, 694, 54, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(3492, 1542, 471, 67, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(3811, 1107, 1109, 245, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(4868, 1044, 630, 51, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(4868, 1090, 436, 134, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(0, 1556, 570, 54, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(0, 1427, 27, 137, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(997, 1557, 54, 54, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(1189, 1492, 54, 54, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(1382, 1429, 54, 54, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(2149, 1365, 118, 52, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(2019, 1160, 295, 31, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(2277, 1045, 374, 52, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(2277, 1091, 53, 101, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(470, 1160, 1092, 31, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(0, 1076, 474, 53, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(422, 1096, 52, 95, gameEngine)));

    // temporary for testing
    gameEngine.addPlatform(new Platform(new BoundingRect(2500, 2004, 440, 55, gameEngine)));


    var artemis = new  OrcBowman(gameEngine, AM.getAsset("./img/characters/TronWithBow.png"));
    artemis.currentPlatform = startingPlatform;
    gameEngine.addEntity(artemis);

    var redhead1 = new Redhead(gameEngine, 630, 1940, AM.getAsset("./img/characters/redhead.png"));
    var redheadAdjust = redhead1.yAdjust + redhead1.boundingRect.height;
    redhead1.y = 1940 - redheadAdjust;
    redhead1.currentPlatform = redhead1SP;
    gameEngine.addEntity(redhead1);

    var redhead2 = new Redhead(gameEngine, 3950, 2067, AM.getAsset("./img/characters/redhead.png"));
    redhead2.y = 2067 - redheadAdjust;
    redhead2.currentPlatform = redhead2SP;
    gameEngine.addEntity(redhead2);

    var redhead3 = new Redhead(gameEngine, 4730, 1589, AM.getAsset("./img/characters/redhead.png"));
    redhead3.y = 1589 - redheadAdjust;
    redhead3.currentPlatform = redhead3SP;
    gameEngine.addEntity(redhead3);

    var redhead4 = new Redhead(gameEngine, 1350, 1140, AM.getAsset("./img/characters/redhead.png"));
    redhead4.y = 1140 - redheadAdjust;
    redhead4.currentPlatform = redhead4SP;
    gameEngine.addEntity(redhead4);

    var skeleton = new SkeletonShooter(gameEngine, 650, 1940, AM.getAsset("./img/characters/skeleton.png"));
    skeleton.y = 1940 - redheadAdjust;
    skeleton.currentPlatform = skull1SP;
    gameEngine.addEntity(skeleton);


    // gameEngine.addEntity(new GameEngine.Camera(0, 0, gameEngine.surfaceWidth,
    //                                                  gameEngine.surfaceHeight,
    //                                                  gameEngine.worldWidth,
    //                                                  gameEngine.worldHeight,
    //                                                  AM.getAsset("./img/town_background.jpg")));
    // gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/town_background.jpg")));
    // gameEngine.addEntity(new Guy(gameEngine, AM.getAsset("./img/guy.jpg")));
    // gameEngine.addEntity(new tronMainCharacter(gameEngine, AM.getAsset("./img/characters/TronWithBow.png")));
    gameEngine.addEntity(new Chest(gameEngine, AM.getAsset("./img/extras/chest.png"), 6300, 1387, 2));
    gameEngine.addEntity(new Chest(gameEngine, AM.getAsset("./img/extras/chest.png"), 80, 1482, 2));
    gameEngine.addEntity(new Chest(gameEngine, AM.getAsset("./img/extras/chest.png"), 35, 462, 1));
    gameEngine.addEntity(new Chest(gameEngine, AM.getAsset("./img/extras/chest.png"), 6320, 493, 1));
    gameEngine.addEntity(new Chest(gameEngine, AM.getAsset("./img/extras/chest.png"), 770, 1905, 1));


    // gameEngine.addEntity(new Chest(gameEngine, AM.getAsset("./img/extras/chest.png"), 6320, 493, 1));
    // var redhead = new Redhead(gameEngine, 720, 1877,  AM.getAsset("./img/characters/redhead.png"), ctx);
    // redhead.paceing = true;
    // redhead.jumping = false;
    // gameEngine.addEntity(redhead);

    myAudio = new Audio('./bgm/DrinkUpThere_sMore.mp3');
    myAudio.addEventListener('ended', function() {
      this.currentTime = 0;
      this.play();
    }, false);
    myAudio.play();



    gameEngine.follow();
    gameEngine.start();

    // var camera = new GameEngine.Camera(0, 0, gameEngine.surfaceWidth,
    //                                      gameEngine.surfaceHeight,
    //                                      gameEngine.worldWidth,
    //                                      gameEngine.worldHeight);

    console.log("All Done!");
});
