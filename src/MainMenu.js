
BasicGame.MainMenu = function (game) {

	this.music = null;
	this.playButton = null;

};

BasicGame.MainMenu.prototype = {

	create: function () {

		//	We've already preloaded our assets, so let's kick right into the Main Menu itself.
		//	Here all we're doing is playing some music and adding a picture and button
		//	Naturally I expect you to do something significantly better :)

		this.music = this.add.audio('titleMusic');
		this.music.play();
		// this.physics.startSystem(Phaser.Physics.ARCADE);


		//rain
		var emitter = this.add.emitter(this.world.width/2, 0, 400);
		emitter.width = this.world.width;
		// emitter.angle = 30; // uncomment to set an angle for the rain.

		emitter.makeParticles('AX');

		emitter.minParticleScale = 0.1;
		emitter.maxParticleScale = 0.6;

		emitter.setYSpeed(300, 500);
		emitter.setXSpeed(-5, 5);

		emitter.minRotation = 0;
		emitter.maxRotation = 0;

		emitter.start(false, 2300, 5, 0);

		//snow
		var mid_emitter = this.add.emitter(this.world.width/2, -32, 250);
	    mid_emitter.makeParticles('ZX');
	    mid_emitter.maxParticleScale = 0.6;
	    mid_emitter.minParticleScale = 0.1;
	    mid_emitter.setYSpeed(50, 150);
	    mid_emitter.gravity = 0;
	    mid_emitter.width = this.world.width * 1.5;
	    mid_emitter.minRotation = 0;
	    mid_emitter.maxRotation = 40;
	    mid_emitter.start(false, 12000, 40);

		this.add.sprite(0, 0, 'preloaderBackground');
		

		this.button_B=this.add.sprite(this.world.width/2,this.world.height*0.42, 'board_B');
		this.button_B.anchor.set(0.5,2/3);
		this.button_B.scale.set(0.6);
		this.button_B.angle=180;
		this.playButton = this.add.button(this.world.width/2, this.world.height*0.75, 'AZL', this.startGame, this, 'buttonOver', 'buttonOut', 'buttonOver');
		this.playButton.anchor.set(0.5,0.5);

        // this.physics.arcade.enable(this.playButton);


		this.titlepage=this.add.sprite(this.world.width/2, this.world.height*0.3, 'titlepage');
		this.titlepage.anchor.set(0.5,0.5);
	},

	update: function () {

		//	Do some nice funky main menu effect here
		// this.playButton.body.angularVelocity=100;

	},

	startGame: function (pointer) {

           // this.tween = this.add.tween(this.playButton.scale).to( { x: 1, y: 1 }, 1000, Phaser.Easing.Elastic.Out, true);

		//	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
		this.music.stop();

		//	And start the actual game
		this.state.start('Game');

	}

};
