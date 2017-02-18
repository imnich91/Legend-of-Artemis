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

Animation.prototype.drawSpecifcFrame = function(ctx, x, y, row, col) {
  ctx.drawImage(this.spriteSheet,
               row * this.frameWidth,
               col* this.frameHeight,  // source from sheet
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

function tronMainCharacter(game, spritesheet) {
    this.animation = new Animation(spritesheet, 64, 64, 9, 0.1, 9, true, 1 );
    this.speed = 100;
    this.ctx = game.ctx;
    this.x = 300;
    this.y = 2030;
    this.game = game;
    this.row = 12;
    this.width = 64;
    this.height = 64;
    this.step = game.STEP;
    this.camera = game.camera;
    // this.game.camera.follow();
}

function OrcBowman(game, spritesheet) {
  this.walkAnimation = new Animation(spritesheet, 64, 64, 9, 0.1, 9, true, 1);
  this.magicAnimation = new Animation(spritesheet, 64, 64, 6.5, 0.1, 6.5, false, 1);
  this.shootRightAnimation = new Animation(spritesheet, 64, 64, 12.5, 0.1, 12.5, false, 1);
  this.shootLeftAnimation = new Animation(spritesheet, 64, 64, 12.5, 0.1, 12.5, false, 1);
  this.upAnimation = new Animation(spritesheet, 64, 64, 1, 0.1, 1, false, 1);
  this.jumpAnimation = new Animation(spritesheet, 64, 64, 1, 0.1, 1, false, 1)

  this.spritesheet = spritesheet;
  this.x = 20;
  this.y = 2005;
  this.speed = 500;
  this.ctx = game.ctx;
  this.game = game;
  this.currDirection = 11;
  this.animating = false;
  this.jumping = false;
  this.goingup = true;
  this.goingdown = false;
  //////////////////////////
  this.width = 64;
  this.height = 64;
  this.step = game.STEP;
  this.camera = game.camera;
}

OrcBowman.prototype.draw = function () {
    // this.walkAnimation.drawFrame(this.game.clockTick, this.ctx,
    // (this.x-this.width/2) - this.camera.xView, 
    // (this. y-this.height/2) - this.camera.yView,
    //  11, true);
    // this.right = false;
    // this.animating = false;

  if(this.right && this.lastPressed === "right") {
    this.walkAnimation.drawFrame(this.game.clockTick,
    this.ctx, 
        (this.x-this.width/2) - this.camera.xView, 
        (this. y-this.height/2) - this.camera.yView,
          11, true);
    this.right = false;
    this.animating = false;
  } else if(this.left && this.lastPressed === "left") {
    this.walkAnimation.drawFrame(this.game.clockTick, 
        this.ctx, 
        (this.x-this.width/2) - this.camera.xView, 
        (this. y-this.height/2) - this.camera.yView
        , 9, true);
    this.left = false;
    this.animating = false;
  } else if(this.down && this.lastPressed === "down") {
      this.magicAnimation.drawFrame(this.game.clockTick, 
      this.ctx, 
        (this.x-this.width/2) - this.camera.xView, 
        (this. y-this.height/2) - this.camera.yView, 
         2, true);
  } else if(this.melee && this.lastPressed === "melee") {
    if(this.currDirection === 11) {
      this.shootRightAnimation.drawFrame(this.game.clockTick,
      this.ctx, 
        (this.x-this.width/2) - this.camera.xView, 
        (this. y-this.height/2) - this.camera.yView, 
         19, true);
    } else {
      this.shootRightAnimation.drawFrame(this.game.clockTick, this.ctx, 
        (this.x-this.width/2) - this.camera.xView, 
        (this. y-this.height/2) - this.camera.yView, 
         17, true);
    }
  }
  else if(!this.animating){
    if(this.lastPressed === "right" || this.lastPressed === "melee") {
      this.walkAnimation.drawFrame(0, this.ctx, 
        (this.x-this.width/2) - this.camera.xView, 
        (this. y-this.height/2) - this.camera.yView, 
         this.currDirection, false);
    } else if(this.lastPressed === "left" || this.lastPressed === "melee"){
      this.walkAnimation.drawFrame(0, 
      this.ctx, 
        (this.x-this.width/2) - this.camera.xView, 
        (this. y-this.height/2) - this.camera.yView, 
         this.currDirection, false);
    } else if(this.lastPressed === "down") {
      this.magicAnimation.drawSpecifcFrame(this.ctx, 
        (this.x-this.width/2) - this.camera.xView, 
        (this. y-this.height/2) - this.camera.yView,
         0, 2);
    } else if(this.lastPressed === "melee" && this.currDirection === "right") {
      this.shootRightAnimation.drawSpecifcFrame(
      this.ctx, 
        (this.x-this.width/2) - this.camera.xView, 
        (this. y-this.height/2) - this.camera.yView,
         13, 19);
    } else if(this.lastPressed === "up") {
      this.upAnimation.drawSpecifcFrame(this.ctx, 
        (this.x-this.width/2) - this.camera.xView, 
        (this. y-this.height/2) - this.camera.yView, 0, 0);
    }
    else {
      this.walkAnimation.drawFrame(0, this.ctx, 
        (this.x-this.width/2) - this.camera.xView, 
        (this. y-this.height/2) - this.camera.yView,
         this.currDirection, false);
    }
  }
}

OrcBowman.prototype.update = function () {
      if(this.game.chars["ArrowRight"] || this.game.chars["KeyD"]) {
    this.right = true;
    this.currDirection = 11;
    this.lastPressed = "right";
    this.animating = true;
  } else if(this.game.chars["ArrowLeft"] || this.game.chars["KeyA"]) {
    this.left = true;
    this.currDirection = 9;
    this.lastPressed = "left";
    this.animating = true;
  } else if(this.game.chars["KeyS"] || this.game.chars["ArrowDown"]) {
    this.lastPressed = "down";
    this.down = true;
    this.animating = true;
  } else if(this.game.chars["KeyZ"] || this.game.chars["KeyJ"]) {
    this.lastPressed = "melee";
    this.melee = true;
    this.animating = true;
  } else if(this.game.chars["ArrowUp"] || this.game.chars["KeyW"]) {
    this.up = true;
    this.lastPressed = "up";
    this.animating = false;
  }

  if (this.magicAnimation.isDone()) {
      this.magicAnimation.elapsedTime = 0;
      this.down = false;
      this.animating = false;
  }
  if (this.shootRightAnimation.isDone()) {
      this.shootRightAnimation.elapsedTime = 0;
      this.melee = false;
      this.animating = false;
  }
  if (this.shootLeftAnimation.isDone()) {
      this.shootLeftAnimation.elapsedTime = 0;
      this.melee = false;
      this.animating = false;
  }

    if(this.right) {
    this.x += this.game.clockTick * this.speed;
  } else if(this.left) {
    this.x -= this.game.clockTick * this.speed;
  } else {

  }

      if(this.x - this.width/2 < 0) {
        // console.log("before boundary x : " + this.x);
        this.x = this.width/2;
        // console.log("boundary x : " + this.x);
    }
    //check top boundary
    if(this.y - this.height/2 < 0) {
        this.y = this.height/2;
        // console.log("top boundary y : " + this.y);
    }

    //check right boundary
    if(this.x + this.width/2 > this.game.worldWidth) {
        this.x = this.game.worldWidth - this.width/2;
        // console.log("char boundary x : " + this.x);
    }

    //check bottom boundary
    // console.log("y: " + (this.y + this.height/2) + " worldHeight" + this.game.worldHeight);
    if(this.y + this.height/2 > this.game.worldHeight) {
        this.y = this.game.worldHeight - this.height/2;
        // console.log("boundary y : " + this.y);
    }
}



function Chest(game, spritesheet, x, y, scale) {
  this.animation = new Animation(spritesheet, 47, 38, 3.5, 0.2, 3.5, false, scale);
  this.x = x;
  this.y = y;
  this.ctx = game.ctx;
  this.game = game;
  this.camera = game.camera;
}

Chest.prototype.draw = function() {
  if(this.open && !this.wasOpened) {
      this.animation.currFrame = 0;
      this.animation.drawFrame(this.game.clockTick, this.ctx, this.x - this.camera.xView , this.y - this.camera.yView, 0, true);
  } else if(this.wasOpened) {
    this.animation.drawSpecifcFrame(this.ctx, this.x - this.camera.xView, this.y - this.camera.yView, 3, 0);
  }else {
      this.animation.drawFrame(0, this.ctx, this.x - this.camera.xView, this.y - this.camera.yView, 0, false);
  }
}

Chest.prototype.update = function() {
  if(this.game.chars["KeyC"] || this.game.chars["KeyL"]) {
    this.open = true;
  }
  if (this.animation.isDone()) {
      this.open = false;
      this.animation.elapsedTime = 0;
      this.wasOpened = true;

  }
}

function Redhead(game, x, y, spritesheet) {
    this.animation = new Animation(spritesheet, 64, 64, 9, 0.1, 9, true, 1);
    this.x = x;
    this.y = y;
    this.speed = 100;
    this.game = game;
    this.ctx = game.ctx;
    this.up = true;
    this.down = false;
    this.jumping = false;
    this.spearing = false;
    this.rightFaceing = false;
    this.leftFaceing = true;
    this.paceing = true;
    this.direction = 'up';
    this.camera = game.camera;
}

Redhead.prototype.draw = function () {

    if (this.paceing) this.pace();

    if (this.jumping) {
      this.jump();
    }

    if (this.spearing) {
      this.spear();
    }
}

Redhead.prototype.update = function () {

    // if (this.game.space) {
    //   this.jumping = true;
    // }

    // console.log(this.jumping)

    // if (this.game.right) {
    //   this.moveRight();
    // }
    //
    // if (this.game.left) {
    //   this.moveLeft();
    // }
    //
    if (this.jumping) {
      this.jump();
    }
}

Redhead.prototype.spear = function() {

  if (this.rightFaceing) {
    this.animation.setFrames(8);
    this.animation.drawFrame(this.game.clockTick, this.ctx, tthis.x - this.camera.xView , this.y - this.camera.yView, 7, true)
  } else {
    this.animation.setFrames(8);
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x - this.camera.xView , this.y - this.camera.yView, 5, true)
  }
}

Redhead.prototype.jump = function() {

  this.animation.setFrames(1);
  this.animation.drawFrame(this.game.clockTick, this.ctx, this.x - this.camera.xView , this.y - this.camera.yView, 6, true);


    if (this.up) {
        this.y -= 2
        if (this.y == 300) {
          this.up = false;
          this.down = true;
        }
    } else if (this.down) {
        this.y += 2
        if (this.y >= 500) {
          this.y = 500;
          this.down  = false;
          this.up = true;
          this.jumping = true;
          // this.jumping = false;
      }
    }
  }

  // Redhead.prototype.jump2 = function() {
  //
  //   this.animation.setFrames(1);
  //   this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 6);
  //
  //
  //     if (this.direction === 'up') {
  //         this.y -= 5;
  //         if (this.y <= 300) {
  //           this.direction = 'down';
  //         }
  //     } else if (this.direction === 'down') {
  //         this.y += 5;
  //         if (this.y >= 500) {
  //           this.y = 500;
  //           this.direction = 'up'
  //           this.jumping = false;
  //       }
  //     }
  //   }

Redhead.prototype.pace = function() {

  if (this.leftFaceing) {
      this.moveLeft()
      if (this.x <= 350) {
        this.leftFaceing = false;
        this.rightFaceing = true;
      }
  } else if (this.rightFaceing) {
    this.moveRight()
    if (this.x >= 500) {
      this.rightFaceing = false;
      this.leftFaceing = true;
    }
  }
}

Redhead.prototype.moveRight = function() {
    this.x += this.game.clockTick * this.speed;
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x - this.camera.xView , this.y - this.camera.yView, 11, true)
  }

