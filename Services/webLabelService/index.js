module.exports = {
	components: {
		lab2broker: {
			location: require.resolve("../../Components/lab2broker"),
			image: "tsir/lab2broker"
		},
	    labelbuilder: {
	    	location: require.resolve("../../Components/labelbuilder"),
	    	image: "tsir/labelbuilder"
	    },
		balancer: {
	    	location: require.resolve("../../Components/balancer"),
	    	image: "tsir/balancer"
	    },
		frontendplus: {
	    	location: require.resolve("../../Components/frontendplus"),
	    	image: "tsir/frontendplus"
		}

	},
	links: {
		frontendplus: {
			brokerurl: ["lab2broker", "PUERTO_FRONTEND"],
			balancerurl: ["balancer", "routerport"]
		},
        labelbuider: {
			url: ["lab2broker", "PUERTO_BROKER"]
		}
	}
};
