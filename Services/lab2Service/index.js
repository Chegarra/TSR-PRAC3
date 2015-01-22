module.exports = {
	components: {
		lab2broker: {
			location: require.resolve("../../Components/lab2broker"),
			image: "tsir/lab2broker"
		},
	    lab2worker: {
	    	location: require.resolve("../../Components/lab2worker"),
	    	image: "tsir/lab2worker"
	    },
		lab2client: {
	    	location: require.resolve("../../Components/lab2client"),
	    	image: "tsir/lab2client"
	    }
	},
	links: {
		lab2client: {
			frontendurl: ["lab2broker", "PUERTO_FRONTEND"]
		},
        	lab2worker: {
			url: ["lab2broker", "PUERTO_BROKER"]
		}
	}
};
