// node lbworker.js <url> <puerto> <texto_disponible> <texto_servicio> <verbose>
// texto_disponible = "ready"
// texto_servicio = "done" 
// verbose = "true" | "false"
// orden de ejecucion -> broker > worker > client

if(process.argv.length == 7){

	var auxfunctions = require('./auxfunctions.js'),
	randString       = require('./randString.js'),
	zmq 			 = require('zmq'),
	requester 		 = zmq.socket('req');
	URL        		 = process.argv[2],
	PUERTO     		 = process.argv[3],
	DISPONIBLE 		 = process.argv[4],
	SERVICIO   		 = process.argv[5],
	VERBOSE    		 = process.argv[6],
	REPLIES			 = 1,
	Q = require('q'),
	eventualMsg = Q.nfbind(requester.on, requester),
	requester.identity = randString.randString(),
	requester.connect('tcp://'+url+':'+puerto);
	
	if(verbose == 'true'){
		console.log('worker ( '+requester.identity+' ) connected to tcp://'+URL+':'+PUERTO+' ...');
		console.log('worker ( '+requester.identity+' ) has sent READY msg: "'+DISPONIBLE+'"');
	}
	
	eventualMsg('message').then(requester.send(DISPONIBLE,REPLIES,PUERTO);
	requester.on('message', function(msg) {
		var args = Array.apply(null, arguments);
        if(VERBOSE == 'true'){
			console.log('worker ( '+args[0]+' ) has received request: "'+args[4]+'" from client ('+args[2]+')');
		}
		if(VERBOSE == 'true'){
			arguments = auxfunctions.limpiarArguments(args);
			auxfunctions.showArguments(args);
			console.log('worker ( '+args[0]+' ) has send its reply');
			auxfunctions.showArguments(args);
			console.log('worker ( '+args[0]+' ) has sent '+(replies++)+' replies');
		}
		eventualMsg('message').then(requester.send([args[2],"",SERVICIO]));
	});
}
else{
	console.log("Número de argumentos inválido.\nSintaxis correcta: node lbworker.js <url> <puerto> <texto_disponibiliad> <texto_servicio> <verbose>");
}
