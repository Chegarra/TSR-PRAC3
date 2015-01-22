module.exports = {
    
    // *** getLoad function
 
    getLoad : function() {
        var fs = require('fs')
        , data = fs.readFileSync("/proc/loadavg") // version sincrona
        , tokens = data.toString().split(' ')
        , min1 = parseFloat(tokens[0])+0.01
        , min5 = parseFloat(tokens[1])+0.01
        , min15 = parseFloat(tokens[2])+0.01
        , m = min1*10 + min5*2 + min15;
        return m;
    },

    // *** randNumber function

    randNumber : function(upper, extra) {
        var num = Math.abs(Math.round(Math.random() * upper));
        return num + (extra || 0);
},
    
    // *** randTime function

    randTime : function(n) {
        return Math.abs(Math.round(Math.random() * n)) + 1;
    },

// *** showArguments function

    showArguments : function(a) {
        for (var k in a)
            console.log('\tPart', k, ':', a[k].toString());
    },
	
	
// *** limpiarArguments function

	limpiarArguments : function(a){
		var arguments1 = new Array(),
		cont = 0;
		for(var i=2;i<a.length;i++){
			arguments1[cont] = a[i].toString();
			cont++;
		}
		return arguments1;
	},
	
	
// *** contains function

	contains : function(a, obj) {
		for (var i = 0; i < a.length; i++) {
        	if (a[i] === obj) {
            	return true;
        	}
    	}
    	return false;
	}
}
