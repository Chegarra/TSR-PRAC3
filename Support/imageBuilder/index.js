var imgk  = require('imagemagick');
var md5   = require('MD5');
var fs    = require('fs');
var Q     = require('bluebird');
var path  = require('path');

var basedir = path.dirname(__filename) + "/images/si/";

// Accedemos a tipos por número (16 seleccionados)
var tipos = [
"ahronbd.ttf", "andlso.ttf",   "BOD_BLAR.TTF",
"BOOKOSB.TTF",  "BRITANIC.TTF", "BRLNSB.TTF",   "BRLNSDB.TTF",
"BROADW.TTF",   "PALSCRI.TTF",  "phagspab.ttf", "plantc.ttf",
"PRISTINA.TTF", "SketchFlow Print.ttf", "upcjb.ttf",    "upclb.ttf",
"verdanab.ttf"
];

// Tamanyos sólo sirve para "recordar" qué poner en el switch
var tamanyos = ["16", "24", "32", "40", "48"];

// Accedemos a colores por nombre
var colores = {
    blanco:"#FFFFFF",
    negro:"#000000",
    rojo:"#FF0000",
    verde:"#00FF00",
    azul:"#0000FF",
    magenta:"#FF00FF",
    celeste:"#00C89B",
    gris:"#BEBEBE",
    salmon:"#FA8072",
    naranja:"#FFA500",
    coral:"#FF7F50",
    tomate:"#FF6347",
    rosa:"#FFC0CB",
    marron:"#B03060",
    orquidea:"#DA70D6"
};

// Main class
function Rotulo (texto, fuente, tam, color) {
    var that  = this;
    var valid = false;

    function getmd5 () {
        /* 
        Condiciones:
        texto.length < 200, arbitrario
        fuente en 1..tipos[].length, subconjunto del total
        tam en tamanyos[], tamanyos arbitrario
        color en listaColores[], listaColores arbitrario
        */
        if ((texto.length >= 200) || (fuente < 1) || (fuente > tipos.length)) {
            valid = false;
        } else {
            switch (tam) {
                case "16":
                case "24":
                case "32":
                case "40":
                case "48":
                    valid = (colores[color] !== undefined);
                    break;
                default:
                    valid = false;
            }
        }
        if (valid) {
            return md5(tipos[1 + parseInt(fuente,10)] + tam + color + texto);
        }
        return 0;
    }

    function crearRotulo_png () {
        // Se supone que antes se ha invocado a comprobarParametros(), por lo que no se hace aquí
        var fontname = tipos[parseInt(fuente, 10) - 1];
        
        return new Q.Promise(function (res, rej) {
            if (!valid) {
                rej("Invalid parameters");
                return;
            }

            imgk.convert(['-density',
                '72x72',
                '-background',
                'transparent',
                '-fill',
                colores[color],
                '-gravity',
                'Center',
                '-pointsize',
                tam,
                '-font',
                basedir + fontname,
                'label:' + texto,
                'png:'
                ],
                function (err, stdout) {
                    if (err) {
                        console.log('callback convert, error!!! ...');
                        rej(err);
                    } else {
                        var img = new Buffer(stdout, 'binary');
                        that.length = img.byteLength;
                        res(img);
                    }
                }
            );
        });
    }

    this.texto = texto;
    this.fuente = fuente;
    this.tam = tam;
    this.color = color;
    this.md5 = getmd5();
    this.length = null;
    this.img = crearRotulo_png();
}

Rotulo.prototype.hash = function()
{
    return this.md5;
};

module.exports = Rotulo;
