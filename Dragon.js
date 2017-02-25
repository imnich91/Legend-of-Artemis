function Dragon(game,x, y, spritesheet, marker) {
  this.flyingRightAnimation = new Animation(spritesheet, 80, 80, 3.5, 0.15, 3.5, true, 2);
  this.flyingLeftAnimation = new Animation(AM.getAsset("./img/characters/dragon_fly_left.png"), 80, 80, 3.5, 0.15, 3.5, true, 2);

  this.xAdjust = 24;
  this.yAdjust = 50;
  this.boundingRect = new BoundingRect(x + this.xAdjust, y + this.yAdjust, 120, 80, game);
  this.previousLoc = new BoundingRect(x + this.xAdjust, y + this.yAdjust, 120, 80, game);
  this.marker = marker;

  this.spritesheet = spritesheet;
  this.x = x - this.xAdjust -this.boundingRect.width;
  this.y = y-this.yAdjust - this.boundingRect.height;

  this.ctx = game.ctx;
  this.game = game;
  this.animating = true;

  this.flying = true;

  this.camera = game.camera;
  this.speed = 100;

  this.health = 100;

}

Dragon.prototype.draw = function() {
  if(this.rightFaceing) {
    this.flyingRightAnimation.drawFrame(this.game.clockTick,
        this.ctx,
        this.x - this.camera.xView,
        this.y - this.camera.yView
        , 0, true);
  } else if(this.leftFaceing) {
    this.flyingLeftAnimation.drawFrame(this.game.clockTick,
        this.ctx,
        this.x - this.camera.xView,
        this.y - this.camera.yView
        , 0, true);
  }

}

Dragon.prototype.update = function () {
  if(this.x >= 400) {
    this.xAdjust = 34;

    this.rightFaceing = false;
    this.leftFaceing = true;
  } else if(this.x <= 50){
    this.xAdjust = 24;
    this.leftFaceing = false;
    this.rightFaceing = true;
  }

  if(this.rightFaceing) {
    this.x += this.game.clockTick * this.speed;
  } else {
    this.x -= this.game.clockTick * this.speed;
  }

  this.cX = this.x - this.camera.xView;
  this.cY = this.y - this.camera.yView;

  this.previousLoc.updateLoc(this.boundingRect.x, this.boundingRect.y);
  this.boundingRect.updateLoc(this.x + this.xAdjust, this.y + this.yAdjust);

  if(this.health <= 0) {
    this.game.removeTheUnit(this.marker);
  }

}
