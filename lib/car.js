var Car = function _CarCtor( options ){
	options || ( options = {} );
	this.board = options.board;
	this.firmata = this.board.firmata;
	this.enablePin = options.enablePin;
	this.motorPin1 = options.motorPin1;
	this.motorPin2 = options.motorPin2;
};
Car.prototype.start = function(){
	this.firmata.pinMode( this.enablePin, this.firmata.MODES.OUTPUT );
	this.firmata.pinMode( this.motorPin1, this.firmata.MODES.OUTPUT );
	this.firmata.pinMode( this.motorPin2, this.firmata.MODES.OUTPUT );
};
Car.prototype.forward = function( value ){
	value || ( value = 500 );
	console.log( "moving forward with speed:", value );
	this.firmata.analogWrite( this.enablePin, value );
	this.firmata.digitalWrite( this.motorPin1, this.firmata.LOW );
	this.firmata.digitalWrite( this.motorPin2, this.firmata.HIGH );
};
Car.prototype.backward = function( value ){
	value || ( value = 500 );
	this.firmata.analogWrite( this.enablePin, value );
	this.firmata.digitalWrite( this.motorPin1, this.firmata.HIGH );
	this.firmata.digitalWrite( this.motorPin2, this.firmata.LOW );
};

Car.prototype.stop = function(){
	this.firmata.pinMode( this.motorPin1, this.firmata.LOW );
	this.firmata.pinMode( this.motorPin1, this.firmata.LOW );
	this.firmata.pinMode( this.motorPin2, this.firmata.LOW );
};
Car.prototype.center = function(){};
module.exports = Car;