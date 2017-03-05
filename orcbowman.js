var GRAVITY = 20;
var DEATH = 2500;
var WALKINGOFFPLATFORM = 0;
var JUMPHEIGHT = 220;

function OrcBowman(game, spritesheet, marker) {
  this.walkAnimation = new Animation(spritesheet, 64, 64, 9, 0.1, 9, true, 1);
  this.magicAnimation = new Animation(spritesheet, 64, 64, 6.5, 0.1, 6.5, false, 1);
  this.attackRightAnimation = new Animation(AM.getAsset("./img/characters/ArtemisAttack.png"),192, 189, 5.5, 0.08, 5.5, false, 1);
  this.attackLeftAnimation = new Animation(AM.getAsset("./img/characters/ArtemisAttack.png"), 192, 182, 5.5, 0.08, 5.5, false, 1);
  this.shootRightAnimation = new Animation(spritesheet, 64, 64, 12.5, 0.08, 12.5, false, 1);
  this.shootLeftAnimation = new Animation(spritesheet, 64, 64, 12.5, 0.08, 12.5, false, 1);
  this.upAnimation = new Animation(spritesheet, 64, 64, 1, 0.1, 1, false, 1);
  this.jumpAnimation = new Animation(spritesheet, 64, 64, 1, 0.1, 1, false, 1);
  this.jumpAnimation = new Animation(spritesheet, 64, 64, 8, 0.1, 8, false, 1);
  this.shieldAnimation = new Animation(AM.getAsset("./img/extras/character_shield.png"), 215, 215, 5.5, .1, 5.5, false, .5);
  this.marker = marker;
  this.money = 0;

  this.xAdjust = 21;
  this.yAdjust = 13;
  this.yAttackAdjust = 55;
  this.xAttackAdjust = 66;
  this.xShieldAdjust = 0;
  this.yShieldAdjust = 0;
  this.boundingRect = new BoundingRect(20 + this.xAdjust, 2067 + this.yAdjust, 22, 46, game);
  this.previousLoc = new BoundingRect(20 + this.xAdjust, 2067 + this.yAdjust, 22, 46, game);
  this.swordBox = null;
  this.spritesheet = spritesheet;
  this.x = 20;
  this.y = 2067-this.yAdjust - this.boundingRect.height;

  this.startX = this.x;
  this.startY = this.y;
  this.bow = false;
  this.ground = this.y;
  this.speed = 350;
  this.ctx = game.ctx;
  this.game = game;
  this.currDirection = 11;
  this.animating = false;
  this.jumping = false;
  this.falling = false;
  this.newPlatform = false;
  this.currentPlatform = null;
  this.movingPlatform = null;
  this.onMoving = false;
  this.decreaseMana = false;
  this.attacking = false;

  //////////////////////////
  this.width = 64;
  this.height = 64;
  this.step = game.STEP;
  this.camera = game.camera;

  this.health = 100;
  this.mana = 100;
  this.maxhealth = this.health;
  this.maxmana = this.mana;
  this.level = 1;
  this.xp = 0;
  this.activiateBow = false;
}

OrcBowman.prototype.increaseXP = function () {
    if(this.level === 1) {
      this.xp += 20;
      this.updateLevel();
    } else if(this.level === 2) {
      this.xp += 15;
      this.updateLevel();
    } else if(this.level === 3) {
      this.xp += 10;
      this.updateLevel();
    } else if(this.level === 4) {
      this.xp += 5;
      this.updateLevel();
    } else if(this.level === 5) {
      this.xp += 5;
      this.updateLevel();
    }
}

OrcBowman.prototype.updateLevel = function() {
    if(this.xp >= 100) {
      this.xp = 0;
      this.level++;
      this.health += 100;
      this.mana += 100;
      this.maxhealth += 100;
      this.maxmana += 100;
    }
}


