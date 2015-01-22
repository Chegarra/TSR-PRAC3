module.exports = {
	servicePath: require.resolve("../../Services/webLabelService"),
	counts: {
		balancer: 1,
		frontendplus: 2,
		lab2broker: 1,
		labelbuilder: 4 
	},
	config: {
		balancer: {
			external: {
				web: 80
			}
		},
		frontendplus: {
			parameter: {
				maxload: 1
			}
		}
	}
};
