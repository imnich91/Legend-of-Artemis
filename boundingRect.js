function BoundingRect(x, y, width, height, ctx) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.left = this.x;
  this.right = this.x + this.width;
  this.top = this.y;
  this.bottom = this.y + this.height;
  this.ctx = ctx;
  this.current = false;

  this.drawRect = function() {
    this.ctx.rect(this.x, this.y, this.width, this.height);
    this.ctx.stroke();
    this.ctx.clearRect(this.x, this.y, this.width,this.height);
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
