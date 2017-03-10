function Fireball(game, dragon, spritesheet, x, y, marker) {
    this.animation = new Animation(spritesheet, 32, 32, 3, 0.10, 3, true, 2);

    this.x = x -10;
    this.y = y + 50;
    this.xAdjust = 20;
    this.yAdjust = 15;
    this.boundingRect = new BoundingRect(this.x + this.xAdjust, this.y + this.yAdjust, 35,35, game);
    this.dragon = dragon;
    this.radius = 10;
    this.collide = false;
    this.marker = marker;
    this.needToRemove = true;
    this.speed = 430;
    this.row = 19;
    this.game = game;
    this.ctx = game.ctx;
    this.frame = 4;
    this.flying = true;
    this.flyingRight = false;
    this.flyingLeft = false;

    if (this.dragon.rightFaceing) {
      this.flyingRight = true;
    } else {
      this.flyingLeft = true;
    }

    this.camera = game.camera;
    this.step = game.STEP;
}

Fireball.prototype.draw = function () {

  //this.boundingRect.drawRect();

    if(!this.needToRemove) {
      this.game.removeTheUnit(this.marker);
    }else {
      if (this.flying) {
          this.animation.drawFrame(this.game.clockTick, this.ctx, this.x - this.camera.xView, this.y-this.camera.yView, 0, true);
        }
      }
}

Fireball.prototype.update = function () {

    if (this.flyingRight) {

      this.x += this.game.clockTick * this.speed;
    } else {
      this.x -= this.game.clockTick * this.speed;
    }

    // flies off screen left side
    if(this.x + this.boundingRect.width < 0 && this.needToRemove) {
        this.needToRemove = false;
    }

    // flies off screen right side
    if(this.x > this.game.worldWidth && this.needToRemove) {
        this.needToRemove = false;
    }
    this.boundingRect.updateLoc(this.x  + this.xAdjust , this.y + this.yAdjust);

}
