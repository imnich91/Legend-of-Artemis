function Dragon(game,x, y, spritesheet, marker) {
  this.flyingRightAnimation = new Animation(spritesheet, 80, 80, 3.5, 0.15, 3.5, true, 2);
  this.flyingLeftAnimation = new Animation(AM.getAsset("./img/characters/dragon_fly_left.png"), 80, 80, 3.5, 0.15, 3.5, true, 2);
  this.lookRightAnimation = new Animation(AM.getAsset("./img/characters/dragon_lookright.png"), 80, 80, 1, 0.15, 1, true, 2);
  this.lookLeftAnimation = new Animation(AM.getAsset("./img/characters/dragon_lookleft.png"), 80, 80, 1, 0.15, 1, true, 2);
  this.attackRightAnimation = new Animation(AM.getAsset("./img/characters/dragon_attack_right.png"), 80, 80, 2.5, 0.2, 2.5, true, 2);
  this.attackLeftAnimation = new Animation(AM.getAsset("./img/characters/dragon_attack_left.png"), 80, 80, 2.5, 0.2, 2.5, true, 2);



  this.xAdjust = 24;
  this.yAdjust = 50;
  this.boundingRect = new BoundingRect(x + this.xAdjust, y + this.yAdjust, 120, 80, game);
  this.previousLoc = new BoundingRect(x + this.xAdjust, y + this.yAdjust, 120, 80, game);
  this.marker = marker;

  this.spritesheet = spritesheet;
  this.x = x - this.xAdjust -this.boundingRect.width;
  this.y = y-this.yAdjust - this.boundingRect.height;
  this.startX = this.x;
  this.startY = this.y;
  this.ctx = game.ctx;
  this.game = game;
  this.animating = false;
  this.attacking = false
  this.flying = false;
  this.standing = true;
  this.rightFaceing = true;
  this.rightFaceing = false;


  this.camera = game.camera;
  this.speed = 150;

  this.health = 100;
  this.yRangeDetection = 500;

}

Dragon.prototype.draw = function() {
  if(this.standing) {
    if(this.rightFaceing) {
      this.lookRightAnimation.drawFrame(this.game.clockTick,
          this.ctx,
          this.x - this.camera.xView,
          this.y - this.camera.yView
          , 0, false);
    } else{
      this.lookLeftAnimation.drawFrame(this.game.clockTick,
          this.ctx,
          this.x - this.camera.xView,
          this.y - this.camera.yView
          , 0, false);
    }

  } else if(this.flying) {
    if(this.rightFaceing) {
      this.flyingRightAnimation.drawFrame(this.game.clockTick,
          this.ctx,
          this.x - this.camera.xView,
          this.y - this.camera.yView
          , 0, true);
    } else {
        this.flyingLeftAnimation.drawFrame(this.game.clockTick,
        this.ctx,
        this.x - this.camera.xView,
        this.y - this.camera.yView
        , 0, true);
    }
  }else if(this.attacking) {
    if(this.rightFaceing) {
      this.attackRightAnimation.drawFrame(this.game.clockTick,
          this.ctx,
          this.x - this.camera.xView,
          this.y - this.camera.yView
          , 0, true);
    } else {
        this.attackLeftAnimation.drawFrame(this.game.clockTick,
        this.ctx,
        this.x - this.camera.xView,
        this.y - this.camera.yView
        , 0, true);
    }
  }
}

Dragon.prototype.update = function () {
  if(this.x >= this.startX + 400 && this.flying && !this.following) {
    this.xAdjust = 24;
    this.y = this.startY;
    this.rightFaceing = false;
    this.leftFaceing = true;
  } else if(this.x <= this.startX && this.flying && ! this.following){
    this.xAdjust = 24;
    this.leftFaceing = false;
    this.rightFaceing = true;
    this.y = this.startY;
  }

  if(this.rightFaceing && this.flying) {
    this.x += this.game.clockTick * this.speed;
  } else if(this.leftFaceing && this.flying) {
    this.x -= this.game.clockTick * this.speed;
  }

  this.cX = this.x - this.camera.xView;
  this.cY = this.y - this.camera.yView;

  this.previousLoc.updateLoc(this.boundingRect.x, this.boundingRect.y);
  this.boundingRect.updateLoc(this.x + this.xAdjust, this.y + this.yAdjust);

  if(this.health <= 0) {
    this.game.removeTheUnit(this.marker);
  }

  this.checkArtemisCollision();

}

Dragon.prototype.checkArtemisCollision = function() {

  var artemis = this.game.entities[0];

  var myMiddle = this.boundingRect.left + (this.boundingRect.width / 2);
  var hisMiddle = artemis.boundingRect.left + (artemis.boundingRect.width / 2);

  var myHeightMiddle = this.boundingRect.top + (this.boundingRect.height/2);
  var hisHeightMiddle = artemis.boundingRect.top + (this.boundingRect.height/2);

  if (Math.abs(myMiddle - hisMiddle) < this.boundingRect.width + 14 &&
     Math.abs(myHeightMiddle - hisHeightMiddle) < this.yRangeDetection ) {
     this.attacking = true;
     this.flying = false;
  } else if (Math.abs(myMiddle - hisMiddle) <= FOLLOWDISTANCE &&
    Math.abs(myHeightMiddle - hisHeightMiddle) < this.yRangeDetection) {
    if (myMiddle - hisMiddle > 0) {
      this.leftFaceing = true;
      this.flying = true
      this.rightFaceing = false;
      this.standing = false;
    } else {
      this.flying = true;
      this.rightFaceing = true;
      this.leftFaceing = false;
      this.standing = false;

    }
    this.newXLocation = this.x;
    this.following = true;

  } else {
    this.attacking = false
    this.flying = true;
    this.following = false;
  }
};
