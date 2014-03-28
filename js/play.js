var play_state = function(game) {
	that = this;

	this.debug = false;

	this.p1 = null;
	this.p2 = null;
	this.p3 = null;
	this.p4 = null;

	this.g1 = null;
	this.g1Sprite = null;
	
	this.drawingShape = false;
	this.shapeBeingDrawn = null;

	this.rt1 = null;
	this.renderedShapes = null; // this is the sprite that uses the rt1 renderTexture

	this.shapeColorArr = [
		"rgb(112,128,144)","rgb(106,90,205)","rgb(255,215,0)","rgb(25,25,112)","rgb(72,61,139)",
		"rgb(240,128,128)","rgb(188,143,143)","rgb(30,144,255)","rgb(220,20,60)","rgb(47,79,79)"
		];

	this.doubleTapOccurred = false;

	this.shapeHistory = [];

	this.drawingShapeStartTime = 0;
	this.saveNewShapeThreshold = 1000;

	this.swipeOccurredAt = 0;
	this.swipeOccurred = false;
};
play_state.prototype = {

	create: function() {
		// define events...
		var space_key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  	space_key.onDown.add(this.myfunc1, this);

    var restart_key = this.game.input.keyboard.addKey(Phaser.Keyboard.Q);
    restart_key.onDown.add(this.restart, this);

    // touch or click listener
    this.game.input.onDown.add( this.clickListener );
    this.game.input.onUp.add( this.pointerReleased );
    this.game.input.addPointer();
    this.game.input.addPointer();
    this.game.input.addPointer();
    this.game.input.addPointer();

    that.p1 = that.game.input.pointer1;
    that.p2 = that.game.input.pointer2;
    that.p3 = that.game.input.pointer3;
    that.p4 = that.game.input.pointer4;

    // define timers...
    // this.timer = this.game.time.events.loop(1000, this.myfuncN, this);

    // define score?
    // score = 0;

    // define sprites...
    // this.sprite1 = this.game.add.sprite(x,y,'spriteName');
    // this.sprite1.body.gravity.y = 1000;
    // this.sprite1.anchor.setTo(0.5,0.5);

    // define elements/sprites/groups..
    // this.group1 = game.add.group();

    // var style = { font: "30px Arial", fill: "#ffffff" };
    // this.label1 = this.game.add.text(this.game.world.width/2,this.game.world.height/2,"Random text in the play state.", style);
    // this.label1.anchor.setTo(0.5,0.5);

    // this.rt0 = this.game.add.renderTexture(this.game.world.width, this.game.world.height);
    // this.rt0Sprite = this.game.make.sprite(0,0,this.rt0);
    this.rt1 = this.game.add.renderTexture(this.game.world.width, this.game.world.height);
    this.renderedShapes = this.game.add.sprite(0,0,this.rt1);

    this.newShapeBM = this.game.add.bitmapData(this.game.world.width, this.game.world.height);
    this.newShapeSprite = this.game.make.sprite(0,0,this.newShapeBM);
    //this.newShapeSprite.visible = false;

    this.g1 = this.game.add.bitmapData(this.game.world.width, this.game.world.height);
    this.g1Sprite = this.game.add.sprite(0,0,this.g1);

    this.drawingShape = false;
    this.shapeBeingDrawn = null;

    // define sounds..
    // this.sound1 = this.game.add.audio('sound1');
    // this.sound2 = this.game.add.audio('sound2');
	},

	update: function() {
		// restart game when necessary?
		// this.restart();

		//if ( this.p1.isDown && this.p2.isDown && this.p3.isDown ) {
		if ( this.p1 && this.p1.isDown && this.p2 && this.p3 && this.p2.screenX > -1 && this.p3.screenY > -1 ) {
			//this.g1.beginFill("#87CEFA");
			this.g1.clear();
			var ctx = this.g1.ctx;
			ctx.fillStyle = "#87CEFA";
			ctx.beginPath();
			ctx.moveTo( this.p1.worldX, this.p1.worldY );
			ctx.lineTo( this.p2.worldX, this.p2.worldY );
			ctx.lineTo( this.p3.worldX, this.p3.worldY );
			if ( this.p4.isDown ) {
				this.shapeBeingDrawn = "square";
				ctx.lineTo( this.p4.worldX, this.p4.worldY );
			} else {
				this.shapeBeingDrawn = "triangle";
			}
			ctx.closePath();
			ctx.fill();

			if ( !this.drawingShape ) {
				this.drawingShapeStartTime = this.game.time.now;
			}
			this.drawingShape = true;
			//ctx.fillRect(this.p1.screenX, this.p1.screenY, (this.p2.screenX - this.p1.screenX), (this.p2.screenY - this.p1.screenY));
		
		} else {
			this.g1.clear();
		}

		if ( this.doubleTapOccurred && (this.game.time.now - this.p1.previousTapTime) > 1000 ) {
    	this.doubleTapOccurred = false;
    }
    
    if ( this.game.time.now - this.swipeOccurredAt > 1000 ) {
    	this.swipeOccurred = false;
    }
    if ( !this.swipeOccurred && this.isSwipe() ) {
    	this.swipeOccurred = true;
    	this.swipeOccurredAt = this.game.time.now;
    	this.swipeEventCallback();
    }

	},

	render: function() {

		if ( !this.debug ) return;

		//game.debug.text("w="+w+", h="+h+", window.devicePixelRatio="+window.devicePixelRatio,10,10);
		this.game.debug.text("window.innerWidth="+window.innerWidth+", window.innerHeight="+window.innerHeight,10,30);
    this.game.debug.text("game.width="+this.game.width+", game.height="+this.game.height,10,50);
    this.game.debug.text("screen.width="+screen.width+", screen.height="+screen.height,10,70);
    
    if ( this.p1 ) this.game.debug.text("p1.x="+this.p1.screenX+", p1.y="+this.p1.screenY+", p1.isDown="+this.p1.isDown, 10,100);
    if ( this.p2 ) this.game.debug.text("p2.x="+this.p2.screenX+", p2.y="+this.p2.screenY+", p2.isDown="+this.p2.isDown, 10,120);
    if ( this.p3 ) this.game.debug.text("p3.x="+this.p3.screenX+", p3.y="+this.p3.screenY+", p3.isDown="+this.p3.isDown, 10,140);
    if ( this.p4 ) this.game.debug.text("p4.x="+this.p4.screenX+", p4.y="+this.p4.screenY+", p4.isDown="+this.p4.isDown, 10,160);
    if ( this.game.input.activePointer ) {
    		
    		this.game.debug.text("activePointer.isDown="+this.game.input.activePointer.isDown
    			+", distanceDown="+(Phaser.Point.distance(this.game.input.activePointer.position, this.game.input.activePointer.positionDown))
    			+", timeUp-timeDown="+(this.game.input.activePointer.timeUp - this.game.input.activePointer.timeDown)
    			, 10,200);
    	}

    this.game.debug.pointer(this.p1);
    this.game.debug.pointer(this.p2);
    this.game.debug.pointer(this.p3);
    this.game.debug.pointer(this.p4);

    if ( this.doubleTapOccurred ) {
    	this.game.debug.text("p1 was double clicked: p1.msSinceLastClick="+this.p1.msSinceLastClick, 10,180);
    } else if ( (this.game.time.now - this.swipeOccurredAt) < 1000 ) {
    	this.game.debug.text("swipe occurred! this.game.input.activePointer.isDown="+this.game.input.activePointer.isDown+" swipetime="+this.swipeOccurredAt, 10, 180);
    }
	},

	restart: function() {
		// remove timer events?
		// this.game.time.events.remove(this.timer);

		// go back to menu state
		this.game.state.start('menu');
	},

	// ===
	clearDrawing: function() {
		that.newShapeBM.clear();
		that.rt1.renderXY( that.newShapeSprite, 0,0, true );
	},

	drawShapeFromInfo: function(shapeInfo) {
		console.log("drawShapeFromInfo: in");
		that.newShapeBM.clear();
		var ctx = that.newShapeBM.ctx;
		ctx.save();
		ctx.fillStyle = shapeInfo.fillStyle;
		ctx.beginPath();
		ctx.moveTo( shapeInfo.p1.x, shapeInfo.p1.y );
		ctx.lineTo( shapeInfo.p2.x, shapeInfo.p2.y );
		ctx.lineTo( shapeInfo.p3.x, shapeInfo.p3.y );
		if ( shapeInfo.p4 ) {
			ctx.lineTo( shapeInfo.p4.x, shapeInfo.p4.y );
		}
		ctx.closePath();
		ctx.globalAlpha = 0.4;
		ctx.fill();
		ctx.restore();
		//that.rt0.renderXY( that.renderedShapes, 0,0, true ); // save the state of the drawn shapes before adding another
		that.rt1.renderXY( that.newShapeSprite, 0,0, false );
	},

	myfunc1: function() {},

	myfunc2: function() {},

	swipeEventCallback: function() {
		console.log("swipeEventCallback: undo last shape.");
		//that.rt1.renderXY( that.rt0Sprite, 0,0, true ); // undo the last shape addition

		if ( that.shapeHistory.length > 0 ) {
			var lastShape = that.shapeHistory.pop();
			var i;
			that.clearDrawing();
			for ( i=0; i<that.shapeHistory.length; i+=1 ) {
				that.drawShapeFromInfo( that.shapeHistory[i] );
			}
		}
	},

	doubleTapCallback: function() {
		console.log("doubleTapCallback: IN");
		//alert('doubleTapCallback: IN');
		if (window.canvas2ImagePlugin) {
			console.log("doubleTapCallback: about to attempt saving canvas.")
			window.canvas2ImagePlugin.saveImageDataToLibrary(
				function(msg) {
					console.log(msg);
					alert('Current drawing was saved!');
				},
				function(err){
					console.log(err);
					alert('Current drawing was *NOT* saved!');
				},
				that.game.canvas
			);	
		}
		
	},

	clickListener: function() {
		var x = that.game.input.x;
		var y = that.game.input.y;
		console.log("clickListener: x="+x);
		console.log("clickListener: y="+y);

		if ( !that.doubleTapOccurred && that.p1.msSinceLastClick <= that.game.input.doubleTapRate ) {
			that.doubleTapOccurred = true;
			that.doubleTapCallback();
		}
		//if ( p1.totalTouches == 2 )	{
		//	that.game.debug.text("clickListener: p1.totalTouches="+that.p1.totalTouches, 10,220);
		//}	

		// console.log("clickListener: that.game.input.pointer1.x="+that.game.input.pointer1.x);
		// console.log("clickListener: that.game.input.pointer1.y="+that.game.input.pointer1.y);

		// console.log("clickListener: that.game.input.pointer2.x="+that.game.input.pointer2.x);
		// console.log("clickListener: that.game.input.pointer2.y="+that.game.input.pointer2.y);

		// console.log("clickListener: that.game.input.pointer3.x="+that.game.input.pointer3.x);
		// console.log("clickListener: that.game.input.pointer3.y="+that.game.input.pointer3.y);
	},

	pointerReleased: function() {
		//this.game.debug.text("pointerReleased: IN", 10,200);

		if ( that.drawingShape == true ) {
			//this.game.debug.text("pointerReleased: draw shape now!", 10,220);

			// commit the shape
			that.drawingShape = false;

			if ( (that.game.time.now - that.drawingShapeStartTime) > that.saveNewShapeThreshold ) {

				var fillStyle = Phaser.Math.getRandom( that.shapeColorArr );
				var newShapeInfo = {fillStyle:fillStyle, p1:{x:that.p1.worldX, y:that.p1.worldY}, p2:{x:that.p2.worldX, y:that.p2.worldY}, p3:{x:that.p3.worldX, y:that.p3.worldY}};
				if ( that.shapeBeingDrawn == "square" ) {
					newShapeInfo.p4 = {x:that.p4.worldX, y:that.p4.worldY};
				}

				that.drawShapeFromInfo( newShapeInfo );
				that.shapeHistory.push( newShapeInfo );

				// that.newShapeBM.clear();
				// var ctx = that.newShapeBM.ctx;
				// ctx.save();
				// ctx.fillStyle = Phaser.Math.getRandom( that.shapeColorArr );
				// ctx.beginPath();
				// ctx.moveTo( that.p1.screenX, that.p1.screenY );
				// ctx.lineTo( that.p2.screenX, that.p2.screenY );
				// ctx.lineTo( that.p3.screenX, that.p3.screenY );
				// if ( that.shapeBeingDrawn == "square" ) {
				// 	ctx.lineTo( that.p4.screenX, that.p4.screenY );
				// }
				// ctx.closePath();
				// ctx.globalAlpha = 0.4;
				// ctx.fill();
				// ctx.restore();
				// that.rt0.renderXY( that.renderedShapes, 0,0, true ); // save the state of the drawn shapes before adding another
				// that.rt1.renderXY( that.newShapeSprite, 0,0, false );

				
				//that.lastShape = newShapeInfo;

			}
			
		}
	},

	isSwipe: function() {
		// 1st parameter determines the distance of the active pointer. My swipe distance trashhold is 150, you can play around with this value
		// in order to get a better feeling.
		// So basicly what you do is look for a certain distance (150) in a given time frame (min 100ms till 250ms).
	  if ( this.game.input.activePointer.isDown ) return false;
	  if ( !this.game.input.activePointer.justReleased() ) return false;
	  var durDown = (this.game.input.activePointer.timeUp - this.game.input.activePointer.timeDown);
	  return (Phaser.Point.distance(this.game.input.activePointer.position, this.game.input.activePointer.positionDown) > 150 && durDown > 100 && durDown < 250);
	}


};