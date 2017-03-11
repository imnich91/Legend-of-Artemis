var DRAGONFOLLOW = 500;
function Dragon(game,x, y, spritesheet, marker) {
  this.flyingRightAnimation = new Animation(spritesheet, 80, 80, 3.5, 0.15, 3.5, true, 2);
  this.flyingLeftAnimation = new Animation(AM.getAsset("./img/characters/dragon_fly_left.png"), 80, 80, 3.5, 0.15, 3.5, true, 2);
  this.attackRightAnimation = new Animation(AM.getAsset("./img/characters/dragon_attack_right.png"), 80, 80, 2.5, 0.2, 2.5, true, 2);
  this.attackLeftAnimation = new Animation(AM.getAsset("./img/characters/dragon_attack_left.png"), 80, 80, 2.5, 0.2, 2.5, true, 2);

  this.xAdjust = 24;
  this.yAdjust = 50;
  this.boundingRect = new BoundingRect(x + this.xAdjust, y + this.yAdjust, 100, 80, game);
  this.marker = marker;

  this.spritesheet = spritesheet;
  this.x = x - this.xAdjust -this.boundingRect.width;
  this.y = y-this.yAdjust - this.boundingRect.height;
  this.startX = this.x;
  this.startY = this.y;
  this.ctx = game.ctx;
  this.game = game;
  this.fireCD = 1;
  this.animating = false;
  this.attacking = false;
  this.flying = true;
  this.rightFaceing = true;
  this.leftFaceing = false;

  this.shootedRight = false;
  this.shootedLeft = false;

  this.name = "Dragon";
  this.attackBox = null;
  this.lunging = false;
  this.camera = game.camera;
  this.speed = 150;

  this.health = 2000;
  this.yRangeDetection = 250;

}

Dragon.prototype.draw = function() {

  // this.boundingRect.drawRect();
  if(this.flying) {
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
      this.attack();
  }
}

Dragon.prototype.update = function () {
  // console.log("this.flying ", this.flying);
  // console.log("rigth faceing " ,this.rightFaceing);

  if(this.rightFaceing) {
    this.xAdjust = 44;
  } else if(this.leftFaceing) {
    this.xAdjust = 14
  }else {
    this.xAdjust = 24;
  }

  if(this.x >= this.startX + 400 && this.flying && !this.following) {
    if(this.y >= this.startY) {
      this.y -= this.game.clockTick * this.speed;
    } else{
      this.y += this.game.clockTick * this.speed;
    }
    this.xAdjust = 24;
    this.rightFaceing = false;
    this.leftFaceing = true;
  } else if(this.x < this.startX && this.flying && !this.following){
    if(this.y <= this.startY) {
      this.y -= this.game.clockTick * this.speed;
    } else{
      this.y += this.game.clockTick * this.speed;
    }
    this.xAdjust = 24;
    this.leftFaceing = false;
    this.rightFaceing = true;
  }

  if(this.flying && this.following) {
    if(this.y <= this.game.entities[0].y - 70) {
      this.y += this.game.clockTick * this.speed;
    } else if(this.y >= this.game.entities[0].y - 60){
      this.y -= this.game.clockTick * this.speed;
    }
  }

  if(this.rightFaceing && this.flying) {
    this.x += this.game.clockTick * this.speed;
  } else if(this.leftFaceing && this.flying) {
    this.x -= this.game.clockTick * this.speed;
  }

  this.cX = this.x - this.camera.xView;
  this.cY = this.y - this.camera.yView;

  this.boundingRect.updateLoc(this.x + this.xAdjust, this.y + this.yAdjust);

  if(this.health <= 0) {
    this.game.removeTheUnit(this.marker);
  }

  this.checkArtemisCollision();
  // this.checkArtemisArrowCollision();
  this.shootFireball();
}