Redhead.prototype.moveLeft = function() {
  this.x -= this.game.clockTick * this.speed;
  this.animation.drawFrame(this.game.clockTick, this.ctx, this.x - this.camera.xView , this.y - this.camera.yView, 9, true)
}

function Skeleton(game, x, y, spritesheet) {
    this.animation = new Animation(spritesheet, 64, 64, 9, 0.2, 9, true, 1);
    this.x = x;
    this.y = y;
    this.speed = 50;
    this.game = game;
    this.ctx = game.ctx;
    this.up = true;
    this.down = false;
    this.jumping = false;
    this.spearing = false;
    this.rightFaceing = true;
    this.leftFaceing = false;
    this.paceing = true;
    this.direction = 'up';
    this.swinging = false;
    this.camera = game.camera;
}

Skeleton.prototype.draw = function () {

    if (this.paceing) this.pace();

    if (this.jumping) {
      this.jump();
    }

    if (this.spearing) {
      this.spear();
    }

    if (this.swinging) {
      this.swing();
    }
}

Skeleton.prototype.update = function () {

    // if (this.game.space) {
    //   this.jumping = true;
    // }

    // console.log(this.jumping)

    // if (this.game.right) {
    //   this.moveRight();
    // }
    //
    // if (this.game.left) {
    //   this.moveLeft();
    // }
    //
    if (this.jumping) {
      this.jump();
    }
}