OrcBowman.prototype.draw = function () {

  //this.boundingRect.drawRect();
  if(this.onMoving && !this.jumping && !this.right && !this.left) {
    if(this.currentPlatform.leftFaceing) {
      this.x -= this.game.clockTick * this.currentPlatform.speed;
    } else if(this.currentPlatform.rightFaceing) {
      this.x += this.game.clockTick * this.currentPlatform.speed;
    }
  }

  if (this.jumping) {
    this.jump();
  }
  if (this.falling && !this.jumping) {
    this.fall();
  }

  if(this.right) {
    if (!this.jumping){
      this.walkAnimation.drawFrame(this.game.clockTick,
      this.ctx,
          this.x - this.camera.xView,
          this.y - this.camera.yView,
            11, true);
    }


    this.right = false;
    this.animating = false;
  } else if(this.left) {
    if (!this.jumping){
      this.walkAnimation.drawFrame(this.game.clockTick,
          this.ctx,
          this.x - this.camera.xView,
          this.y - this.camera.yView
          , 9, true);

    }

    this.left = false;
    this.animating = false;
  } else if(this.down) {
      this.magicAnimation.drawFrame(this.game.clockTick,
      this.ctx,
        this.x - this.camera.xView,
        this.y - this.camera.yView,
         2, true);
  } else if(this.melee) {
    if(this.currDirection === 11) {
      if(this.attackRightAnimation.currentFrame() === 4 && !this.attacking) {
        this.swordBox = new BoundingRect(this.x + 55 , this.y + 20, 50, 20, this.game);
        this.attacking = true;
        myAudio = new Audio('./se/swordSwing.flac');
        myAudio.play();
      } else if(this.attackRightAnimation.currentFrame() >= 5) {
        this.attacking = false;
        this.swordBox = null;
      }
      this.attackRightAnimation.drawFrame(this.game.clockTick,
      this.ctx,
        this.x - this.camera.xView - this.xAttackAdjust,
        this.y - this.camera.yView - this.yAttackAdjust,
         3, true);
    } else {
      if(this.attackLeftAnimation.currentFrame() === 4&& !this.attacking) {
        this.swordBox = new BoundingRect(this.x- 40 , this.y + 20, 50, 20, this.game);
        this.attacking = true;
        myAudio = new Audio('./se/swordSwing.flac');
        myAudio.play();
      } else if(this.attackLeftAnimation.currentFrame() >= 5) {
        this.attacking = false;
        this.swordBox = null;
      }
      this.attackLeftAnimation.drawFrame(this.game.clockTick, this.ctx,
        this.x - this.camera.xView - this.xAttackAdjust,
        this.y - this.camera.yView - this.yAttackAdjust,
         1, true);
    }
  } else if(this.bow) {
    if(this.currDirection === 11) {
      this.shootRightAnimation.drawFrame(this.game.clockTick, this.ctx,
        this.x - this.camera.xView,
        this.y - this.camera.yView,
         19, true);
         if(this.shootRightAnimation.currentFrame() == 9 && !this.shooted) {
           console.log("Shooted");
           var marker = new Date().getUTCMilliseconds(); //assign a unique ID number for each arrow
           var arrow = new artermisArrow(this.game, this, AM.getAsset("./img/arrow_skeleton.png"), this.x, this.y, marker);
           this.game.addEntity(arrow);
           this.shooted = true;
           myAudio = new Audio('./se/bowFire.mp3');
           myAudio.play();
         } else if(this.shootRightAnimation.currentFrame() > 10) {
           this.shooted = false;
         }
    } else {
      this.shootLeftAnimation.drawFrame(this.game.clockTick, this.ctx,
        this.x - this.camera.xView,
        this.y - this.camera.yView,
         17, true);
         if(this.shootLeftAnimation.currentFrame() == 9 && !this.shooted) {
           var marker = new Date().getUTCMilliseconds(); //assign a unique ID number for each arrow
           var arrow = new artermisArrow(this.game, this, AM.getAsset("./img/arrow_skeleton.png"), this.x, this.y, marker);
           this.game.addEntity(arrow);
           this.shooted = true;
           myAudio = new Audio('./se/bowFire.mp3');
           myAudio.play();
         } else if(this.shootLeftAnimation.currentFrame() > 10) {
           this.shooted = false;
         }
    }
  } else if(!this.animating){
    if(this.lastPressed === "right" || this.lastPressed === "melee") {
      this.walkAnimation.drawFrame(0, this.ctx,
        this.x - this.camera.xView,
        this.y - this.camera.yView,
         this.currDirection, false);
    } else if(this.lastPressed === "left" || this.lastPressed === "melee"){
      this.walkAnimation.drawFrame(0,
      this.ctx,
        this.x - this.camera.xView,
        this.y - this.camera.yView,
         this.currDirection, false);
    } else if(this.lastPressed === "down") {
        this.magicAnimation.drawSpecificFrame(this.ctx,
         this.x - this.camera.xView,
         this.y - this.camera.yView,
         2, 0);
    } else if(this.lastPressed === "melee" && this.currDirection === "right") {
       this.attackRightAnimation.drawSpecificFrame(this.ctx,
         this.x - this.camera.xView,
         this.y - this.camera.yView,
          24, 13);
    } else if(this.lastPressed === "up") {
      this.upAnimation.drawSpecificFrame(this.ctx,
        this.x - this.camera.xView,
        this.y - this.camera.yView, 0, 0);
    }
    else {
      this.walkAnimation.drawFrame(0, this.ctx,
        this.x - this.camera.xView,
        this.y - this.camera.yView,
         this.currDirection, false);
    }
  }
  if(this.shield) {
    this.shieldAnimation.drawFrame(this.game.clockTick,
    this.ctx,
      this.x - this.camera.xView - 20,
      this.y - this.camera.yView - 20,
       0, true);
  }
}

