function Chest(game, spritesheet, x, y, scale) {
  this.animation = new Animation(spritesheet, 47, 38, 3.5, 0.2, 3.5, false, scale);
  this.x = x;
  this.y = y;
  this.xAdjust = -10 * scale;
  this.boundingRect = new BoundingRect(x + this.xAdjust, y, 67 * scale, 50 * scale, game);
  this.ctx = game.ctx;
  this.game = game;
  this.camera = game.camera;
}

Chest.prototype.draw = function() {
  // this.boundingRect.drawRect();
  if(this.open && !this.wasOpened) {
      this.animation.currFrame = 0;
      this.animation.drawFrame(this.game.clockTick, this.ctx, this.x - this.camera.xView , this.y - this.camera.yView, 0, true);
  } else if(this.wasOpened) {
    this.animation.drawSpecificFrame(this.ctx, this.x - this.camera.xView, this.y - this.camera.yView, 0, 3);
  }else {
      this.animation.drawFrame(0, this.ctx, this.x - this.camera.xView, this.y - this.camera.yView, 0, false);
  }
}

Chest.prototype.update = function() {
  if((this.game.chars["KeyC"] || this.game.chars["KeyL"]) && this.checkArtemisCollision()) {
    this.open = true;
  }
  if (this.animation.isDone()) {
      this.open = false;
      this.animation.elapsedTime = 0;
      this.wasOpened = true;
  }
}


Chest.prototype.checkArtemisCollision = function() {
  var artemis = this.game.entities[0];
  return this.collide(artemis);
}

Chest.prototype.collide = function(other) {
  return this.boundingRect.left < other.boundingRect.right // left side collision
  && this.boundingRect.right  > other.boundingRect.left // right side collision
  && this.boundingRect.bottom > other.boundingRect.top //
  && this.boundingRect.top < other.boundingRect.bottom;
}
