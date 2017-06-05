var AM = new AssetManager();

function Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
}


function distance(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}

Animation.prototype.drawFrame = function (tick, ctx, x, y, row) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);
    this.row = row;
    ctx.drawImage(this.spriteSheet,
                 xindex * this.frameWidth, yindex * this.frameHeight + this.row * this.frameHeight,  // source from sheet
                 this.frameWidth, this.frameHeight,
                 x, y,
                 this.frameWidth * this.scale,
                 this.frameHeight * this.scale);
}

Animation.prototype.drawFlyObjFrame = function (ctx, x, y, row, col) {
    ctx.drawImage(this.spriteSheet,
                 row * this.frameWidth,
                 col* this.frameHeight,  // source from sheet
                 this.frameWidth, this.frameHeight,
                 x, y,
                 this.frameWidth * this.scale,
                 this.frameHeight * this.scale);
  }


Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

Animation.prototype.drawSpecifcFrame = function(ctx, x, y, row, col) {
  ctx.drawImage(this.spriteSheet,
               col * this.frameWidth,
               row * this.frameHeight,  // source from sheet
               this.frameWidth, this.frameHeight,
               x, y,
               this.frameWidth * this.scale,
               this.frameHeight * this.scale);
}

// no inheritance
function Background(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
};

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
                   this.x, this.y);
};

Background.prototype.update = function () {
};

function skeleton(game, spritesheet) {
    this.animationRight = new Animation(spritesheet, 64, 59, 9, 0.10, 9, true, 1);
    this.animationLeft = new Animation(spritesheet, 64, 58, 9, 0.10, 9, true, 1);
    this.standingRight = new Animation(spritesheet, 64, 59, 1, 0.10, 1, true, 1);
    this.standingLeft = new Animation(spritesheet, 64, 58, 1, 0.10, 1, true, 1);
    this.lastDirection = true;
    this.x = 100;
    this.y = 400;
    this.speed = 100;
    this.row = 12;
    this.game = game;
    this.ctx = game.ctx;

}

skeleton.prototype.draw = function () {
  if (!this.game.right && this.lastDirection) {
    //console.log("Confirmation");
    this.standingRight.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.row, 19);
  } else if(!this.lastDirection && !this.game.left) {
    //console.log("Confirmation");
    this.standingLeft.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 10, 19);
  } else if(this.game.right) {
    this.animationRight.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.row);
    this.game.right = false;
  } else if (this.game.left){
    this.animationLeft.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 10);
    this.game.left = false;
  }
}

skeleton.prototype.update = function () {
    if(this.game.chars["ArrowRight"] === true){
      this.lastDirection = true;
      this.game.right = true;
      this.x += this.game.clockTick * this.speed;
      if (this.x > 800) this.x = -230;
    } else if(this.game.chars["ArrowLeft"] === true) {
      this.game.left = true;
      this.lastDirection = false;
      this.x -= this.game.clockTick * this.speed;
      if (this.x < -100) this.x = 830;
    }
}

function skeletonStand(game, spritesheet) {
    this.animationRight = new Animation(spritesheet, 64, 59, 9, 0.10, 9, true, 1);
    this.animationLeft = new Animation(spritesheet, 64, 58, 9, 0.10, 9, true, 1);
    this.standingRight = new Animation(spritesheet, 64, 59, 1, 0.10, 1, true, 1);
    this.standingLeft = new Animation(spritesheet, 64, 58, 1, 0.10, 1, true, 1);
    this.lastDirection = true;
    this.x = 150;
    this.y = 400;
    this.speed = 100;
    this.row = 12;
    this.game = game;
    this.ctx = game.ctx;
    this.counter = 0;
}

skeletonStand.prototype.draw = function () {
  if (!this.game.right && this.lastDirection) {
    //console.log("Confirmation");
    this.standingRight.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.row, 19);
  } else if(!this.lastDirection && !this.game.left) {
    //console.log("Confirmation");
    this.standingLeft.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 10, 19);
  } else if(this.game.right) {
    this.animationRight.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.row);
    this.game.right = false;
  } else if (this.game.left){
    this.animationLeft.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 10);
    this.game.left = false;
  }
}

skeletonStand.prototype.update = function () {
    var theSkeScript = document.getElementById("Atest");
    console.log(this.game.entities[1].x);
    if(this.game.entities[1].x - this.x <= 30 && this.x - this.game.entities[1].x <= 30) {
      if(this.game.chars["ControlLeft"] === true && this.pressed){
          var script = ["<h3>Skeleton</h3>Hello there, how are u doing?", "<h3>Skeleton</h3> for test purpose: Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis",
          "<h3>Skeleton</h3>Test Test TestT est Test"];
          theSkeScript.innerHTML = script[this.counter];
          theSkeScript.style.color = "Cyan";
          theSkeScript.style.backgroundImage="url(img/dia_resized.png)";
          theSkeScript.style.position = "absolute";
          theSkeScript.style.left = "15px";
          theSkeScript.style.paddingLeft = "50px";
          theSkeScript.style.paddingTop = "-5px";
          theSkeScript.style.right = "100px";
          theSkeScript.style.top = "100px";
          theSkeScript.style.height = "300px";
          theSkeScript.style.width = "775px";
          this.counter += 1;
          console.log("This is not supposed to print");
          if(this.counter >= script.length) {
            this.counter = 0;
          }
          this.pressed = false;
      } else if(this.game.chars["ControlLeft"] === false) {
        this.pressed = true;
      }
    } else {
      this.counter = 0;
      theSkeScript.innerHTML = "";
      theSkeScript.style.backgroundImage="";
    }
}

