function Coin(game, spritesheet, x, y, marker) {
    this.animation = new Animation(spritesheet, 32, 32, 4, 0.10, 4, true, 1);
    this.x = x;
    this.y = y;
    this.xAdjust = 8;
    this.yAdjust = 8;
    this.boundingRect = new BoundingRect(this.x + this.xAdjust, this.y + this.yAdjust, 16, 16, game);

    this.collide = false;
    this.marker = marker;
    this.needToRemove = true;
    this.game = game;
    this.ctx = game.ctx;
    this.camera = game.camera;
    this.step = game.STEP;
}



Coin.prototype.draw = function() {

  //this.boundingRect.drawRect();

  if(!this.needToRemove) {
    this.game.removeTheUnit(this.marker);
  }else {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x - this.camera.xView, this.y-this.camera.yView, 0, true);
  }
}

Coin.prototype.update = function() {





}
