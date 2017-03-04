var AM = new AssetManager();

function getRand(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}



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



// basic class for the platforms
function Platform(boundingRect) {
  this.boundingRect = boundingRect;
  this.isCurrent = false;
}

function MovingPlatform(game, x, y, boundingRect, spritesheet, range, direction, speed, size) {
  this.movingAnimation = new Animation(spritesheet, size, 32, 1, 0.1, 1, true, 1);
  this.boundingRect = boundingRect;
  this.isCurrent = false;
  this.spritesheet = spritesheet;
  this.y = y;
  this.game = game;
  this.range = range;
  this.negRange = 0 - range;
  this.x = x;
  this.startX = x;
  this.startY = y;
  if(direction) {
    this.leftFaceing = true;
    this.rightFaceing = false;
  } else {
    this.leftFaceing = false;
    this.rightFaceing = true;
  }

  this.ctx = game.ctx;
  this.camera = game.camera;
  this.speed = speed;
  this.boundingRect = boundingRect;
}

MovingPlatform.prototype.draw = function () {
    // console.log("width" + this.game.worldWidth + "height" + this.game.worldHeight);
    this.movingAnimation.drawFrame(this.game.clockTick,
    this.ctx,
      this.x - this.camera.xView,
      this.y - this.camera.yView,
       0, true);
};

MovingPlatform.prototype.update = function () {
  this.cX = this.x - this.camera.xView;
  this.cY = this.y - this.camera.yView;
  this.boundingRect.updateLoc(this.x, this.y);
  if(this.startX - this.x >= this.range) {
    this.leftFaceing = false;
    this.rightFaceing = true;
  }
  if(this.startX - this.x <= this.negRange) {
    this.leftFaceing = true;
    this.rightFaceing = false;
  }
  this.move();
};

MovingPlatform.prototype.getX = function() {
  return this.x;
}

MovingPlatform.prototype.move = function() {

  if (this.leftFaceing) {
      this.moveLeft()
  } else if (this.rightFaceing) {
      this.moveRight()
  }
}

MovingPlatform.prototype.moveRight = function() {
    this.x += this.game.clockTick * this.speed;
}

MovingPlatform.prototype.moveLeft = function() {
    this.x -= this.game.clockTick * this.speed;
}





// AM.queueDownload("./img/backgrounds/town_background.jpg");
AM.queueDownload("./img/backgrounds/level1nofloatingplatforms.png");
//main character image
AM.queueDownload("./img/characters/TronWithBow.png");
AM.queueDownload("./img/extras/chest.png");
AM.queueDownload("./img/characters/redhead.png");
AM.queueDownload("./img/characters/skeleton.png");
AM.queueDownload("./img/arrow_skeleton.png");
AM.queueDownload("./img/extras/x2platform.png");
AM.queueDownload("./img/extras/x4platform.png");
AM.queueDownload("./img/characters/ArtemisAttack.png");
AM.queueDownload("./img/characters/Princess.png");
AM.queueDownload("./img/characters/dragon_fly_right.png");
AM.queueDownload("./img/characters/dragon_fly_left.png");
AM.queueDownload("./img/extras/coin.png");
AM.queueDownload("./img/characters/dragon_attack_right.png");
AM.queueDownload("./img/characters/dragon_attack_left.png");
AM.queueDownload("./img/characters/dragon_lookleft.png");
AM.queueDownload("./img/characters/dragon_lookright.png");
AM.queueDownload("./img/extras/character_shield.png");


AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    // gameEngine.init(ctx, AM.getAsset("./img/backgrounds/town_background.jpg"));
    gameEngine.init(ctx, AM.getAsset("./img/backgrounds/level1nofloatingplatforms.png"));

    var startingPlatform = new Platform(new BoundingRect(0, 2067, 260, 63, gameEngine));
    startingPlatform.isCurrent = true;

    //size 2 moving platforms
    gameEngine.addMovingPlatform(new MovingPlatform(gameEngine, 2752, 2006, new BoundingRect(2752, 2006, 64, 32, gameEngine), AM.getAsset("./img/extras/x2platform.png"), 230, true, 100, 64));
    gameEngine.addMovingPlatform(new MovingPlatform(gameEngine, 4733, 2066, new BoundingRect(4733, 2066, 64, 32, gameEngine), AM.getAsset("./img/extras/x2platform.png"), 131, true, 100, 64));
    gameEngine.addMovingPlatform(new MovingPlatform(gameEngine, 5056, 2002, new BoundingRect(5056, 2002, 64, 32, gameEngine), AM.getAsset("./img/extras/x2platform.png"), 129, false, 110, 64));
    gameEngine.addMovingPlatform(new MovingPlatform(gameEngine, 5377, 1936, new BoundingRect(5377, 1936, 64, 32, gameEngine), AM.getAsset("./img/extras/x2platform.png"), 129, true, 100, 64));
    gameEngine.addMovingPlatform(new MovingPlatform(gameEngine, 5700, 1554, new BoundingRect(5700, 1554, 64, 32, gameEngine), AM.getAsset("./img/extras/x2platform.png"), 140, true, 100, 64));
    gameEngine.addMovingPlatform(new MovingPlatform(gameEngine, 6055, 1650, new BoundingRect(6055, 1650, 64, 32, gameEngine), AM.getAsset("./img/extras/x2platform.png"), 147, false, 100, 64));
    gameEngine.addMovingPlatform(new MovingPlatform(gameEngine, 2407, 1362, new BoundingRect(2407, 1362, 64, 32, gameEngine), AM.getAsset("./img/extras/x2platform.png"), 137, false, 100, 64));
    gameEngine.addMovingPlatform(new MovingPlatform(gameEngine, 2736, 1426, new BoundingRect(2736, 1426, 64, 32, gameEngine), AM.getAsset("./img/extras/x2platform.png"), 137, true, 100, 64));
    gameEngine.addMovingPlatform(new MovingPlatform(gameEngine, 1585, 1426, new BoundingRect(1585, 1426, 64, 32, gameEngine), AM.getAsset("./img/extras/x2platform.png"), 145, true, 100, 64));
    gameEngine.addMovingPlatform(new MovingPlatform(gameEngine, 1939, 1426, new BoundingRect(1939, 1426, 64, 32, gameEngine), AM.getAsset("./img/extras/x2platform.png"), 145, false, 100, 64));
    gameEngine.addMovingPlatform(new MovingPlatform(gameEngine, 5952, 180, new BoundingRect(5952, 180, 64, 32, gameEngine), AM.getAsset("./img/extras/x2platform.png"), 158, false, 100, 64));

    //size 4 moving platforms
    gameEngine.addMovingPlatform(new MovingPlatform(gameEngine, 719, 1554, new BoundingRect(719, 1554, 128, 32, gameEngine), AM.getAsset("./img/extras/x4platform.png"), 145, true, 100, 128));
    gameEngine.addMovingPlatform(new MovingPlatform(gameEngine, 3873, 146, new BoundingRect(3873, 146, 128, 32, gameEngine), AM.getAsset("./img/extras/x4platform.png"), 193, false, 100, 128));
    gameEngine.addMovingPlatform(new MovingPlatform(gameEngine, 4544, 146, new BoundingRect(4544, 146, 128, 32, gameEngine), AM.getAsset("./img/extras/x4platform.png"), 224, true, 100, 128));
    gameEngine.addMovingPlatform(new MovingPlatform(gameEngine, 5201, 178, new BoundingRect(5201, 178, 128, 32, gameEngine), AM.getAsset("./img/extras/x4platform.png"), 241, false, 100, 128));



    gameEngine.addPlatform(startingPlatform);
    gameEngine.addPlatform(new Platform(new BoundingRect(388, 1940, 503, 187, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(3045, 2067, 1558, 61, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(4356, 1589, 726, 52, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(470, 1140, 1827, 23, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(1140, 1940, 606, 187, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(6078, 1458, 322, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(260, 2005, 130, 65, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(1755, 2004, 768, 125, gameEngine)));
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

    //SKY TILES _________________________________________________________________________
    gameEngine.addPlatform(new Platform(new BoundingRect(0, 272, 1088, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(0, 465, 32, 232, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(32, 497, 64, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(128, 530, 32, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(192, 530, 32, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(256, 530, 32, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(320, 530, 32, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(384, 530, 32, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(448, 530, 32, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(512, 530, 32, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(576, 530, 32, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(640, 530, 32, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(2496, 946, 190, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(2432, 626, 320, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(2720, 882, 128, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(2848, 754, 96, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(2815, 721, 32, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(2784, 689, 32, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(2751, 657, 32, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(1983, 466, 64, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(2048, 434, 32, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(2083, 402, 32, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(2113, 370, 608, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(2176, 242, 160, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(2528, 274, 32, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(2592, 242, 32, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(2657, 210, 32, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(2751, 178, 128, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(2720, 402, 96, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(3105, 562, 96, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(3201, 593, 32, 10, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(2914, 690, 192, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(3168, 1010, 192, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(5568, 178, 224, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(5376, 369, 320, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(3073, 849, 224, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(3328, 882, 32, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(3393, 913, 32, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(3456, 978, 192, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(3263, 242, 32, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(3296, 209, 32, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(3329, 178, 128, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(3457, 146, 224, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(3328, 626, 128, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(3488, 496, 64, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(3361, 753, 288, 10, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(3648, 722, 32, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(3680, 690, 32, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(3714, 658, 160, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(3648, 786, 32, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(3680, 817, 288, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(3967, 850, 672, 10, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(3617, 403, 384, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(3873, 625, 513, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(4128, 467, 160, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(4192, 144, 128, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(4394, 594, 96, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(4480, 562, 64, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(4514, 754, 160, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(4576, 466, 64, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(4736, 530, 128, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(4895, 178, 64, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(4928, 432, 128, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(5151, 529, 160, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(4768, 657, 544, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(1088, 178, 128, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(1216, 210, 32, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(1248, 242, 64, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(1312, 274, 64, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(1376, 306, 352, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(1760, 210, 32, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(1824, 242, 32, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(1920, 242, 32, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(1984, 306, 32, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(736, 562, 160, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(32, 690, 64, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(96, 722, 160, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(352, 722, 128, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(480, 754, 224, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(704, 786, 384, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(1090, 816, 320, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(1408, 848, 160, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(1024, 658, 192, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(1344, 690, 160, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(1568, 754, 160, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(1728, 850, 384, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(1728, 626, 192, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(1984, 722, 128, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(2176, 658, 160, 12, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(2176, 786, 160, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(2368, 818, 256, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(2912, 242, 64, 64, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(2977, 274, 64, 64, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(3040, 305, 64, 64, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(2817, 434, 160, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(2976, 466, 32, 64, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(3008, 530, 96, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(2911, 946, 160, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(5345, 690, 32, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(5408, 722, 32, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(5472, 754, 32, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(5503, 787, 608, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(5728, 945, 544, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(5696, 658, 192, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(6112, 818, 32, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(6144, 849, 32, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(6176, 880, 32, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(6304, 786, 64, 64, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(6336, 657, 32, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(6176, 338, 32, 190, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(6367, 338, 32, 450, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(6336, 402, 32, 32, gameEngine)));
    gameEngine.addPlatform(new Platform(new BoundingRect(6143, 530, 224, 32, gameEngine)));

    var count = 1;
    var artemis = new  OrcBowman(gameEngine, AM.getAsset("./img/characters/TronWithBow.png"), count++);
    artemis.currentPlatform = startingPlatform;
    gameEngine.addEntity(artemis);

    var dragon = new Dragon(gameEngine, 200, 1760, AM.getAsset("./img/characters/dragon_fly_right.png"), count++);
    gameEngine.addEntity(dragon);


    var redhead1 = new Redhead(gameEngine, 630, 1940, AM.getAsset("./img/characters/redhead.png"), count++);
    var redheadAdjust = redhead1.yAdjust + redhead1.boundingRect.height + 20;
    redhead1.y = 1940 - redheadAdjust;
    gameEngine.addEntity(redhead1);

    var redhead2 = new Redhead(gameEngine, 3950, 2067, AM.getAsset("./img/characters/redhead.png"), count++);
    redhead2.y = 2067 - redheadAdjust;
    gameEngine.addEntity(redhead2);

    var redhead3 = new Redhead(gameEngine, 4730, 1589, AM.getAsset("./img/characters/redhead.png"), count++);
    redhead3.y = 1589 - redheadAdjust;
    gameEngine.addEntity(redhead3);

    var redhead4 = new Redhead(gameEngine, 1350, 1140, AM.getAsset("./img/characters/redhead.png"), count++);
    redhead4.y = 1140 - redheadAdjust;
    gameEngine.addEntity(redhead4);

    var redhead5 = new Redhead(gameEngine, 1330, 1940, AM.getAsset("./img/characters/redhead.png"), count++);
    redhead5.y = 1940 - redheadAdjust;
    gameEngine.addEntity(redhead5);

    var redhead6 = new Redhead(gameEngine, 850, 750, AM.getAsset("./img/characters/redhead.png"), count++);
    redhead6.y = 750 - redheadAdjust;
    redhead6.falling = true;
    gameEngine.addEntity(redhead6);

    var redhead7 = new Redhead(gameEngine, 240, 1300, AM.getAsset("./img/characters/redhead.png"), count++);
    redhead7.y = 1300 - redheadAdjust;
    redhead7.falling = true;
    gameEngine.addEntity(redhead7);

    var redhead8 = new Redhead(gameEngine, 1450, 1900, AM.getAsset("./img/characters/redhead.png"), count++);
    redhead8.y = 1900 - redheadAdjust;
    redhead8.falling = true;
    gameEngine.addEntity(redhead8);

    var redhead9 = new Redhead(gameEngine, 3329, 2040, AM.getAsset("./img/characters/redhead.png"), count++);
    redhead9.y = 2040 - redheadAdjust;
    redhead9.falling = true;
    gameEngine.addEntity(redhead9);

    var redhead10 = new Redhead(gameEngine, 3850, 2040, AM.getAsset("./img/characters/redhead.png"), count++);
    redhead10.y = 2040 - redheadAdjust;
    redhead10.falling = true;
    gameEngine.addEntity(redhead10);

    var redhead11 = new Redhead(gameEngine, 4050, 2040, AM.getAsset("./img/characters/redhead.png"), count++);
    redhead11.y = 2040 - redheadAdjust;
    redhead11.falling = true;
    gameEngine.addEntity(redhead11);

    var redhead12 = new Redhead(gameEngine, 3050, 1470, AM.getAsset("./img/characters/redhead.png"), count++);
    redhead12.y = 1470 - redheadAdjust;
    redhead12.falling = true;
    gameEngine.addEntity(redhead12);

    var redhead13 = new Redhead(gameEngine, 3950, 1470, AM.getAsset("./img/characters/redhead.png"), count++);
    redhead13.y = 1470 - redheadAdjust;
    redhead13.falling = true;
    gameEngine.addEntity(redhead13);

    var redhead14 = new Redhead(gameEngine, 5835, 1185, AM.getAsset("./img/characters/redhead.png"), count++);
    redhead14.y = 1185 - redheadAdjust;
    redhead14.falling = true;
    gameEngine.addEntity(redhead14);

    var redhead15 = new Redhead(gameEngine, 5060, 1020, AM.getAsset("./img/characters/redhead.png"), count++);
    redhead15.y = 1020 - redheadAdjust;
    redhead15.falling = true;
    gameEngine.addEntity(redhead15);

    var redhead16 = new Redhead(gameEngine, 4000, 1080, AM.getAsset("./img/characters/redhead.png"), count++);
    redhead16.y = 1080 - redheadAdjust;
    redhead16.falling = true;
    gameEngine.addEntity(redhead16);

    var redhead17 = new Redhead(gameEngine, 2500, 1020, AM.getAsset("./img/characters/redhead.png"), count++);
    redhead17.y = 1020 - redheadAdjust;
    redhead17.falling = true;
    gameEngine.addEntity(redhead17);

    var redhead18 = new Redhead(gameEngine, 1600, 1110, AM.getAsset("./img/characters/redhead.png"), count++);
    redhead18.y = 1110 - redheadAdjust;
    redhead18.falling = true;
    gameEngine.addEntity(redhead18);

    var redhead19 = new Redhead(gameEngine, 1330, 1110, AM.getAsset("./img/characters/redhead.png"), count++);
    redhead19.y = 1110 - redheadAdjust;
    redhead19.falling = true;
    gameEngine.addEntity(redhead19);

    var redhead20 = new Redhead(gameEngine, 530, 730, AM.getAsset("./img/characters/redhead.png"), count++);
    redhead20.y = 730 - redheadAdjust;
    redhead20.falling = true;
    gameEngine.addEntity(redhead20);

    var redhead21 = new Redhead(gameEngine, 1200, 790, AM.getAsset("./img/characters/redhead.png"), count++);
    redhead21.y = 790 - redheadAdjust;
    redhead21.falling = true;
    gameEngine.addEntity(redhead21);

    var redhead22 = new Redhead(gameEngine, 2250, 220, AM.getAsset("./img/characters/redhead.png"), count++);
    redhead22.y = 220 - redheadAdjust;
    redhead22.falling = true;
    gameEngine.addEntity(redhead22);

    var redhead23 = new Redhead(gameEngine, 1520, 280, AM.getAsset("./img/characters/redhead.png"), count++);
    redhead23.y = 280 - redheadAdjust;
    redhead23.falling = true;
    gameEngine.addEntity(redhead23);

    var redhead24 = new Redhead(gameEngine, 2560, 410, AM.getAsset("./img/characters/redhead.png"), count++);
    redhead24.y = 410 - redheadAdjust;
    redhead24.falling = true;
    gameEngine.addEntity(redhead24);

    var redhead25 = new Redhead(gameEngine, 5000, 630, AM.getAsset("./img/characters/redhead.png"), count++);
    redhead25.y = 630 - redheadAdjust;
    redhead25.falling = true;
    gameEngine.addEntity(redhead25);

    var redhead26 = new Redhead(gameEngine, 5600, 760, AM.getAsset("./img/characters/redhead.png"), count++);
    redhead26.y = 760 - redheadAdjust;
    redhead26.falling = true;
    gameEngine.addEntity(redhead26);

    var redhead27 = new Redhead(gameEngine, 5860, 760, AM.getAsset("./img/characters/redhead.png"), count++);
    redhead27.y = 760 - redheadAdjust;
    redhead27.falling = true;
    gameEngine.addEntity(redhead27);

    var skeleton = new SkeletonShooter(gameEngine, 6277, 1841, AM.getAsset("./img/characters/skeleton.png"), count++);
    skeleton.y = 1841 - redheadAdjust;
    skeleton.falling = true;
    gameEngine.addEntity(skeleton);

    var skeleton2 = new SkeletonShooter(gameEngine, 250, 185, AM.getAsset("./img/characters/skeleton.png"), count++);
    skeleton2.y = 185 - redheadAdjust;
    skeleton2.falling = true;
    gameEngine.addEntity(skeleton2);

    var skeleton3 = new SkeletonShooter(gameEngine, 2380, 1970, AM.getAsset("./img/characters/skeleton.png"), count++);
    skeleton3.y = 1970 - redheadAdjust;
    skeleton3.falling = true;
    gameEngine.addEntity(skeleton3);

    var skeleton4 = new SkeletonShooter(gameEngine, 4450, 2060, AM.getAsset("./img/characters/skeleton.png"), count++);
    skeleton4.y = 2060 - redheadAdjust;
    skeleton4.falling = true;
    gameEngine.addEntity(skeleton4);

    var skeleton5 = new SkeletonShooter(gameEngine, 5000, 1550, AM.getAsset("./img/characters/skeleton.png"), count++);
    skeleton5.y = 1550 - redheadAdjust;
    skeleton5.falling = true;
    gameEngine.addEntity(skeleton5);

    var skeleton6 = new SkeletonShooter(gameEngine, 4800, 1075, AM.getAsset("./img/characters/skeleton.png"), count++);
    skeleton6.y = 1075 - redheadAdjust;
    skeleton6.falling = true;
    gameEngine.addEntity(skeleton6);

    var skeleton7 = new SkeletonShooter(gameEngine, 490, 1110, AM.getAsset("./img/characters/skeleton.png"), count++);
    skeleton7.y = 1110 - redheadAdjust;
    skeleton7.falling = true;
    gameEngine.addEntity(skeleton7);

    var skeleton8 = new SkeletonShooter(gameEngine, 4180, 610, AM.getAsset("./img/characters/skeleton.png"), count++);
    skeleton8.y = 610 - redheadAdjust;
    skeleton8.falling = true;
    gameEngine.addEntity(skeleton8);




    gameEngine.addEntity(new princess(gameEngine, AM.getAsset("./img/characters/Princess.png"), count++));


    gameEngine.addEntity(new Chest(gameEngine, AM.getAsset("./img/extras/chest.png"), 6300, 1387, 2));
    gameEngine.addEntity(new Chest(gameEngine, AM.getAsset("./img/extras/chest.png"), 80, 1482, 2));
    gameEngine.addEntity(new Chest(gameEngine, AM.getAsset("./img/extras/chest.png"), 35, 462, 1));
    gameEngine.addEntity(new Chest(gameEngine, AM.getAsset("./img/extras/chest.png"), 6320, 493, 1));





    // random generate some coins!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    for (var i = 0; i < 100; i ++) {
      var x = getRand(0, gameEngine.worldWidth);
      var y = getRand(0, 2036);
      var marker = new Date().getUTCMilliseconds();
      var collided = false;
      var coin = new Coin(gameEngine, AM.getAsset("./img/extras/coin.png"), x, y, marker);
      for (var j = 0; j < gameEngine.platforms.length; j++) {
        var p = gameEngine.platforms[j];
        if (coin.collide(p)) {
          collided = true;
          break;
        }
      }
      if (!collided)
        gameEngine.addEntity(coin);
    }


    // gameEngine.addEntity(new Chest(gameEngine, AM.getAsset("./img/extras/chest.png"), 6320, 493, 1));
    // var redhead = new Redhead(gameEngine, 720, 1877,  AM.getAsset("./img/characters/redhead.png"), ctx);
    // redhead.paceing = true;
    // redhead.jumping = false;
    // gameEngine.addEntity(redhead);

    myAudio = new Audio('./bgm/TheNightingale.mp3');
    myAudio.addEventListener('ended', function() {
      this.currentTime = 0;
      this.play();
    }, false);
    myAudio.play();



    gameEngine.follow();
    gameEngine.start();

    console.log("All Done!");
});
