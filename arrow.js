function arrowObj(game, spritesheet, x, y, marker) {
    this.animation = new Animation(spritesheet, 64, 64, 1, 0.10, 1, true, 1);
    this.x = x + 26;
    this.startingX = x + 29;
    this.y = y - 6.5;
    this.radius = 10;
    this.collide = false;
    this.marker = marker;
    this.needToRemove = true;
    this.speed = 200;
    this.row = 19;
    this.game = game;
    this.ctx = game.ctx;
    this.frame = 4;
    this.flying = true;
}


arrowObj.prototype.shootArrow = function() {
  if (this.flying) {
      this.animation.drawSpecificFrame(this.ctx, this.x, this.y, this.row, 3)
  } else {
    this.x = x + 32;
    this.y = y -19;
  }
}

arrowObj.prototype.draw = function () {
    if (this.flying) {
        this.animation.drawSpecificFrame(this.ctx, this.x, this.y, this.row, 3)
    } else {

    }
}

arrowObj.prototype.update = function () {
    this.x += this.game.clockTick * this.speed;
    if(this.x - this.startingX >= 500 && this.needToRemove) {
        this.game.removeTheUnit(this.marker);
        this.needToRemove = false;
    } else if(this.collide) {
        this.game.removeTheUnit(this.marker);
        this.needToRemove = false;
    }
    if (this.x > 800) this.x = -230;
}
