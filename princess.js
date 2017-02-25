function princess(game, spritesheet) {
  this.animation = new Animation(spritesheet, 64, 64, 7, 0.1, 7, true, 1);

  this.xAdjust = 21;
  this.yAdjust = 13;
  this.boundingRect = new BoundingRect(50 + this.xAdjust, 270 + this.yAdjust, 22, 46, game);

  this.spritesheet = spritesheet;
  this.x = 50;
  this.y = 270-this.yAdjust - this.boundingRect.height;

  this.ctx = game.ctx;
  this.game = game;
  this.animating = false;

  this.camera = game.camera;


}

princess.prototype.draw = function() {
  this.animation.drawSpecificFrame(this.ctx,
   this.x - this.camera.xView,
   this.y - this.camera.yView,
   2, 0);
}

princess.prototype.update = function () {


}
