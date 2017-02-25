window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (/* function */ callback, /* DOMElement */ element) {
                window.setTimeout(callback, 1000 / 60);
            };
})();

function GameEngine() {
    this.space = false;
    this.left = false;
    this.right = false;
    this.down = false;
    this.melee = false;
    this.magic = false;
    this.interract = false;
    this.up = false;
    this.entities = [];
    this.platforms = [];
    this.movingPlatforms = [];
    this.ctx = null;
    this.surfaceWidth = null;
    this.surfaceHeight = null;
    this.worldWidth = 6400;
    this.worldHeight = 2130;
    this.chars = [];
    this.FPS = 30;
    this.INTERVAL = 1000/this.FPS; //milliseconds
    this.STEP = this.INTERVAL/1000 //seconds

}


GameEngine.prototype.init = function (ctx, backgroundImage) {
    this.ctx = ctx;
    this.surfaceWidth = this.ctx.canvas.width;
    this.surfaceHeight = this.ctx.canvas.height;
    //create a camera object as a property of the game engine
    this.camera = new GameEngine.Camera(0, 0, this.surfaceWidth,
                                              this.surfaceHeight,
                                              this.worldWidth,
                                              this.worldHeight);

    //create a background object as a property of the game engine
    this.background = new GameEngine.Background(this.surfaceWidth,
                                  this.surfaceHeight,
                                  backgroundImage);
    this.timer = new Timer();
    this.startInput();
}

GameEngine.prototype.start = function () {
    var that = this;
    (function gameLoop() {
        that.loop();
        requestAnimFrame(gameLoop, that.ctx.canvas);
    })();

            //pop up a instruction message for 3 second when the game start
    setTimeout(function(){
        var parent = document.getElementById("gamecontainer");
        var child = document.getElementById("gameStartMessage");
        parent.removeChild(child);
    }, 3000);
}

GameEngine.prototype.startInput = function () {
    console.log('Starting input');

    var that = this;

    // event listeners are added here

    this.ctx.canvas.addEventListener("keydown", function (e) {
      e.preventDefault();
      that.chars[e.code] = true;

    }, false);

    this.ctx.canvas.addEventListener("keyup", function (e) {
      e.preventDefault();
      that.chars[e.code] = false;
    }, false);

    console.log('Input started');



    this.ctx.canvas.addEventListener("keydown", function (e) {
        // console.log(e);
        // console.log(e.code)
        if (e.code === "Space") that.space = true;
        else if (e.code === "ArrowRight") that.right = true;
        else if (e.code === "ArrowLeft") that.left = true;
        else if (e.code === "KeyS") that.s = true;
        e.preventDefault();

        // console.log("Key Down Event - Char " + e.code + " Code " + e.keyCode);
    }, false);

    this.ctx.canvas.addEventListener("keypress", function (e) {

      // console.log(e.code);
      if (e.code === "Space") that.space = true;
      else if (e.code === "ArrowRight") that.right = true;
      else if (e.code === "ArrowLeft") that.left = true;
      else if (e.code === "KeyS") that.s = true;

      e.preventDefault();
        // console.log(e);
        // console.log("Key Pressed Event - Char " + e.charCode + " Code " + e.keyCode);
    }, false);

    this.ctx.canvas.addEventListener("keyup", function (e) {
        // console.log(e);
        if (e.code === "ArrowRight") that.right = false;
        if (e.code === "ArrowLeft") that.left = false;
        e.preventDefault();
        // console.log("Key Up Event - Char " + e.code + " Code " + e.keyCode);
    }, false);

}

GameEngine.prototype.removeTheUnit = function(marker) {
    //console.log(index);
    var target = marker;
    //console.log("initial: " + this.entities.length);
    for(i = 1; i < this.entities.length; i++) {
      if(this.entities[i].marker === target) {
        this.entities.splice(i, 1);
      }
    }
}

GameEngine.prototype.addEntity = function (entity) {
    this.entities.push(entity);
}

GameEngine.prototype.addPlatform = function (platform) {
  this.platforms.push(platform);
}

GameEngine.prototype.addMovingPlatform = function (platform) {
  this.movingPlatforms.push(platform);
}


GameEngine.prototype.draw = function () {
    this.ctx.clearRect(0, 0, this.surfaceWidth, this.surfaceHeight);
    this.ctx.save();
    //draw the game background to the canvas
    this.background.draw(this.ctx, this.camera.xView, this.camera.yView);
    // console.log("camera x:" + this.camera.xView + "camera y" + this.camera.yView);
    for (var i = this.entities.length - 1; i >= 0; i--) {
        this.entities[i].draw(this.ctx);
    }

    for (var i = this.movingPlatforms.length - 1; i >= 0; i--) {
        this.movingPlatforms[i].draw(this.ctx);
    }


    this.ctx.restore();
}

GameEngine.prototype.follow = function() {
    var player = this.entities[0];
    this.camera.follow(player, this.surfaceWidth/2, this.surfaceHeight/2);
}

GameEngine.prototype.update = function () {

    for (var i = 0; i < this.entities.length; i++) {
        var entity = this.entities[i];
        entity.update();
    }

    for (var i = 0; i < this.movingPlatforms.length; i++) {
        var platform = this.movingPlatforms[i];

        platform.update();
    }
    //update the camera after the character move/update its position
    this.camera.update();
}

GameEngine.prototype.loop = function () {
    this.clockTick = this.timer.tick();
    this.update();
    this.draw();
    this.space = false;
    this.s = false;
    this.down = false;
    this.melee = false;
    this.magic = false;
    this.interract = false;
    this.up = false;
}

function Timer() {
    this.gameTime = 0;
    this.maxStep = 0.05;
    this.wallLastTimestamp = 0;
}

Timer.prototype.tick = function () {
    var wallCurrent = Date.now();
    var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;
    this.wallLastTimestamp = wallCurrent;

    var gameDelta = Math.min(wallDelta, this.maxStep);
    this.gameTime += gameDelta;
    return gameDelta;
}

function Entity(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.removeFromWorld = false;
}

Entity.prototype.update = function () {
}

Entity.prototype.draw = function (ctx) {
    if (this.game.showOutlines && this.radius) {
        this.game.ctx.beginPath();
        this.game.ctx.strokeStyle = "green";
        this.game.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.game.ctx.stroke();
        this.game.ctx.closePath();
    }
}

Entity.prototype.rotateAndCache = function (image, angle) {
    var offscreenCanvas = document.createElement('canvas');
    var size = Math.max(image.width, image.height);
    offscreenCanvas.width = size;
    offscreenCanvas.height = size;
    var offscreenCtx = offscreenCanvas.getContext('2d');
    offscreenCtx.save();
    offscreenCtx.translate(size / 2, size / 2);
    offscreenCtx.rotate(angle);
    offscreenCtx.translate(0, 0);
    offscreenCtx.drawImage(image, -(image.width / 2), -(image.height / 2));
    offscreenCtx.restore();
    //offscreenCtx.strokeStyle = "red";
    //offscreenCtx.strokeRect(0,0,size,size);
    return offscreenCanvas;
}
