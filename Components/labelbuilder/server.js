var zmq = require('zmq')
  , responder = zmq.socket('req');
var aux = require('./auxfunctions.js');
var Rotulo = require('./imageBuilder');

var config = require('config');

//if (process.argv.length < 7) {
//	console.log("Introduce 5 argumentos: URL, identidad, disponibilidad, servicio, modo verbose(0/1)");
//}
console.log("Si no pones Identidad la coge del docker, CTRL+C para cancelar\n");
var identidad =  config.instanceId || process.argv[2].toString();
var url =  config.requires.url || process.argv[3].toString();
var disponible =  config.parameter.disponible || process.argv[4].toString() ;
//var servicio = 'trabajo hecho';//process.argv[5].toString();
var verbose =  config.parameter.verbose || process.argv[5];

responder.identity = identidad;
responder.connect(url);
responder.send(disponible);
var req;
responder.on('message', function() {
	var args = Array.apply(null, arguments);
	if(verbose){
		console.log('peticion recibida de ' + args[0]);
		aux.showArguments(args);
	}
	req = JSON.parse(args.pop().toString());
	rot = new Rotulo(req.texto, req.fuente, req.tam, req.color);
	rot.img.then(function (img){
		//mensaje = JSON.stringify(img);	
		mensaje = img;
		args.push('OK');
		args.push(mensaje);
		responder.send(args);
	}).catch (function (err){
		args.push('ERROR');
		args.push("No se puede construir la imagen");
		responder.send(args);
	});
});
	
