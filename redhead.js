var GRAVITY = 20;
var DEATH = 2500;
var WALKINGOFFPLATFORM = 0;


function Redhead(game, x, y, spritesheet) {
    this.animation = new Animation(spritesheet, 64, 64.1, 9, 0.1, 9, true, 1);
    this.spearAnimation = new Animation(spritesheet, 64, 64.1, 8, 0.08, 7, false, 1);
    this.jumpAnimation = new Animation(spritesheet, 64, 64.1, 8, 0.1, 8, false, 1);
    // this.animation = new Animation(spritesheet, 64, 64, 9, 0.1, 9, true, 2);
    // this.spearAnimation = new Animation(spritesheet, 64, 64, 8, 0.08, 7, false, 2);
    // this.jumpAnimation = new Animation(spritesheet, 64, 64, 8, 0.1, 8, false, 2);

    this.xAdjust = 21;
    this.yAdjust = 13;
    this.boundingRect = new BoundingRect(x + this.xAdjust, y + this.yAdjust, 22, 46, game);
    this.previousLoc = new BoundingRect(x + this.xAdjust, y + this.yAdjust, 22, 46, game);
    this.x = x;
    this.y = y;

    this.ground = y;
    this.newXLocation = x;
    this.speed = 350;
    this.pacingDistance = 40;
    this.game = game;
    this.ctx = game.ctx;
    this.jumping = false;
    this.spearing = false;
    this.rightFaceing = false;
    this.leftFaceing = true;
    this.paceing = true;
    this.walking = false;
    this.newPlatform = false;
    this.falling = false;
    this.currentPlatform = null;
    this.step = game.STEP;
    this.camera = game.camera;

    this.width = 64;
    this.height = 64.1;
    this.cX = (this.x-this.width/2) - this.camera.xView;
    this.cY = (this. y-this.height/2) - this.camera.yView;

  }

Redhead.prototype.resetWalkingSpeed = function() {
    this.speed = 350;
  }

Redhead.prototype.resetPacingSpeed = function() {
    this.speed = 50;
  }


Redhead.prototype.collide = function(other) {
  return this.boundingRect.left < other.right // left side collision
  && this.boundingRect.right  > other.left // right side collision
  && this.boundingRect.bottom > other.top //
  && this.boundingRect.top < other.bottom;
}

Redhead.prototype.collideLeft = function(platform) {
  return this.boundingRect.left < this.previousLoc.left
  && this.boundingRect.right > platform.right;
}

Redhead.prototype.collideRight = function(platform) {
  return this.boundingRect.right > this.previousLoc.right
  && this.boundingRect.left < platform.left;
}

Redhead.prototype.collideTop = function(platform) {
  return this.boundingRect.top > this.previousLoc.top
  && platform.top > this.previousLoc.bottom;
}

Redhead.prototype.collideBottom = function(platform) {
  return this.boundingRect.bottom < this.previousLoc.bottom
  && this.previousLoc.left < platform.right
  && this.previousLoc.right > platform.left;
}




