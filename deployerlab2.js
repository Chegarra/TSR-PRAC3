// Desplegador: su mision es desplegar lab2Service,
// sin necesidad de una definicion explicita del despliegue,
// con 1 broker y las instancias de cliente y worker
// que se especifiquen como parametros de entrada
var desplegador = require("./Deployers/basicdeployer");
var desp = new desplegador(undefined,true);
// el num de clientes y trabajadores a lanzar se introduce por teclado
if (process.argv.length != 4) {
	console.log("Introduce num clientes y num trabajadores");
   process.exit();
}

var clientes = process.argv[2];// num de instancias del cliente
var trabajadores = process.argv[3];// num de instancias del worker

deployment ={// realiza el despliegue de lab2Service
	servicePath: require.resolve("./Services/lab2Service"),
	counts: {
		lab2broker: 1,
        lab2worker: trabajadores,
		lab2client: clientes           
	},
       config : {
            lab2broker :{
				external: {
					web: 80
				}
			},
			lab2client: {
				parameter: {
					maxload: 2
				}
			}
      	}
};

desp.deploy(deployment);

