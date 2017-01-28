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

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

// var set = false;
// window.onload = function() {
//   set = true;
// };

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


// no inheritance
function Background(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
};

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
                   this.x, this.y);
};

Background.prototype.update = function () {
};



function Chest(game, spritesheet) {
  this.animation = new Animation(spritesheet, 47, 38, 3.5, 0.2, 3.5, false, 1.5);
  this.x = 100;
  this.y = 480;
  this.ctx = game.ctx;
  this.game = game;
}

// Chest.prototype.draw = function() {
//   // while(!set) {
//   //
//   // }
//   if(this.open && !this.wasOpened) {
//       this.animation.currFrame = 0;
//       this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 0, true);
//   } else if(this.wasOpened) {
//     this.animation.drawSpecifcFrame(this.ctx, this.x, this.y, 3, 0);
//   }else {
//       this.animation.drawFrame(0, this.ctx, this.x, this.y, 0, false);
//   }
// }
//
// Chest.prototype.update = function() {
//   if(this.game.chars["KeyC"] || this.game.chars["KeyL"]) {
//     this.open = true;
//   }
//   if (this.animation.isDone()) {
//       this.open = false;
//       this.animation.elapsedTime = 0;
//       this.wasOpened = true;
//
//   }
// }
function Redhead(game, x, y, spritesheet) {
    this.animation = new Animation(spritesheet, 64, 64, 9, 0.1, 9, true, 2);
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
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 7, true)
  } else {
    this.animation.setFrames(8);
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 5, true)
  }
}

Redhead.prototype.jump = function() {

  this.animation.setFrames(1);
  this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 6, true);


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
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 11, true)
  }

Redhead.prototype.moveLeft = function() {
  this.x -= this.game.clockTick * this.speed;
  this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 9, true)
}

function Skeleton(game, x, y, spritesheet) {
    this.animation = new Animation(spritesheet, 64, 64, 9, 0.2, 9, true, 2);
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
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 19, true)
  } else {
    this.animation.setFrames(13);
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 17, true)
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
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 3, true);


}

Skeleton.prototype.jump = function() {

  this.animation.setFrames(6);
  this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 20, true);


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
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 11, true)
  }

Skeleton.prototype.moveLeft = function() {
  this.x -= this.game.clockTick * this.speed;
  this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 9, true)
}

function OrcBowman(game, spritesheet) {
  this.walkAnimation = new Animation(spritesheet, 64, 64, 9, 0.1, 9, true, 1.5);
  this.magicAnimation = new Animation(spritesheet, 64, 64, 6.5, 0.1, 6.5, false, 1.5);
  this.shootRightAnimation = new Animation(spritesheet, 64, 64, 12.5, 0.1, 12.5, false, 1.5);
  this.shootLeftAnimation = new Animation(spritesheet, 64, 64, 12.5, 0.1, 12.5, false, 1.5);
  this.upAnimation = new Animation(spritesheet, 64, 64, 1, 0.1, 1, false, 1.5);
  this.jumpAnimation = new Animation(spritesheet, 64, 64, 1, 0.1, 1, false, 1.5)

  this.spritesheet = spritesheet;
  this.x = 0;
  this.y = 480;
  this.speed = 150;
  this.ctx = game.ctx;
  this.game = game;
  this.currDirection = 11;
  this.animating = false;
  this.jumping = false;
  this.goingup = true;
  this.goingdown = false;
}

