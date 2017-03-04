
//Wrapper for rectangle class
(function(){
	//add rectangle class to our game engine object
	GameEngine.Rectangle = function (left, top, width, height){
		this.left = left || 0;
		this.top = top || 0;
			this.width = width || 0;
		this.height = height || 0;
		this.right = this.left + this.width;
		this.bottom = this.top + this.height;
	};

	//set the top, left,right, bottom coordinate
	GameEngine.Rectangle.prototype.set = function(left, top, /*optional*/width, /*optional*/height){
		this.left = left;
	    this.top = top;
	    this.width = width || this.width;
		this.height = height || this.height;	
		this.right = (this.left + this.width);
	  	this.bottom = (this.top + this.height);
	}

	GameEngine.Rectangle.prototype.overlaps = function(r) {
		return (this.left < r.right && 
	  			r.left < this.right &&
	          	this.top < r.bottom &&
	          	r.top < this.bottom);
	}

	//checking if the object is out of boundary(Game world)
	GameEngine.Rectangle.prototype.within = function(r) {
		return (r.left <= this.left &&
				r.right >= this.right &&
				r.top <= this.top &&
				r.bottom >= this.bottom);
	}
})();

(function() {
	//possible axis to move the camera (avoid global objects)
	var AXIS = {
	  NONE: "none",
	  HORIZONTAL: "horizontal",
	  VERTICAL: "vertical",
	  BOTH: "both"
	};

	//Camera constructor
	function Camera(xView, yView, canvasWidth, canvasHeight, worldWidth, worldHeight) {
		//position of camera(left-top coordinate)
	  //viewport is an object to be followed
	  this.xView = xView || 0;
	  this.yView = yView || 0;
	  
	  //distance from followed object to the border before camera start move
	  this.xDeadZone = 0; //min distance to horizontal borders
	  this.yDeadZone = 0; //min distance to vertical borders
	  
	  //viewport dimensions is the canvas display the proportion of the game world
	  this.wView = canvasWidth;
	  this.hView = canvasHeight;
	  
	  //allow camera to move to move in vertical and horizontal axis
	  this.axis = AXIS.BOTH;
	  
	  //object that should be followed
	  this.followed = null;
	  
	  //rectangle that represents the viewport
	  this.viewportRect = new GameEngine.Rectangle(0, 0, this.wView, this.hView);
	  
	  //rectangle that represent the world's boundary(room's boundary)
	  this.worldRect = new GameEngine.Rectangle(0, 0, worldWidth, worldHeight);
	}

	//gameObject needs to have "x" and "y" properties (as world(or room)position)
	Camera.prototype.follow = function(gameObject, xDeadZone, yDeadZone) {
		this.followed = gameObject;
		this.xDeadZone = xDeadZone;
		this.yDeadZone = yDeadZone;
	}

	Camera.prototype.draw = function(){
		
	}

	Camera.prototype.update = function()
	{
		// keep following the player (or other desired object)
		if(this.followed != null)
		{		
			if(this.axis == AXIS.HORIZONTAL || this.axis == AXIS.BOTH)
			{		
				// moves camera on horizontal axis based on followed object position
				if(this.followed.x - this.xView  + this.xDeadZone > this.wView){
					// console.log("xView: " +xView + "---- character x:"  + this.followed.x);
					this.xView = this.followed.x - (this.wView - this.xDeadZone);
					// this.xView = this.followed.x - this.wView;
				}else if(this.followed.x  - this.xDeadZone < this.xView)
					this.xView = this.followed.x  - this.xDeadZone;
				
			}
			if(this.axis == AXIS.VERTICAL || this.axis == AXIS.BOTH)
			{
				// moves camera on vertical axis based on followed object position
				if(this.followed.y - this.yView + this.yDeadZone > this.hView)
					this.yView = this.followed.y - (this.hView - this.yDeadZone);
				else if(this.followed.y - this.yDeadZone < this.yView)
					this.yView = this.followed.y - this.yDeadZone;
			}						
			
		}		
		
		// update viewportRect
		this.viewportRect.set(this.xView, this.yView);
		
		// don't let camera leaves the world's boundary
		if(!this.viewportRect.within(this.worldRect))
		{
			if(this.viewportRect.left < this.worldRect.left){
				this.xView = this.worldRect.left;
			}
			if(this.viewportRect.top < this.worldRect.top){
				this.yView = this.worldRect.top;
			}				
				
			if(this.viewportRect.right > this.worldRect.right){
				this.xView = this.worldRect.right - this.wView;
			}
			if(this.viewportRect.bottom > this.worldRect.bottom){					
				this.yView = this.worldRect.bottom - this.hView;
			}
		}
	}

	//GameEngine.Camera.prototype.draw = 
	GameEngine.Camera = Camera;
})();

// wrapper for "class" Background
(function(){
	function Background(width, height, image){
		// map dimensions
		this.width = width;
		this.height = height;
		
		// map texture
		this.image = image;
	}
		
	// draw the map adjusted to camera
	Background.prototype.draw = function(context, xView, yView){					
		// easiest way: draw the entire map changing only the destination coordinate in canvas
		// canvas will cull the image by itself (no performance gaps -> in hardware accelerated environments, at least)
		//context.drawImage(this.image, 0, 0, this.image.width, this.image.height, -xView, -yView, this.image.width, this.image.height);
		
		// didactic way:
		
		var sx, sy, dx, dy;
        var sWidth, sHeight, dWidth, dHeight;
		
		// offset point to crop the image
		sx = xView;
		sy = yView;
		
		// dimensions of cropped image			
		sWidth =  context.canvas.width;
		sHeight = context.canvas.height;

		// if cropped image is smaller than canvas we need to change the source dimensions
		if(this.image.width - sx <= sWidth){
			// console.log("width1" + sWidth + "height1" + sHeight);
			sWidth = this.image.width - sx;
		}
		if(this.image.height - sy <= sHeight){
			// console.log("width2" + sWidth + "height2" + sHeight);

			sHeight = this.image.height - sy; 
		}
		
		// location on canvas to draw the croped image
		dx = 0;
		dy = 0;
		// match destination with source to not scale the image
		dWidth = sWidth;
		dHeight = sHeight;									
		// console.log("sx: " + sx + "sy: " + sy);
		context.drawImage(this.image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);			
	}
	
	// add "class" Map to our Game object
	GameEngine.Background = Background;
	
})();

	















