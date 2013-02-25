var MULTIPLIER = 500;
var car;
document.addEventListener( "DOMContentLoaded", function(){
	car = new Car();
}, false);

var Car = function _CarCtor(){
	this.initEls();
	this.initEio();
	this.initEvents();
	this.axes = [];
	this._axesDirs = [ "updown", "leftright" ];
	this._keyDowns = {};
	this._dirs = {
		38: "forward",
		40: "backward",
		39: "right",
		37: "left"
	};
};

Car.prototype.initEls = function _CarInitEls(){
	this.els = {};
	[ "forward", "backward", "left", "right" ].forEach(function( name ){
		this.els[ name ] = document.querySelector( "." + name );
	}, this);
	window.addEventListener("MozGamepadConnected", this.onGamePad.bind( this ) );
};

Car.prototype.onGamePad = function _CarOnGamePad( e ){
	this.gamePad = e.gamepad;
	this.bindGamePad();
};

Car.prototype.bindGamePad = function _CarBindGamePad( gamePad ){
	window.mozRequestAnimationFrame( this.readGamePadData.bind( this ) );
};

Car.prototype.readGamePadData = function _CarReadGamePadData(){
	var axes = this.gamePad.axes;
	[ 0, 1 ].forEach(function( i ){
		if( this.axes[ i ] !== axes[ i ] ){
			this.moveByAxes( this._axesDirs[ i ], axes[ i ] );
			this.axes[ i ] = axes[ i ];
		}
	}, this);
	this.bindGamePad();
};

Car.prototype.moveByAxes = function _CarMoveByAxes( mayBeDir, value ){
	var dir;
	if( value < 0 ){
		if( mayBeDir === "updown" ){
			dir = "backward";
		}
		else{
			dir = "left";
		}
	}
	else{
		if( mayBeDir === "updown" ){
			dir = "forward";
		}
		else{
			dir = "right";
		}
	}
	var speed = Math.abs(value*MULTIPLIER),
			action = speed < 5 ? "stop" : "start";
	this.send( dir, action, speed );
};

Car.prototype.initEio = function _CarInitEio(){
	this.socket = eio();
};

Car.prototype.initEvents = function _CarInitEvents(){
	document.addEventListener( "keydown", this.handleKeyDown.bind( this ), false );
	document.addEventListener( "keyup", this.handleKeyUp.bind( this ), false );
};

Car.prototype.handleKeyUp = function _CarEvKeyUp( e ){
	var dir;

	if( !( dir = this._dirs[ e.which ] ) ){
		return;
	}
	this._keyDowns[ e.which ] = false;
	this.els[ dir ].style.backgroundColor = "";
	this.send( dir, "stop" );

};

Car.prototype.handleKeyDown = function _CarEvKeyDown( e ){
	var dir;

	if( this._keyDowns[ e.which ] || !( dir = this._dirs[ e.which ] ) ){
		return;
	}
	this._keyDowns[ e.which ] = Date.now();
	this.els[ dir ].style.backgroundColor = "red";
	this.send( dir, "start" );
};

Car.prototype.send = function _CarSend( dir, action, speed ){
	if( ( /right|left/ ).test( dir ) ){
		return "we don't support this yet";
	}
	this.socket.send(
		JSON.stringify({
			dir: dir,
			action: action,
			speed: speed,
			date: Date.now()
		})
	);
};