Skeleton.prototype.spear = function() {

  if (this.rightFaceing) {
    this.animation.setFrames(13);
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x - this.camera.xView , this.y - this.camera.yView, 19, true)
  } else {
    this.animation.setFrames(13);
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x - this.camera.xView , this.y - this.camera.yView, 17, true)
  }
}

Skeleton.prototype.pace = function() {

  if (this.leftFaceing) {
      this.moveLeft()
      if (this.x <= 350) {
        this.leftFaceing = false;
        this.rightFaceing = true;
      }
  } else if (this.rightFaceing) {
    this.moveRight()
    if (this.x >= 500) {
      this.rightFaceing = false;
      this.leftFaceing = true;
    }
  }
}

Skeleton.prototype.swing = function () {

    this.animation.setFrames(7);
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x - this.camera.xView , this.y - this.camera.yView, 3, true);


}

Skeleton.prototype.jump = function() {

  this.animation.setFrames(6);
  this.animation.drawFrame(this.game.clockTick, this.ctx, this.x - this.camera.xView , this.y - this.camera.yView, 20, true);


    if (this.up) {
        this.y -= 2
        if (this.y == 300) {
          this.up = false;
          this.down = true;
        }
    } else if (this.down) {
        this.y += 2
        if (this.y >= 500) {
          this.y = 500;
          this.down  = false;
          this.up = true;
          this.jumping = true;
          // this.jumping = false;
      }
    }
  }