OrcBowman.prototype.draw = function () {
  if(this.right && this.lastPressed === "right") {
    this.walkAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 11, true);
    this.right = false;
    this.animating = false;
  } else if(this.left && this.lastPressed === "left") {
    this.walkAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 9, true);
    this.left = false;
    this.animating = false;
  } else if(this.down && this.lastPressed === "down") {
      this.magicAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 2, true);
  } else if(this.melee && this.lastPressed === "melee") {
    if(this.currDirection === 11) {
      this.shootRightAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 19, true);
    } else {
      this.shootRightAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 17, true);
    }
  }
  else if(!this.animating){
    if(this.lastPressed === "right" || this.lastPressed === "melee") {
      this.walkAnimation.drawFrame(0, this.ctx, this.x, this.y, this.currDirection, false);
    } else if(this.lastPressed === "left" || this.lastPressed === "melee"){
      this.walkAnimation.drawFrame(0, this.ctx, this.x, this.y, this.currDirection, false);
    } else if(this.lastPressed === "down") {
      this.magicAnimation.drawSpecifcFrame(this.ctx, this.x, this.y, 0, 2);
    } else if(this.lastPressed === "melee" && this.currDirection === "right") {
      this.shootRightAnimation.drawSpecifcFrame(this.ctx, this.x, this.y, 13, 19);
    } else if(this.lastPressed === "up") {
      this.upAnimation.drawSpecifcFrame(this.ctx, this.x, this.y, 0, 0);
    }
    else {
      this.walkAnimation.drawFrame(0, this.ctx, this.x, this.y, this.currDirection, false);
    }
  }
}

// OrcBowman.prototype.jump = function() {
//
//     if (this.goingup) {
//         this.y -= 10
//         if (this.y == 300) {
//           this.goingup = false;
//           this.goingdown = true;
//         }
//     } else if (this.goingdown) {
//         this.y += 10
//         if (this.y >= 480) {
//           this.y = 480;
//           this.goingdown  = false;
//           this.goingup = true;
//           this.jumping = false;
//       }
//     }
//   }

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
  // if (this.game.chars["Space"] ) {
  //   this.jumping = true;
  //   this.lastPressed = "space";
  //   this.animating = true;
  // }

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

  // if (this.jumping) {
  //   this.jump();
  // }

  if(this.right) {
    this.x += this.game.clockTick * this.speed;
  } else if(this.left) {
    this.x -= this.game.clockTick * this.speed;
  } else {

  }
  if(this.x > 1650) this.x = -230;
}

AM.queueDownload("./img/forestBackground.jpg");
//AM.queueDownload("./img/Orc.png");
//AM.queueDownload("./img/Chest.png");
AM.queueDownload("./img/TronWithBow.png");
AM.queueDownload("./img/redhead.png");
AM.queueDownload("./img/skeleton.png");


AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/forestBackground.jpg")));
    //gameEngine.addEntity(new Chest(gameEngine, AM.getAsset("./img/Chest.png")));
    //gameEngine.addEntity(new OrcBowman(gameEngine, AM.getAsset("./img/Orc.png")));
    gameEngine.addEntity(new OrcBowman(gameEngine, AM.getAsset("./img/TronWithBow.png")));
    var redhead = new Redhead(gameEngine, 500, 500,  AM.getAsset("./img/redhead.png"));
    redhead.paceing = false;
    redhead.jumping = true;
    var redhead2 = new Redhead(gameEngine, 300, 300, AM.getAsset("./img/redhead.png"))
    var redhead3 = new Redhead(gameEngine, 200, 200,  AM.getAsset("./img/redhead.png"))
    redhead3.paceing = false;
    redhead3.spearing = true;

    var skeleton = new Skeleton(gameEngine, 200, 500,  AM.getAsset("./img/skeleton.png"));
    skeleton.paceing = false;
    skeleton.jumping = true;
    var skeleton2 = new Skeleton(gameEngine, 250, 580, AM.getAsset("./img/skeleton.png"))
    skeleton2.swinging = true;
    skeleton2.paceing = false;

    var skeleton3 = new Skeleton(gameEngine, 100, 200,  AM.getAsset("./img/skeleton.png"))
    skeleton3.paceing = false;
    skeleton3.spearing = true;


    gameEngine.addEntity(redhead);
    gameEngine.addEntity(redhead2);
    gameEngine.addEntity(redhead3);

    gameEngine.addEntity(skeleton);
    gameEngine.addEntity(skeleton2);
    gameEngine.addEntity(skeleton3);


    // gameEngine.addEntity(new MushroomDude(gameEngine, AM.getAsset("./img/mushroomdude.png")));
    // gameEngine.addEntity(new Cheetah(gameEngine, AM.getAsset("./img/runningcat.png")));
    // gameEngine.addEntity(new Guy(gameEngine, AM.getAsset("./img/guy.jpg")));

    console.log("All Done!");
});