OrcBowman.prototype.update = function () {

  var health = Math.floor(this.health/this.level) + "%";
  var mana = Math.floor(this.mana/this.level) + "%";
  var xp = this.xp + "%";
  document.getElementById('health').style.width = health;
  document.getElementById('healthlabel').innerHTML = health;
  document.getElementById('mana').style.width = mana;
  document.getElementById('manalabel').innerHTML = mana;
  document.getElementById("xplabel").innerHTML = xp;
  document.getElementById("xp").style.width = xp;
  document.getElementById("levelnumber").innerHTML = this.level;


  if (this.health <= 0) {
    this.x = this.startX;
    this.y = this.startY;
    this.ground = this.startY;
    this.health = 100;
  }

  if (this.game.chars["Space"]) {
    if (!this.falling)
      this.jumping = true;
  }

  if(this.game.chars["ArrowRight"] || this.game.chars["KeyD"]) {
    this.right = true;
    this.currDirection = 11;
    this.lastPressed = "right";
    this.animating = true;
    this.x += this.game.clockTick * this.speed;
  } else if(this.game.chars["ArrowLeft"] || this.game.chars["KeyA"]) {
    this.left = true;
    this.currDirection = 9;
    this.lastPressed = "left";
    this.animating = true;
    this.x -= this.game.clockTick * this.speed;
  } else if(this.game.chars["KeyS"] || this.game.chars["ArrowDown"]) {
    if(this.mana > 0) {
      this.lastPressed = "down";
      this.down = true;
      this.shield = true;
      this.animating = true;
    }
  } else if(this.game.chars["Digit1"] || this.game.chars["KeyJ"]) {
    this.lastPressed = "melee";
    this.melee = true;
    this.animating = true;
  } else if(this.game.chars["ArrowUp"] || this.game.chars["KeyW"]) {
    this.up = true;
    this.lastPressed = "up";
    this.animating = false;
  } else if(this.game.chars["Digit7"]) {
    this.speed = 200
    for(var i = 1; i < this.game.entities.length; i++) {
      this.game.entities[i].speed = 0;
    }
  } else if(this.game.chars["Digit8"]) {
    this.speed = 350
    for(var i = 1; i < this.game.entities.length; i++) {
      this.game.entities[i].speed = 300;
    }
  }else if(this.game.chars["Digit2"] || this.game.chars["KeyK"]) {
    if(this.money >= 500 && this.activiateBow === false ) {
      this.lastPressed = "bow";
      this.money -= 500;
      this.activiateBow = true;
      this.bow = true;
      document.getElementById("bow_icon").src = "./img/extras/activate bow.png"
      document.getElementById("coinnumber").innerHTML = this.money;
      this.animating = true;
    } else if (this.activiateBow) {
      this.lastPressed = "bow";
      this.bow = true;
      this.animating = true;
    } else {
      var parent = document.getElementById("gamecontainer");
      var bow_money_error = document.createElement("div");
      bow_money_error.id = "bow_money_error";
      bow_money_error.innerHTML = "500<br>coin";
      parent.appendChild(bow_money_error);

      setTimeout(function(){
          parent.removeChild(bow_money_error);
      }, 1000);
    }


  }

  if (this.magicAnimation.isDone()) {
      this.magicAnimation.elapsedTime = 0;
      this.down = false;
      this.animating = false;
      if(this.mana > 0) {
        this.mana -= 25;
      }
      mana = this.mana + "%";
  }

  if (this.attackRightAnimation.isDone()) {
      this.attackRightAnimation.elapsedTime = 0;
      this.melee = false;
      this.animating = false;
  }

  if (this.shieldAnimation.isDone()) {
      this.shieldAnimation.elapsedTime = 0;
      this.shield = false;
      this.animating = false;
  }

  if (this.attackLeftAnimation.isDone()) {
      this.attackLeftAnimation.elapsedTime = 0;
      this.melee = false;
      this.animating = false;
  }
  if(this.shootRightAnimation.isDone()) {
    this.shootRightAnimation.elapsedTime = 0;
    this.bow = false;
    this.animating = false;
  }
  if(this.shootLeftAnimation.isDone()) {
    this.shootLeftAnimation.elapsedTime = 0;
    this.bow = false;
    this.animating = false;
  }

  this.previousLoc.updateLoc(this.boundingRect.x, this.boundingRect.y);
  this.boundingRect.updateLoc(this.x + this.xAdjust, this.y + this.yAdjust);

  this.checkPlatformCollisions();
  this.checkEnemyCollisions();
  this.checkMovingPlatformCollisions();
  this.withinRange();


      // check left boundary
    if(this.x + this.xAdjust < 0) {
        this.x = 0 - this.xAdjust;
    }
    //check top boundary
    if(this.y + this.yAdjust < 0) {
      this.y = -this.yAdjust;
      this.falling = true;
      this.jumping = false;
    }

    //check right boundary
    if(this.x + this.width - this.xAdjust >  this.game.worldWidth) {
        this.x = this.game.worldWidth - this.width + this.xAdjust;
    }

    if (this.boundingRect.bottom < 1042 && !this.jumping){
      JUMPHEIGHT = 165;
    } else if (this.boundingRect.bottom > 1042 && !this.jumping){
      JUMPHEIGHT = 220;
    }

    if (this.y >= DEATH) {
      this.x = this.startX;
      this.y = this.startY;
      this.ground = this.startY;
      this.health = 100;
      this.mana = 100;
    }
}

