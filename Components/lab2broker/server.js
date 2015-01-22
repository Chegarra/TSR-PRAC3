// node lbbroker.js <puerto_frontend> <puerto_broker> <verbose> 
// verbose = true | false
// orden de ejecucion -> broker > worker > client

if(process.argv.length == 5){
	var zmq = require('zmq'),
	frontend = zmq.socket('router'),
	backend = zmq.socket('router'),
	auxfunctions = require('./auxfunctions.js'),
	PUERTO_FRONTEND = process.argv[2],
	PUERTO_BROKER = process.argv[3],
	VERBOSE = process.argv[4],
	numWorkers = 0,
	workers = new Array(),
	punt_worker = 0;
	
	if(verbose == 'true'){
		console.log('broker: frontend-router listening on tcp://*:'+PUERTO_FRONTEND+' ...'); 
		console.log('broker: backend-router listening on tcp://*:'+PUERTO_BROKER+' ...');
	}
	
	frontend.bindSync('tcp://*:'+PUERTO_FRONTEND);
	backend.bindSync('tcp://*:'+PUERTO_BROKER);

	frontend.on('message', function(){
		var args = Array.apply(null, arguments);
		if(workers.length == 0){
			frontend.send([args[0],"",'Request denied. Unavailable workers.']);
		}
		else{
			if(VERBOSE == 'true'){
				console.log("received request: '"+args[2]+"' from client ( "+args[0]+" )");
				auxfunctions.showArguments(args);
			}
			//Selecciono el trabajador disponible
			var encontrado = false;
			while(!encontrado){
				if(punt_worker == null){
					punt_worker = 0;
					workers[punt_worker+1] = 'ocuppied';
					encontrado = true;
				}
				else{
					//Si todavia quedan workers en el array
					if(punt_worker+2 <= workers.length-1){
						//avanzo al siguiente worker y compruebo su estado
						punt_worker = punt_worker+2;
						if(workers[punt_worker+1] != 'occupied'){
							workers[punt_worker+1] = 'occupied';
							encontrado = true;
						}
					}
					else{
						punt_worker = null;
					}
				}
			}
			args.unshift(workers[punt_worker],"");
			if(VERBOSE == 'true'){
				console.log('sending client ( '+args[2]+' ) req to worker ( '+workers[punt_worker]+' ) through bakend');
				auxfunctions.showArguments(args);
			}
			backend.send([workers[punt_worker],"",args]);
		}
	});
	
	backend.on('message', function() {
		var args = Array.apply(null, arguments);
		if(args[2]=='ready'){
			workers.push(args[0]);
			workers.push(args[2]);
			if(verbose == 'true'){
				console.log("received request: '"+args[2]+"' from worker ( "+args[0]+" )");
				auxfunctions.showArguments(args);
			}
		}
		else{
			for(var i=0;i<workers.length-1;i=i+2){
				if(workers[i]==args[0]){
					workers[i+1]="I_am_ready";
					break;
				}
			}
			if(VERBOSE == 'true'){
				console.log("received request: '"+args[4]+"' from worker ( "+args[0]+" )");
				auxfunctions.showArguments(args);			
				console.log('sending worker ( '+args[0]+' ) rep to client ( '+args[2]+' ) through frontend');
			}
			args = auxfunctions.limpiarArguments(args);
			if(VERBOSE == 'true')
				auxfunctions.showArguments(args);
			frontend.send(args);	
		}
	});
}
else{
	console.log('Número de argumentos inválido.\nSintaxis correcta: node lbbroker.js <puertoFronted> <puertoBackend> <verbose>');
}
