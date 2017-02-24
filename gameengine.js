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
    console.log('game initialized');
}

GameEngine.prototype.start = function () {
    console.log("starting game");
    var that = this;
    (function gameLoop() {
        that.loop();
        requestAnimFrame(gameLoop, that.ctx.canvas);
    })();
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
        console.log(e.code);
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

<<<<<<< HEAD
//
=======
// GameEngine.prototype.startInput = function () {
//     console.log('Starting input');

//     var getXandY = function (e) {
//         var x = e.clientX - that.ctx.canvas.getBoundingClientRect().left;
//         var y = e.clientY - that.ctx.canvas.getBoundingClientRect().top;

//         if (x < 1024) {
//             x = Math.floor(x / 32);
//             y = Math.floor(y / 32);
//         }

//         return { x: x, y: y };
//     }

//     var that = this;

//     // event listeners are added here

//     this.ctx.canvas.addEventListener("click", function (e) {
//         that.click = getXandY(e);
//         // console.log(e);
//         // console.log("Left Click Event - X,Y " + e.clientX + ", " + e.clientY);
//     }, false);

//     this.ctx.canvas.addEventListener("contextmenu", function (e) {
//         that.click = getXandY(e);
//         // console.log(e);
//         // console.log("Right Click Event - X,Y " + e.clientX + ", " + e.clientY);
//         e.preventDefault();
//     }, false);

//     this.ctx.canvas.addEventListener("mousemove", function (e) {
//         //console.log(e);
//         that.mouse = getXandY(e);
//     }, false);

//     this.ctx.canvas.addEventListener("mousewheel", function (e) {
//         // console.log(e);
//         that.wheel = e;
//         // console.log("Click Event - X,Y " + e.clientX + ", " + e.clientY + " Delta " + e.deltaY);
//     }, false);

//     this.ctx.canvas.addEventListener("keydown", function (e) {
//         // console.log(e);
//         // console.log("Key Down Event - Char " + e.code + " Code " + e.keyCode);
//         // console.log(e.keyCode);
//         that.chars[e.keyCode] = true;
//         // console.log(that.chars[e.keyCode]);
//     }, false);

//     this.ctx.canvas.addEventListener("keypress", function (e) {
//         if (e.code === "KeyD") that.d = true;

//         that.chars[e.code] = true;
//         // console.log(that.chars[e.code]);
//         // console.log("Key Pressed Event - Char " + e.charCode + " Code " + e.keyCode);
//     }, false);

//     this.ctx.canvas.addEventListener("keyup", function (e) {
//         // console.log(e);
//         // console.log("Key Up Event - Char " + e.code + " Code " + e.keyCode);
//         that.chars[e.keyCode] = false;
//     }, false);

//     // console.log('Input started');
// }

GameEngine.prototype.removeTheUnit = function(marker) {
    //console.log(index);
    var target = marker;
    //console.log("initial: " + this.entities.length);
    for(i = 2; i < this.entities.length; i++) {
      if(this.entities[i].marker === target) {
        this.entities.splice(i, 1);
      }
    }
    //console.log("updated: " + this.entities.length);
    this.update(this.entities.length);
}
>>>>>>> c4b68f336772029ff4a4cb18ed24b688529bb849

GameEngine.prototype.addEntity = function (entity) {
    console.log('added entity');
    this.entities.push(entity);
}

GameEngine.prototype.addPlatform = function (platform) {
  this.platforms.push(platform);
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

    this.ctx.restore();
}

GameEngine.prototype.follow = function() {
    var player = this.entities[0];
    this.camera.follow(player, this.surfaceWidth/2, this.surfaceHeight/2);
}

GameEngine.prototype.update = function () {
    var entitiesCount = this.entities.length;

    for (var i = 0; i < entitiesCount; i++) {
        var entity = this.entities[i];

        entity.update();
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
