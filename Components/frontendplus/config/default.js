module.exports = {
    requires: {
      balancerurl: "tcp://localhost:8001",
         brokerurl: "tcp://localhost:8002"
    },
    parameter: {
      maxload: 4
    }
};