OrcBowman.prototype.collide = function(other) {
  return this.boundingRect.left < other.boundingRect.right // left side collision
  && this.boundingRect.right  > other.boundingRect.left // right side collision
  && this.boundingRect.bottom > other.boundingRect.top //
  && this.boundingRect.top < other.boundingRect.bottom;
}

OrcBowman.prototype.collideSpear = function(other) {
  return this.boundingRect.left < other.spearBox.right // left side collision
  && this.boundingRect.right  > other.spearBox.left // right side collision
  && this.boundingRect.bottom > other.spearBox.top //
  && this.boundingRect.top < other.spearBox.bottom;
}

OrcBowman.prototype.collideHead = function(other) {
  return this.boundingRect.left < other.attackBox.right // left side collision
  && this.boundingRect.right  > other.attackBox.left // right side collision
  && this.boundingRect.bottom > other.attackBox.top //
  && this.boundingRect.top < other.attackBox.bottom;
}


OrcBowman.prototype.collideSword = function(other) {
  if(this.swordBox !== null) {
    if (this.swordBox.left < other.boundingRect.right // left side collision
    && this.swordBox.right  > other.boundingRect.left // right side collision
    && this.swordBox.bottom > other.boundingRect.top //
    && this.swordBox.top < other.boundingRect.bottom) {
      return true;
    }
  }
}

