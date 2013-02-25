
/**
 * Module dependencies.
 */

var express = require("express"),
		http = require("http"),
		path = require("path"),
		engine = require( "engine.io" ),
		Car = require( "./lib/car" );

var app = express();

app.configure(function(){
	app.set("port", process.env.PORT || 3000);
	app.set("views", __dirname + "/views");
	app.set("view engine", "jade");
	app.use(express.favicon());
	app.use(express.logger("dev"));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, "public")));
});

app.configure("development", function(){
	app.use(express.errorHandler());
});
app.get("/", function( req, res ){
	res.render( "index" );
});
var server = http.createServer(app);
var eio = engine.attach( server );

app.eio = eio;

var five = require("johnny-five"),
		board = new five.Board(),
		car;
console.log( "waiting the board to be ready" );
board.on("ready", function() {
	var enablePin = 11,
			in1Pin = 10,
			in2Pin = 9;

	car = new Car({
		board: board,
		motorPin1: 9,
		motorPin2: 10,
		enablePin: 11
	});
	
	board.repl.inject({
		car: car
	});

	server.listen(app.get("port"), function(){
		console.log("Express server listening on port " + app.get("port"));
	});

});


eio.on( "connection", function( socket ){
	
	socket.on( "message", function( data ){
		console.log( "got message:", data );
		data = JSON.parse( data );
		var method;
		if( data.action === "stop" ){
			if( (/forward|backward/).test( data.dir ) ){
				method = "stop";
			}
			else{
				method = "center";
			}
		}

		else if( data.action === "start" ){
			if( (/forward|backward/).test( data.dir ) ){
				method = data.dir;
			}
			else{
				
			}
		}

		if( !method ){
			return;
		}
		console.log( "calling method (%s) with value (%s)", method, data.speed );
		car.start();
		car[ method ]( data.speed );
	});
});

