var GRAVITY = 20;
var DEATH = 2500;
var FOLLOWDISTANCE = 260;


function SkeletonShooter(game, x, y, spritesheet) {
    this.animation = new Animation(spritesheet, 64, 64, 9, 0.1, 9, true, 1);
    this.shootAnimation = new Animation(spritesheet, 64, 64, 13, 0.10, 13, false, 1);
    this.jumpAnimation = new Animation(spritesheet, 64, 64, 8, 0.1, 8, false, 1);

    this.xAdjust = 21;
    this.yAdjust = 13;
    this.boundingRect = new BoundingRect(x + this.xAdjust, y + this.yAdjust, 22, 46, game);
    this.previousLoc = new BoundingRect(x + this.xAdjust, y + this.yAdjust, 22, 46, game);
    this.x = x;
    this.y = y;

    this.startX = x;
    this.startY = y;

    this.ground = y;
    this.newXLocation = x;
    this.speed = 100;
    this.pacingDistance = 40;
    this.game = game;
    this.ctx = game.ctx;
    this.jumping = false;
    this.shooting = false;
    this.rightFaceing = false;
    this.leftFaceing = true;
    this.paceing = true;
    this.walking = false;
    this.newPlatform = false;
    this.falling = false;
    this.currentPlatform = null;
    this.step = game.STEP;
    this.camera = game.camera;
    this.following = false;

    this.shooted = false;

    this.width = 64;
    this.height = 64;
    this.cX = (this.x-this.width/2) - this.camera.xView;
    this.cY = (this. y-this.height/2) - this.camera.yView;

  }

SkeletonShooter.prototype.resetWalkingSpeed = function() {
    this.speed = 100;
  }

SkeletonShooter.prototype.resetPacingSpeed = function() {
    this.speed = 50;
  }


SkeletonShooter.prototype.collide = function(other) {
  return this.boundingRect.left < other.boundingRect.right // left side collision
  && this.boundingRect.right  > other.boundingRect.left // right side collision
  && this.boundingRect.bottom > other.boundingRect.top //
  && this.boundingRect.top < other.boundingRect.bottom;
}

SkeletonShooter.prototype.collideLeft = function(other) {
  return this.boundingRect.left < this.previousLoc.left
  && this.boundingRect.right > other.boundingRect.right;
}

SkeletonShooter.prototype.collideRight = function(other) {
  return this.boundingRect.right > this.previousLoc.right
  && this.boundingRect.left < other.boundingRect.left;
}

SkeletonShooter.prototype.collideTop = function(other) {
  return this.boundingRect.top > this.previousLoc.top
  && other.boundingRect.top > this.previousLoc.bottom;
}

SkeletonShooter.prototype.collideBottom = function(other) {
  return this.boundingRect.bottom < this.previousLoc.bottom
  && this.previousLoc.left < other.boundingRect.right
  && this.previousLoc.right > other.boundingRect.left;
}

SkeletonShooter.prototype.draw = function () {

   // this.boundingRect.drawRect();

  if (this.shooting) {
    this.shoot();
  } else if (this.walking) {
      this.resetWalkingSpeed();
      if (this.rightFaceing) this.moveRight();
      else this.moveLeft();
  } else if (this.paceing) {
      this.resetPacingSpeed();
      this.pace();
    }

    if (this.jumping) {
      this.jump();
      //this.jumpAnimation.elapsedTime += this.game.clockTick;
    }
    if (this.falling && !this.jumping) {
      this.fall();
    }
  }

SkeletonShooter.prototype.update = function () {

    this.cX = this.x - this.camera.xView;
    this.cY = this.y - this.camera.yView;

    this.previousLoc.updateLoc(this.boundingRect.x, this.boundingRect.y);
    this.boundingRect.updateLoc(this.x + this.xAdjust, this.y + this.yAdjust);

    this.checkPlatformCollisions();
    this.checkArtemisCollision();


    if(this.y >= DEATH) {
        this.x = this.startX;
        this.y = this.startY - this.yAdjust - this.boundingRect.height;
        this.ground = this.startY - this.yAdjust - this.boundingRect.height;
        this.falling = false;
    }

    // if (this.game.space) {
    //   if (!this.falling)
    //     this.jumping = true;
    // } else if (this.game.s) {
    //   this.paceing = false;
    //   this.shooting = true;
    // }
    //
    // if (this.game.right) {
    //   this.paceing = false;
    //   this.walking = true;
    //   this.rightFaceing = true;
    //   this.leftFaceing = false;
    //   this.newXLocation = this.x;
    //
    // } else if (this.game.left) {
    //   this.paceing = false;
    //   this.walking = true;
    //   this.leftFaceing = true;
    //   this.rightFaceing = false;
    //   this.newXLocation = this.x;
    // }


}