OrcBowman.prototype.collideSwordLeft = function(other) {
  return this.swordBox.left < this.previousLoc.left
  && this.swordBox.right > other.boundingRect.right;
}

OrcBowman.prototype.collideSwordRight = function(other) {
  return this.swordBox.right > this.previousLoc.right
  && this.swordBox.left < other.boundingRect.left;
}

OrcBowman.prototype.collideLeft = function(other) {
  return this.boundingRect.left < this.previousLoc.left
  && this.boundingRect.right > other.boundingRect.right;
}

OrcBowman.prototype.collideRight = function(other) {
  return this.boundingRect.right > this.previousLoc.right
  && this.boundingRect.left < other.boundingRect.left;
}

OrcBowman.prototype.collideTop = function(other) {
  return this.boundingRect.top > this.previousLoc.top
  && other.boundingRect.top > this.previousLoc.bottom;
}

OrcBowman.prototype.collideBottom = function(other) {
  return this.boundingRect.bottom < this.previousLoc.bottom
  && this.previousLoc.left < other.boundingRect.right
  && this.previousLoc.right > other.boundingRect.left;
}

OrcBowman.prototype.checkEnemyCollisions = function() {

  for (var i = 0; i < this.game.entities.length; i ++) {
    var entity = this.game.entities[i];


    if(entity.constructor.name === "Redhead" || entity.constructor.name === "SkeletonShooter" ||
        entity.constructor.name === "Dragon") {
      if(entity.constructor.name === "Redhead" && entity.spearBox !== null) {
          if (this.collideSpear(entity)) {
            this.health -= 10;
            //console.log(this.health)
            entity.spearBox = null;
          }
      }
      if(entity.constructor.name === "Dragon" && entity.attackBox !== null) {
        if(this.collideHead(entity)) {
          this.health -= 50;
          entity.attackBox = null;
        }
      }
      if(this.swordBox !== null) {
        if (this.collideSword(entity)) {
          entity.health -= 8 * this.level ;
          if(entity.x > this.x) {
            entity.x += 15;
            entity.boundingRect.updateLoc(entity.x + entity.xAdjust, entity.y + entity.yAdjust)
          } else if(entity.x < this.x) {
            entity.x -= 15 * this.level;
            entity.boundingRect.updateLoc(entity.x + entity.xAdjust, entity.y + entity.yAdjust)
          }
          if(i === this.game.entities-1) {
            this.swordBox = null;

          }
        }
      }
      if (this.collide(entity)) {
          if (this.collideLeft(entity)) {
            this.x = entity.boundingRect.right - this.xAdjust;
            this.boundingRect.updateLoc(this.x + this.xAdjust, this.y + this.yAdjust);

        } else if (this.collideRight(entity)) {
            this.x = entity.boundingRect.left - this.xAdjust - this.boundingRect.width;
            this.boundingRect.updateLoc(this.x + this.xAdjust, this.y + this.yAdjust);

        }
        // else if (this.collideBottom(entity) && entity.constructor.name === "Dragon") {
        //     this.y = entity.boundingRect.bottom - this.yAdjust;
        //     this.falling = true;
        //     this.jumping = false;
        //     this.boundingRect.updateLoc(this.x + this.xAdjust, this.y + this.yAdjust);
        // }
      }
    } else if(entity.constructor.name === "arrowObj") {
      if (this.collide(entity)) {
        this.health -= 10;
      }
    } else if(entity.constructor.name === "Chest") {
      if(this.collide(entity) && entity.open) {
        this.health = this.maxhealth;
        this.mana = this.maxmana;
      }
    }else if (entity.constructor.name === "Coin") {
      if (this.collide(entity)) {
        entity.needToRemove = false;
        this.money += 10; // increment money
        var coinNumber = document.getElementById('coinnumber');
        coinNumber.innerHTML = this.money;
      }
    } else if(entity.constructor.name === "princess") {
        if(this.collide(entity)) {
          var parent = document.getElementById("gamecontainer");
          var child = document.createElement("div");
          child.id = "gameEnding"
          child.className = "game ending"
          child.innerHTML = "<br><br><br>Congratulation!!!!<br> Artemis finally saved his lovely princess!!!" +
                            "<br>They got married and have a happy life!!!" +
                            "<br>\n\n\n Thank you for playing~~~~";
          parent.appendChild(child);
        }
      }
  }
};