Redhead.prototype.draw = function () {

  //  this.boundingRect.drawRect();

  if (this.spearing) {
    this.spear();
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

Redhead.prototype.update = function () {

    this.previousLoc.updateLoc(this.boundingRect.x, this.boundingRect.y);
    this.boundingRect.updateLoc(this.x + this.xAdjust, this.y + this.yAdjust);

    this.cX = (this.x) - this.camera.xView;
    this.cY = (this. y) - this.camera.yView;

    if (this.game.space) {
      console.log("gothere");
      if (!this.falling)
        this.jumping = true;
    } else if (this.game.s) {
      this.paceing = false;
      this.spearing = true;

    }

    if (this.game.right) {
      this.paceing = false;
      this.walking = true;
      this.rightFaceing = true;
      this.leftFaceing = false;
      this.newXLocation = this.x;



    } else if (this.game.left) {
      this.paceing = false;
      this.walking = true;
      this.leftFaceing = true;
      this.rightFaceing = false;
      this.newXLocation = this.x;

    }

for (var i = 0; i < this.game.platforms.length; i ++) {
  var platform = this.game.platforms[i];

  if (this.collide(platform)) {

    if(this.collideBottom(platform) ) {
      this.y = platform.bottom - this.yAdjust;
      this.falling = true;
      this.jumping = false;
    }
    else if (this.collideTop(platform)) {
      this.newPlatform = true;
      this.currentPlatform = platform;

    }
    else if (this.collideLeft(platform)) {
      this.x = platform.right - this.xAdjust;
      this.boundingRect.updateLoc(this.x + this.xAdjust, this.y + this.yAdjust);
      if (this.paceing) {
        this.leftFaceing = false;
        this.rightFaceing = true;
      }
    }
    else if (this.collideRight(platform)) {
      this.x = platform.left - this.xAdjust - this.boundingRect.width;
      this.boundingRect.updateLoc(this.x + this.xAdjust, this.y + this.yAdjust);
      if (this.paceing) {
        this.leftFaceing = true;
        this.rightFaceing = false;
      }
    }
  }

  if (this.boundingRect.left > this.currentPlatform.right
      || this.boundingRect.right < this.currentPlatform.left) {
        this.currentPlatform.current = false;
        this.falling = true;
      }
  }

}


Redhead.prototype.spear = function() {

  if (this.rightFaceing) {
    // this.spearAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 7);
    this.spearAnimation.drawFrame(this.game.clockTick, this.ctx, this.cX, this.cY, 7, true);

  } else {
    // this.spearAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 5);
    this.spearAnimation.drawFrame(this.game.clockTick, this.ctx, this.cX, this.cY, 5, true);

  }

    if (this.spearAnimation.isDone()) {
      this.spearing = false;
      this.spearAnimation.elapsedTime = 0;
      this.paceing = true;
    }
}

Redhead.prototype.fall = function() {

  this.paceing = false;
  var currframe = this.animation.currentFrame();

  if (this.rightFaceing) {
    if (this.spearing){
      this.spear()
    } else {
      // this.animation.drawSpecificFrame(this.ctx, this.x, this.y, 11, currframe);
      this.animation.drawSpecificFrame(this.ctx, this.cX, this.cY, 11, currframe);
    }

  } else if (this.leftFaceing) {
      if (this.spearing) {
        this.spear()
      } else {
        // this.animation.drawSpecificFrame(this.ctx, this.x, this.y, 9, currframe);
        this.animation.drawSpecificFrame(this.ctx, this.cX, this.cY, 9, currframe);
      }
  }

  if (WALKINGOFFPLATFORM === 0) {
    this.y = this.y-1;
    WALKINGOFFPLATFORM ++;
  } else {
    this.y += GRAVITY * this.jumpAnimation.elapsedTime;
    WALKINGOFFPLATFORM = 0;
  }

  this.jumpAnimation.elapsedTime += this.game.clockTick;

  if (this.newPlatform) {
    var newGround = this.currentPlatform.y - this.boundingRect.height - this.yAdjust;

    if (this.y >= newGround) {
      this.ground = newGround;
      this.jumping = false;
      this.jumpAnimation.elapsedTime = 0;
      this.paceing = true;
      this.y = this.ground;
      this.newPlatform = false;
      this.currentPlatform.current = true;
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


Redhead.prototype.jump = function() {

  this.jumpAnimation.elapsedTime += this.game.clockTick;
  this.paceing = false;
  var currframe = this.animation.currentFrame();

  if (this.rightFaceing) {
    if (this.spearing){
      this.spear()
    } else {
      // this.animation.drawSpecificFrame(this.ctx, this.x, this.y, 11, currframe);
      this.animation.drawSpecificFrame(this.ctx, this.cX, this.cY, 11, currframe);
    }

  } else if (this.leftFaceing) {
      if (this.spearing) {
        this.spear()
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
    var newGround = this.currentPlatform.y - this.boundingRect.height - this.yAdjust;

    if (this.y >= newGround) {
      this.ground = newGround;
      this.jumping = false;
      this.jumpAnimation.elapsedTime = 0;
      this.paceing = true;
      this.y = this.ground;
      this.newPlatform = false;
      this.currentPlatform.current = true;
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

Redhead.prototype.pace = function() {

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

Redhead.prototype.moveRight = function() {
    this.x += this.game.clockTick * this.speed;

    if (!this.jumping) {
      // this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 11);
      this.animation.drawFrame(this.game.clockTick, this.ctx, this.cX, this.cY, 11, true);
      this.walking = false;
      this.paceing = true;
    }
  }

Redhead.prototype.moveLeft = function() {
  this.x -= this.game.clockTick * this.speed;

  if (!this.jumping) {
    // this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 9);
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.cX, this.cY, 9, true)
    this.walking = false;
    this.paceing = true;

  }
}
