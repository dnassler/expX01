var menu_state = function(game) {

};
menu_state.prototype = {

	create: function() {

		// define the events/clicks to cause the game to start
		var space_key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    space_key.onDown.add(this.start, this);

    // define the menu screen elements

    var g1 = this.game.add.graphics(0,0);
    g1.beginFill("0x008080");
    g1.drawRect(0,0,this.game.width,this.game.height);

    //g1.beginFill("0xFFFFF0");
    //g1.drawRect(this.game.width-100,this.game.height-100,100,100);

    var sbInfo = this.game.add.bitmapData(100,100,"startButton",true);
    var ctx = sbInfo.ctx;
    ctx.fillStyle = "#FFFFF0";
    ctx.fillRect(0,0,100,100);
    var image1 = this.game.add.sprite(0,0,sbInfo);
    //image1.visible=false;
    var texture1 = this.game.add.renderTexture(100,100);
    texture1.renderXY(image1,0,0);
    var text1 = this.game.add.text(0,0,"start",{font:'30px Arial',fill:"#000000", align:"center"});
    text1.anchor.setTo(0.5,0.5);
    texture1.renderXY(text1,50,50);
    image1.visible=false;
    text1.visible=false;

    //var startButton1 = this.game.add.button( this.game.width-100,this.game.height-100,sbInfo.texture,this.start);
    var startButton1 = this.game.add.button( this.game.width-100,this.game.height-100,texture1,this.start);

    var style = { font: '30px Arial', fill: "#ffffff" };

    var text = this.game.add.text( this.game.world.width/2, this.game.world.height/2, 
    	'Press button to start', style);
    text.anchor.setTo(0.5,0.5);

    
	},

	render: function() {
		//this.game.debug.text("w="+w+", h="+h+", window.devicePixelRatio="+window.devicePixelRatio,10,10);
		this.game.debug.text("window.innerWidth="+window.innerWidth+", window.innerHeight="+window.innerHeight,10,30);
    this.game.debug.text("game.width="+this.game.width+", game.height="+this.game.height,10,50);
    this.game.debug.text("screen.width="+screen.width+", screen.height="+screen.height,10,70);
	},

	start: function() {
		this.game.state.start('play');
	}

};