Dragon.prototype.shootFireball = function() {
  var artemis = this.game.entities[0];

//&& !this.shooted
  if(this.rightFaceing) {
    //adding the arrow obj
    if(this.flyingRightAnimation.currentFrame() === 0 && !this.shootedRight ) {
      var marker = new Date().getUTCMilliseconds(); //assign a unique ID number for each arrow
      var fireball = new Fireball(this.game, this, AM.getAsset("./img/extras/dragon_fireball.png"), this.x+130, this.y, marker);
      this.fireCD--;
      if(this.fireCD < 0) {
        this.fireCD = 1;
        this.game.addEntity(fireball);
        myAudio = new Audio('./se/fireBallB.mp3')
        myAudio.play();
      }
      this.shootedRight = true;


    }
    if(this.flyingRightAnimation.currentFrame() > 0) {
      this.shootedRight = false;
    }
  } else {
    //adding the arrow obj
    if(this.flyingLeftAnimation.currentFrame() === 0 && !this.shootedLeft ) {
      var marker = new Date().getUTCMilliseconds(); //assign a unique ID number for each arrow
      var fireball = new Fireball(this.game, this, AM.getAsset("./img/extras/dragon_fireball.png"), this.x, this.y, marker);
      this.fireCD--;
      if(this.fireCD < 0) {
        this.fireCD = 1;
        this.game.addEntity(fireball);
        myAudio = new Audio('./se/fireBallB.mp3')
        myAudio.play();
      }
      this.shootedLeft = true;

    }
    if(this.flyingLeftAnimation.currentFrame() !== 0) {
      this.shootedLeft = false;
    }
  }

}



Dragon.prototype.attack = function() {

  if (this.rightFaceing) {

    if(this.attackRightAnimation.currentFrame() === 1 && !this.lunging) {
      this.attackBox = new BoundingRect(this.x + 130, this.y + 75, 40, 40, this.game);
      this.lunging = true;

      myAudio = new Audio('./se/bite.mp3');
      myAudio.play();
    } else if(this.attackRightAnimation.currentFrame() >1) {
      this.lunging = false;
      this.attackBox = null;
    }
    // this.spearAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 7);
    this.attackRightAnimation.drawFrame(this.game.clockTick, this.ctx, this.cX, this.cY, 0, true);

  } else {
    if(this.attackLeftAnimation.currentFrame() === 1 && !this.lunging) {
      this.attackBox = new BoundingRect(this.x - 15 , this.y + 75, 40, 40, this.game);
      this.lunging = true;

      myAudio = new Audio('./se/bite.mp3');
      myAudio.play();
    } else if(this.attackLeftAnimation.currentFrame() > 1) {
      this.lunging = false;
      this.attackBox = null;
    }
    // this.spearAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 5);
    this.attackLeftAnimation.drawFrame(this.game.clockTick, this.ctx, this.cX, this.cY, 0, true);
  }

    // if(this.rightFaceing) {
    //   if (this.attackRightAnimation.isDone()) {
    //     this.lunging = false;
    //     this.attackRightAnimation.elapsedTime = 0;
    //   }
    // } else {
    //   if (this.attackLeftAnimation.isDone()) {
    //     this.lunging = false;
    //     this.attackLeftAnimation.elapsedTime = 0;
    //   }
    // }
}
// Dragon.prototype.checkArtemisArrowCollision = function() {
//   for (var i = 0; i < this.game.entities.length; i ++) {
//     var entity = this.game.entities[i];
//     if(entity.constructor.name === "artermisArrow") {
//       if (this.collide(entity)) {
//         this.health -= 20 * this.game.entities[0].level;
//         entity.needToRemove = false;
//       }
//     }
//   }
// }


Dragon.prototype.checkArtemisCollision = function() {

  var artemis = this.game.entities[0];

  var myMiddle = this.boundingRect.left + (this.boundingRect.width / 2);
  var hisMiddle = artemis.boundingRect.left + (artemis.boundingRect.width / 2);

  var myHeightMiddle = this.boundingRect.top + (this.boundingRect.height/2);
  var hisHeightMiddle = artemis.boundingRect.top + (artemis.boundingRect.height/2);
  // (Math.abs(myHeightMiddle - hisHeightMiddle) >= artemis.y - artemis.y && Math.abs(myHeightMiddle - hisHeightMiddle) < artemis.boundingRect.bottom - artemis.y)) {

  if (Math.abs(myMiddle - hisMiddle) < this.boundingRect.width/2 &&
     (myHeightMiddle > artemis.y && myHeightMiddle < artemis.boundingRect.bottom)) {
     this.attacking = true;
     this.flying = false;
  } else if (Math.abs(myMiddle - hisMiddle) <= DRAGONFOLLOW &&
    Math.abs(myHeightMiddle - hisHeightMiddle) < this.yRangeDetection) {


     if (this.boundingRect.left - artemis.boundingRect.right > 0) {
      this.leftFaceing = true;
      this.flying = true
      this.rightFaceing = false;
    } else if (this.boundingRect.right - artemis.boundingRect.left < 0){
      this.flying = true;
      this.rightFaceing = true;
      this.leftFaceing = false;
    }
    this.newXLocation = this.x;
    this.following = true;

  } else {
    this.attacking = false
    this.flying = true;
    this.following = false;
  }
};
