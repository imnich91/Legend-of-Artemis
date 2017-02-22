function BoundingRect(x, y, width, height, game) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.left = this.x;
  this.right = this.x + this.width;
  this.top = this.y;
  this.bottom = this.y + this.height;
  this.game = game;
  this.step = game.STEP;
  this.camera = game.camera;

  this.drawRect = function() {
    this.game.ctx.rect(this.x - this.camera.xView, this.y - this.camera.yView, this.width, this.height);
    this.game.ctx.stroke();
    this.game.ctx.clearRect(this.x - this.camera.xView, this.y - this.camera.yView, this.width,this.height);
   }

   this.updateLoc = function(x, y){
     this.x = x;
     this.y = y;
     this.left = this.x;
     this.right = this.x + this.width;
     this.top = this.y;
     this.bottom = this.y + this.height
   }
}