OrcBowman.prototype.withinRange = function() {

  for (var i = 0; i < this.game.entities.length; i ++) {
    var entity = this.game.entities[i];

    if(entity.constructor.name === "Redhead" || entity.constructor.name === "SkeletonShooter" || entity.constructor.name === "Dragon") {
      if (this.x - entity.x > 0 && Math.abs(this.x - entity.x) <= 50) {
        if(this.down && this.magicAnimation.currentFrame() === 5) {
          entity.x -= 100;
          entity.health -= 10 * this.level;
          entity.boundingRect.updateLoc(entity.x + entity.xAdjust, entity.y + entity.yAdjust)
        }
      } else if(this.x - entity.x < 0 && Math.abs(this.x - entity.x) <= 50) {
        if(this.down && this.magicAnimation.currentFrame() === 5) {
          entity.x += 100;
          entity.health -= 10 * this.level;
          entity.boundingRect.updateLoc(entity.x + entity.xAdjust, entity.y + entity.yAdjust)

        }
      }

    } else if(entity.constructor.name === "arrowObj") {
        if (this.collide(entity)) {
          entity.needToRemove = false;
        }
      }
  }
};

OrcBowman.prototype.checkPlatformCollisions = function () {

  for (var i = 0; i < this.game.platforms.length; i ++) {
    var platform = this.game.platforms[i];

    if (this.collide(platform)) {
      if(this.collideBottom(platform) ) {
        this.y = platform.boundingRect.bottom - this.yAdjust;
        this.falling = true;
        this.jumping = false;
      }
      else if (this.collideTop(platform)) {
        this.newPlatform = true;
        this.currentPlatform = platform;
      }
      else if (this.collideLeft(platform)) {
        this.x = platform.boundingRect.right - this.xAdjust;
        this.boundingRect.updateLoc(this.x + this.xAdjust, this.y + this.yAdjust);
      }
      else if (this.collideRight(platform)) {
        this.x = platform.boundingRect.left - this.xAdjust - this.boundingRect.width;
        this.boundingRect.updateLoc(this.x + this.xAdjust, this.y + this.yAdjust);
      }
    }

    if (this.boundingRect.left > this.currentPlatform.boundingRect.right
        || this.boundingRect.right < this.currentPlatform.boundingRect.left) {
          this.currentPlatform.isCurrent = false;
          this.falling = true;
        }
    }
}