SkeletonShooter.prototype.checkArtemisCollision = function() {

  var artemis = this.game.entities[0];

  var myMiddle = this.boundingRect.left + (this.boundingRect.width / 2);
  var hisMiddle = artemis.boundingRect.left + (artemis.boundingRect.width / 2);

  if (Math.abs(myMiddle - hisMiddle) < this.boundingRect.width + 300) {
    this.shooting = true;
  } else if (Math.abs(myMiddle - hisMiddle) <= FOLLOWDISTANCE) {
    if (myMiddle - hisMiddle > 0) {
      this.leftFaceing = true;
      this.rightFaceing = false;
    } else {
      this.rightFaceing = true;
      this.leftFaceing = false;
    }
    this.pacing = false;
    this.walking = true;
    this.newXLocation = this.x;
    this.following = true;
  } else {
    this.walking = false;
    this.paceing = true;
    this.following = false;
  }
};

SkeletonShooter.prototype.checkPlatformCollisions = function() {
  for (var i = 0; i < this.game.platforms.length; i ++) {
    var platform = this.game.platforms[i];

    if (this.collide(platform)) {

      if(this.collideBottom(platform) ) {
        this.y = platform.boundingRect.bottom - this.yAdjust;
        this.falling = true;
        this.jumping = false;
      }
      else if (this.collideTop(platform)) {
        this.newPlatform = true;
        this.currentPlatform = platform;

      }
      else if (this.collideLeft(platform)) {
        this.x = platform.boundingRect.right - this.xAdjust;
        this.boundingRect.updateLoc(this.x + this.xAdjust, this.y + this.yAdjust);

        if (this.following) {
            this.jumping = true;
        } else if (this.paceing) {
          this.leftFaceing = false;
          this.rightFaceing = true;
        }
      }
      else if (this.collideRight(platform)) {
        this.x = platform.boundingRect.left - this.xAdjust - this.boundingRect.width;
        this.boundingRect.updateLoc(this.x + this.xAdjust, this.y + this.yAdjust);

        if (this.following) {
          this.jumping = true;
        } else if (this.paceing) {
          this.leftFaceing = true;
          this.rightFaceing = false;
        }
      }
  }

  if (this.boundingRect.left > this.currentPlatform.boundingRect.right
      || this.boundingRect.right < this.currentPlatform.boundingRect.left) {
        this.currentPlatform.isCurrent = false;
        this.falling = true;
      }
  }
}

SkeletonShooter.prototype.shoot = function() {
  var artemis = this.game.entities[0];
  if (this.rightFaceing && (artemis.x > this.x)) {
    // this.shootAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 7);
    this.shootAnimation.drawFrame(this.game.clockTick, this.ctx, this.cX, this.cY, 19, true);

  } else if (this.rightFaceing && (artemis.x < this.x)) {
    // this.shootAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 5);
    this.shootAnimation.drawFrame(this.game.clockTick, this.ctx, this.cX, this.cY, 17, true);
  } else if (!this.rightFaceing && (artemis.x > this.x)) {
    this.shootAnimation.drawFrame(this.game.clockTick, this.ctx, this.cX, this.cY, 19, true);
  } else {
    this.shootAnimation.drawFrame(this.game.clockTick, this.ctx, this.cX, this.cY, 17, true);
  }
  //adding the arrow obj
  if(this.shootAnimation.currentFrame() === 9 && !this.shooted) {
    var marker = new Date().getUTCMilliseconds(); //assign a unique ID number for each arrow
    var arrow = new arrowObj(this.game, AM.getAsset("./img/characters/redhead.png"), this.x, this.y, marker);
    this.game.addEntity(arrow);
    this.shooted = true;
    console.log("Shooted");
    myAudio = new Audio('./se/bowFire.mp3');
    myAudio.play();
  } else if(this.shootAnimation.currentFrame() > 10) {
    this.shooted = false;
  }

  if (this.shootAnimation.isDone()) {
    this.shooting = false;
    this.shootAnimation.elapsedTime = 0;
    this.paceing = true;
  }
}