function skeletonShoot(game, spritesheet) {
    this.animation = new Animation(spritesheet, 64, 58, 13, 0.10, 13, true, 1);
    this.shootedObj = [];
    this.game = game;
    this.x = 0;
    this.y = 400;
    this.arrow = new arrowObj(game, this.x, this.y);
    this.speed = 100;
    this.row = 21;
    this.ctx = game.ctx;
    this.shooted = false;
    this.pressed = true;
    this.counter = 0;
    this.timer = 0;
}

skeletonShoot.prototype.draw = function () {
    if(this.animation.currentFrame() >= 7) {
      var t1 = performance.now();
    }
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.row);
}

skeletonShoot.prototype.update = function () {
    if(this.animation.currentFrame() === 9 && !this.shooted) {
      var marker = new Date().getUTCMilliseconds(); //assign a unique ID number for each arrow
      var arrow = new arrowObj(this.game, AM.getAsset("./img/arrow_skeleton.png"), this.x, this.y, marker);
      this.shootedObj.push(arrow);
      this.game.addEntity(arrow);
      this.shooted = true;
    } else if(this.animation.currentFrame() > 10) {
      this.shooted = false;
    }
    var theTest = document.getElementById("test");
    if(this.game.entities[1].x - this.x <= 30 && this.x - this.game.entities[1].x <= 30) {
      this.timer++;
      if(this.game.chars["ControlLeft"] === true && this.pressed){
          var script = ["Please, stay away!", "Im practicing!", "Test Test TestT est Test"];
          theTest.innerHTML = script[this.counter];
          theTest.style.color = "red";
          theTest.style.backgroundImage="url(img/rsz_dia.png)";
          theTest.style.position = "absolute";
          theTest.style.left = "30px";
          theTest.style.paddingLeft = "7px";
          theTest.style.paddingTop = "5px";
          theTest.style.right = "150px";
          theTest.style.top = "330px";
          theTest.style.height = "75px";
          theTest.style.width = "95px";
          this.counter += 1;
          //console.log("Counter: " + this.counter);
          if(this.counter >= script.length) {
            this.counter = 0;
          }
          this.pressed = false;
      } else if(this.game.chars["ControlLeft"] === false) {
        this.pressed = true;
      }
    } else {
      this.counter = 0;
      theTest.innerHTML = "";
      theTest.style.backgroundImage="";
    }
}

function arrowObj(game, spritesheet, x, y, marker) {
    this.animation = new Animation(spritesheet, 64, 58, 1, 0.10, 1, true, 1);
    this.x = x + 26;
    this.startingX = x + 29;
    this.y = y - 6.5;
    this.radius = 10;
    this.collide = false;
    this.marker = marker;
    this.needToRemove = true;
    this.speed = 100;
    this.row = 21;
    this.game = game;
    this.ctx = game.ctx;
    this.frame = 4
    this.flying = true;
}


arrowObj.prototype.shootArrow = function() {
  if (this.flying) {
      this.animation.drawSpecifcFrame(this.ctx, this.x, this.y, this.row, 4)
  } else {
    this.x = x + 32;
    this.y = y -19;
  }
}

arrowObj.prototype.draw = function () {
    if (this.flying) {
        this.animation.drawSpecifcFrame(this.ctx, this.x, this.y, this.row, 4)
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


AM.queueDownload("./img/skeleton.png");
AM.queueDownload("./img/arrow_skeleton.png");
AM.queueDownload("./img/background.jpg");
AM.queueDownload("./img/tile.png");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/background.jpg")));
    gameEngine.addEntity(new skeleton(gameEngine, AM.getAsset("./img/skeleton.png")));
    gameEngine.addEntity(new skeletonStand(gameEngine, AM.getAsset("./img/skeleton.png")));
    //gameEngine.addEntity(new platfomer(gameEngine, AM.getAsset("./img/tile.png")));
    gameEngine.addEntity(new skeletonShoot(gameEngine, AM.getAsset("./img/skeleton.png")));

    myAudio = new Audio('KaerMorhen.mp3');
    myAudio.addEventListener('ended', function() {
      this.currentTime = 0;
      this.play();
    }, false);
    myAudio.play();

    console.log("All Done!");
});
