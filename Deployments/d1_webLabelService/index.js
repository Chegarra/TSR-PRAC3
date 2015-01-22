module.exports = {
	servicePath: require.resolve("../../Services/webLabelService"),
	counts: {
		balancer: 1,
		frontendplus: 1,
		lab2broker: 1,
		labelbuilder: 1 
	},
	config: {
		balancer: {
			external: {
				web: 80
			}
		},
		frontendplus: {
			parameter: {
				maxload: 4
			}
		},
		lab2broker: {
			parameter: {
				verbose: true
			}
		}
	}
};