SkeletonShooter.prototype.fall = function() {

  this.paceing = false;
  var currframe = this.animation.currentFrame();

  if (this.rightFaceing) {
    if (this.shooting){
      this.shoot()
    } else {
      // this.animation.drawSpecificFrame(this.ctx, this.x, this.y, 11, currframe);
      this.animation.drawSpecificFrame(this.ctx, this.cX, this.cY, 11, currframe);
    }

  } else if (this.leftFaceing) {
      if (this.shooting) {
        this.shoot()
      } else {
        // this.animation.drawSpecificFrame(this.ctx, this.x, this.y, 9, currframe);
        this.animation.drawSpecificFrame(this.ctx, this.cX, this.cY, 9, currframe);
      }
  }

  this.y += GRAVITY * this.jumpAnimation.elapsedTime;
  this.jumpAnimation.elapsedTime += this.game.clockTick;

  if (this.newPlatform) {
    var newGround = this.currentPlatform.boundingRect.y - this.boundingRect.height - this.yAdjust;

    if (this.y >= newGround) {
      this.ground = newGround;
      this.jumping = false;
      this.jumpAnimation.elapsedTime = 0;
      this.paceing = true;
      this.y = this.ground;
      this.newPlatform = false;
      this.currentPlatform.isCurrent = true;
      this.falling = false;
    }
} else {
    var newGround = DEATH;
    if (this.y >= newGround) {
      this.jumpAnimation.elapsedTime = 0;
      this.paceing = true;
      this.y = newGround;
      this.falling = false;
      this.jumping = false;
    }
  }
}


SkeletonShooter.prototype.jump = function() {

  this.jumpAnimation.elapsedTime += this.game.clockTick;
  this.paceing = false;
  var currframe = this.animation.currentFrame();

  if (this.rightFaceing) {
    if (this.shooting){
      this.shoot()
    } else {
      // this.animation.drawSpecificFrame(this.ctx, this.x, this.y, 11, currframe);
      this.animation.drawSpecificFrame(this.ctx, this.cX, this.cY, 11, currframe);
    }

  } else if (this.leftFaceing) {
      if (this.shooting) {
        this.shoot()
      } else {
        // this.animation.drawSpecificFrame(this.ctx, this.x, this.y, 9, currframe);
        this.animation.drawSpecificFrame(this.ctx, this.cX, this.cY, 9, currframe);
      }
  }

  var jumpDistance = this.jumpAnimation.elapsedTime / this.jumpAnimation.totalTime;

  var totalHeight = 200;

  if (jumpDistance > 0.5)
      jumpDistance = 1 - jumpDistance;

  var height = jumpDistance * 2 * totalHeight;
  var height = totalHeight*(-4 * (jumpDistance * jumpDistance - jumpDistance));

  this.y = this.ground - height;

  if (this.newPlatform) {
    var newGround = this.currentPlatform.boundingRect.y - this.boundingRect.height - this.yAdjust;

    if (this.y >= newGround) {
      this.ground = newGround;
      this.jumping = false;
      this.jumpAnimation.elapsedTime = 0;
      this.paceing = true;
      this.y = this.ground;
      this.newPlatform = false;
      this.currentPlatform.isCurrent = true;
      this.falling = false;
    }

  } else if (this.falling) {
        var newGround = DEATH;

        if (this.y >= newGround) {
          this.ground = newGround;
          this.jumping = false;
          this.jumpAnimation.elapsedTime = 0;
          this.paceing = true;
          this.y = this.ground;
          this.newPlatform = false;
          this.falling = false;

        }

  }  else if (this.y >= this.ground) {
      this.jumping = false;
      this.jumpAnimation.elapsedTime = 0;
      this.paceing = true;
      this.y = this.ground;
  }

}

SkeletonShooter.prototype.pace = function() {

  if (this.leftFaceing) {
      this.moveLeft()
      if (this.newXLocation - this.x >= this.pacingDistance) {
        this.leftFaceing = false;
        this.rightFaceing = true;
      }
  } else if (this.rightFaceing) {
    this.moveRight()
    if (this.x - this.newXLocation >= this.pacingDistance) {
      this.rightFaceing = false;
      this.leftFaceing = true;
    }
  }
}

SkeletonShooter.prototype.moveRight = function() {
    this.x += this.game.clockTick * this.speed;

    if (!this.jumping) {
      // this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 11);
      this.animation.drawFrame(this.game.clockTick, this.ctx, this.cX, this.cY, 11, true);
      this.walking = false;
      this.paceing = true;
    }
  }

SkeletonShooter.prototype.moveLeft = function() {
  this.x -= this.game.clockTick * this.speed;

  if (!this.jumping) {
    // this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 9);
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.cX, this.cY, 9, true)
    this.walking = false;
    this.paceing = true;

  }
}