Skeleton.prototype.moveRight = function() {
    this.x += this.game.clockTick * this.speed;
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x - this.camera.xView , this.y - this.camera.yView, 11, true)
  }

Skeleton.prototype.moveLeft = function() {
  this.x -= this.game.clockTick * this.speed;
  this.animation.drawFrame(this.game.clockTick, this.ctx, this.x - this.camera.xView , this.y - this.camera.yView, 9, true)
}



// AM.queueDownload("./img/backgrounds/town_background.jpg");
AM.queueDownload("./img/backgrounds/finished level 1.png");
//main character image
AM.queueDownload("./img/characters/TronWithBow.png")
AM.queueDownload("./img/Tron.png");
AM.queueDownload("./img/extras/chest.png");
AM.queueDownload("./img/characters/redhead.png");
AM.queueDownload("./img/characters/skeleton.png");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    // gameEngine.init(ctx, AM.getAsset("./img/backgrounds/town_background.jpg"));
    gameEngine.init(ctx, AM.getAsset("./img/backgrounds/finished level 1.png"));
    gameEngine.start();
    gameEngine.addEntity(new OrcBowman(gameEngine, AM.getAsset("./img/characters/TronWithBow.png")));
    // gameEngine.addEntity(new GameEngine.Camera(0, 0, gameEngine.surfaceWidth, 
    //                                                  gameEngine.surfaceHeight, 
    //                                                  gameEngine.worldWidth, 
    //                                                  gameEngine.worldHeight, 
    //                                                  AM.getAsset("./img/town_background.jpg")));
    // gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/town_background.jpg")));
    // gameEngine.addEntity(new MushroomDude(gameEngine, AM.getAsset("./img/mushroomdude.png")));
    // gameEngine.addEntity(new Cheetah(gameEngine, AM.getAsset("./img/runningcat.png")));
    // gameEngine.addEntity(new Guy(gameEngine, AM.getAsset("./img/guy.jpg")));
    // gameEngine.addEntity(new tronMainCharacter(gameEngine, AM.getAsset("./img/characters/TronWithBow.png")));
    gameEngine.addEntity(new Chest(gameEngine, AM.getAsset("./img/extras/chest.png"), 6300, 1387, 2));
    gameEngine.addEntity(new Chest(gameEngine, AM.getAsset("./img/extras/chest.png"), 80, 1482, 2));
    gameEngine.addEntity(new Chest(gameEngine, AM.getAsset("./img/extras/chest.png"), 35, 462, 1));
    gameEngine.addEntity(new Chest(gameEngine, AM.getAsset("./img/extras/chest.png"), 6320, 493, 1));
    var redhead = new Redhead(gameEngine, 720, 1877,  AM.getAsset("./img/characters/redhead.png"));
    redhead.paceing = true;
    redhead.jumping = false;
    gameEngine.addEntity(redhead);
    gameEngine.follow();
    
    // var camera = new GameEngine.Camera(0, 0, gameEngine.surfaceWidth,
    //                                      gameEngine.surfaceHeight, 
    //                                      gameEngine.worldWidth, 
    //                                      gameEngine.worldHeight);

    console.log("All Done!");
});