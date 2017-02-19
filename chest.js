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
