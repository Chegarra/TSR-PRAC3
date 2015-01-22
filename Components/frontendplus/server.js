var zmq    = require('zmq');
var fs     = require('fs');
var Q      = require('bluebird');
var config = require('config');
var url    = require('url');
var aux = require('./auxfunctions.js');
var dealersock = zmq.socket('dealer');

console.log("Si no pones Identidad la coge del docker, CTRL+C para cancelar\n");
dealersock.identity =  config.instanceId || process.argv[2].toString();//obtiene la identidad a partir del parametro de configuracion, esto se hace en local
															// cuando lo hagamos desde docker no hará falta
//console.log (config.requires.balancerurl);
dealersock.connect(config.requires.balancerurl); //url del frontend del broker
//dealersock.connect("tcp://localhost:8001");

var brokersock = zmq.socket('dealer');
brokersock.identity =   config.instanceId || process.argv[2].toString();
brokersock.connect(config.requires.brokerurl);
//brokersock.connect("tcp://localhost:8002");
// Each HELLO message gives the balancer one ticket to send us requests
// the configuration parameter "load" determines the number of tickets
// this component gives the load balancer
//
var maxload = config.parameter.maxload || process.argv[3];
for (var i = 0; i < maxload; i++) {
    dealersock.send('HELLO');
}

// ongoing requests. Initially none.
var requests = {};


// very simple front-end
// it deals with basic request/response patterns.
// We assume a NEW message carries all the load of the request.
// we cannot deal for now with extra DATA packets...
// 
dealersock.on('message', function () {
	var args  = Array.prototype.slice.call(arguments);//el primer argumento sera la operacion ya que el identificador del frontend no le llega
													// porque el router lo corta cuando le llega el mensaje

    var arg = Array.apply(null, arguments);
  

    var op    = args.shift().toString();// extrae el tipo de operacion
	var reqId = args.shift().toString();// extrae el reqId
//despues de quitar estos dos segmentos, solo queda la info que estaba en el cuarto segmento, que es la peticion
//cada hilo va a tener un reqId distinto y no va a haber conflicto
    console.log('got message', op, reqId);
    switch (op) {
    	case 'NEW':
    		if (requests[reqId]) {
    			console.log('ReqId already exists');
    			return;
    		}
    		requests[reqId] = args;

            //resp[0]=cabecera de respuesta al navegador, resp[1]=contenido de la imagen
            processRequest(reqId).then(function (resp) {//aqui dentro se construye una promesa, se procesa la peticion de forma asincrona
        		dealersock.send(['HEADERS', reqId, JSON.stringify(resp[0])])// y se le envia la respuesta al balancer
                dealersock.send(['DATA',    reqId, resp[1]]);//cabecera, datos y cierre de conexion
        		dealersock.send(["CLOSE",   reqId]);
        		dealersock.send(['HELLO']); // make myself available again
            })
            .catch(function (err) {// en caso que la promesa sea Rejected saltaremos al catch (si el frontend casca)
                dealersock.send(['ERROR', reqId, err[0], err[1]]);//envia mensaje al balancer antes de morir, indicando que se ha producido un error
                delete requests[reqId];//devuelve mensaje de error asociado a ese reqId y despues borra la entrada del reqId
                dealersock.send('HELLO'); // make myself available again, mensaje de hola al nuevo ticket del balancer
            });
    		// end the request
    		break;
        case 'CLOSE':
        	delete requests[reqId];
        	dealersock.send('HELLO'); // make myself available again
        	break;
        case 'DATA':
        	console.log("Got data. Can't handle it");
        	break;
    }

});

brokersock.on('message', function(){
    var args  = Array.prototype.slice.call(arguments);
    var arg = Array.apply(null, arguments);
    //aux.showArguments(arg);

    var reqId = args.shift().toString();
    var op = args.shift().toString();
    switch(op){
        case 'OK':
          //  data = JSON.parse(args.shift());
			data = args.shift();
            requests[reqId].resolvers.res([{'Content-Type': 'image/png', 'Content-Length': data.length}, data]);
            break;
        case 'ERROR':
            data = args.shift();
            requests[reqId].resolvers.rej(['400', data]);
            break;
    }
});

// processor, where things happen.
//como se procesa la peticion -> con el args, que contiene una cadena de texto en formato Json
function processRequest(reqId) {    
	var request  = JSON.parse(requests[reqId].toString());//se pasa a String y se hace el parse
    var purl     = url.parse(request.url, true);//sacamos la url y la pasa a formato parse

    return new Q.Promise(function (res, rej) {
        switch (purl.pathname) {//de esa url saca el pathname de la peticion, el primero sera un path vacio (la barra)
            case '/'://si es la barra devolvera el formulario y el navegador volvera a lanzar una nueva peticion con los estilos
                res([{'Content-Type': 'text/html'}, fs.readFileSync(__dirname + '/public/templates/formulario_rotulo.html')]);
                break;
            case '/tsr.css':
                res([{'Content-Type': 'text/css'}, fs.readFileSync(__dirname + '/public/stylesheets/tsr.css')]);
                break;
                
            case '/process':
				requests[reqId].resolvers = {res: res, rej: rej};//res = valor promesa ok, rej = valor promesa error
				brokersock.send([reqId, JSON.stringify(purl.query)]);
				break;

                
            default:
                fs.readFile(__dirname + '/public/images/vendetta.png', function (err, data) {
                    if (err) {
                        rej(['400', "Server error"]);
                    } else {//si se ha procesado correctamente la imagen, devuelve la cabecera con la imagen
                        res([{'Content-Type': 'image/png', 'Content-Length': data.length}, data])
                    }
                });
    	}
    });
}