OrcBowman.prototype.checkMovingPlatformCollisions = function () {

  for (var i = 0; i < this.game.movingPlatforms.length; i ++) {
    var platform = this.game.movingPlatforms[i];

    if (this.collide(platform)) {
      if(this.collideBottom(platform) ) {
        this.y = platform.boundingRect.bottom - this.yAdjust;
        this.falling = true;
        this.jumping = false;
      }
      else if (this.collideTop(platform)) {
        this.newPlatform = true;
        this.currentPlatform = platform;
        this.onMoving = true;
      }
      else if (this.collideLeft(platform)) {
        this.x = platform.boundingRect.right - this.xAdjust;
        this.boundingRect.updateLoc(this.x + this.xAdjust, this.y + this.yAdjust);
      }
      else if (this.collideRight(platform)) {
        this.x = platform.boundingRect.left - this.xAdjust - this.boundingRect.width;
        this.boundingRect.updateLoc(this.x + this.xAdjust, this.y + this.yAdjust);
      }
    }
      if (this.boundingRect.left > this.currentPlatform.boundingRect.right
          || this.boundingRect.right < this.currentPlatform.boundingRect.left) {
            this.currentPlatform.isCurrent = false;
            this.onMoving = false;
            this.falling = true;
      }

    }

}

OrcBowman.prototype.jump = function() {

  this.jumpAnimation.elapsedTime += this.game.clockTick;

  if (this.right) {
    this.jumpAnimation.drawSpecificFrame(this.ctx, this.x - this.camera.xView, this.y - this.camera.yView, 11, 0);

  } else if (this.left) {
    this.jumpAnimation.drawSpecificFrame(this.ctx, this.x - this.camera.xView, this.y - this.camera.yView, 9, 0);
  }

  var jumpDistance = this.jumpAnimation.elapsedTime / this.jumpAnimation.totalTime;

  var totalHeight = JUMPHEIGHT;

  if (jumpDistance > 0.5)
      jumpDistance = 1 - jumpDistance;

  var height = jumpDistance * 2 * totalHeight;
  var height = totalHeight*(-4 * (jumpDistance * jumpDistance - jumpDistance));

  this.y = this.ground - height;

  if (this.newPlatform) {
    var newGround = this.currentPlatform.boundingRect.y - this.boundingRect.height - this.yAdjust;

    if (this.y >= newGround) {
      this.ground = newGround;
      this.jumping = false;
      this.jumpAnimation.elapsedTime = 0;
      this.y = this.ground;
      this.newPlatform = false;
      this.currentPlatform.isCurrent = true;
      this.falling = false;
    }

  } else if (this.falling) {
        var newGround = DEATH;

        if (this.y >= newGround) {
          this.ground = newGround;
          this.jumping = false;
          this.jumpAnimation.elapsedTime = 0;
          this.y = this.ground;
          this.newPlatform = false;
          this.falling = false;
        }

  }  else if (this.y >= this.ground) {
      this.jumping = false;
      this.jumpAnimation.elapsedTime = 0;
      this.y = this.ground;
  }
}

OrcBowman.prototype.fall = function() {

  if (this.right) {
      this.jumpAnimation.drawSpecificFrame(this.ctx, this.cX, this.cY, 11, 0);
  } else if (this.left) {
        this.jumpAnimation.drawSpecificFrame(this.ctx, this.cX, this.cY, 9, 0);
  }

  if (WALKINGOFFPLATFORM === 0) {
    this.y = this.y-3;
    WALKINGOFFPLATFORM ++;
  } else {
   this.y += GRAVITY * this.jumpAnimation.elapsedTime;
  }

  this.jumpAnimation.elapsedTime += this.game.clockTick;

  if (this.newPlatform) {
    var newGround = this.currentPlatform.boundingRect.y - this.boundingRect.height - this.yAdjust;

    if (this.y >= newGround) {
      this.ground = newGround;
      this.jumping = false;
      this.jumpAnimation.elapsedTime = 0;
      this.y = this.ground;
      this.newPlatform = false;
      this.currentPlatform.isCurrent = true;
      this.falling = false;
      WALKINGOFFPLATFORM = 0;
    }
  } else {
    if (this.y >= DEATH) {
      this.jumpAnimation.elapsedTime = 0;
      this.y = DEATH;
      this.falling = false;
      this.jumping = false;
      WALKINGOFFPLATFORM = 0;
    }
  }
}
