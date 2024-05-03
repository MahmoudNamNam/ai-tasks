function Network() {
  this.nodeSize = Data.network.INPUT_SIZE; // Number of nodes in the network
  this.nodes = []; // Array to hold node values
  this.edges = []; // Object to store edges (connections) between nodes
}

Network.prototype = {
  // Method for mutating the network
  mutate: function () {
    var sn = Math.ceil(Math.random() * this.nodeSize); // Select a random source node
    var fn =
      Math.ceil(Math.random() * (this.nodeSize + 1 - Data.network.INPUT_SIZE)) +
      Data.network.INPUT_SIZE; // Select a random destination node
    if (fn > this.nodeSize) {
      fn = Data.network.NODE_OUTPUT;
    }
    if (sn > fn && fn != Data.network.NODE_OUTPUT) {
      var t = sn;
      sn = fn;
      fn = t;
    }

    // Check whether the selected nodes are linked or not
    if (this.edges.hasOwnProperty(sn) && this.edges[sn].hasOwnProperty(fn)) {
      if (Math.random() < Data.network.ADD_NODE_CHANCE) {
        this._addNode(sn, fn); // Add a new node in the middle of an existing edge
      } else {
        this._changeEdgeWeight(sn, fn); // Mutate the weight of the existing edge
      }
    } else {
      this._addEdge(sn, fn); // Add a new edge between the selected nodes
    }
  },

  // Method to get the network's output based on input values
  getOutput: function (pipeDis, pipeUpper, pipe2Upper) {
    // Initialize node values
    this.nodes[Data.network.NODE_BIAS] = 1; // Bias node
    this.nodes[Data.network.NODE_PIPE_DIS] = pipeDis; // Pipe distance node
    this.nodes[Data.network.NODE_PIPE_UPPER] = pipeUpper; // Pipe upper node
    this.nodes[Data.network.NODE_PIPE2_UPPER] = pipe2Upper; // Second pipe upper node
    this.nodes[Data.network.NODE_OUTPUT] = 0; // Output node
    for (var i = Data.network.INPUT_SIZE + 1; i <= this.nodeSize; i++) {
      this.nodes[i] = 0; // Initialize other nodes to zero
    }

    // Forward propagation through the network
    for (var i = 1; i <= this.nodeSize; i++) {
      if (i > Data.network.INPUT_SIZE) {
        this.nodes[i] = this._activation(this.nodes[i]); // Apply activation function to non-input nodes
      }
      for (var j in this.edges[i]) {
        this.nodes[j] += this.nodes[i] * this.edges[i][j]; // Propagate values through edges
      }
    }

    return this.nodes[Data.network.NODE_OUTPUT] > 0; // Return output based on activation of output node
  },

  // Method to set the activation function of the network
  setActivation: function (f) {
    this._activation = f; // Assign the specified activation function
  },

  // Default activation function (Hyperbolic tangent)
  _activation: function (x) {
    return 2 / (1 + Math.exp(-4.9 * x)) - 1;
  },

  // Method to change the weight of an existing edge
  _changeEdgeWeight: function (sn, fn) {
    this.edges[sn][fn] +=
      Math.random() * Data.network.STEP_SIZE * 2 - Data.network.STEP_SIZE; // Adjust the weight randomly
  },

  // Method to add a new edge between nodes
  _addEdge: function (sn, fn) {
    this.edges[sn] = this.edges[sn] || []; // Initialize edges for source node if not already present
    this.edges[sn][fn] = Math.random() * 2 - 1; // Assign a random weight to the new edge
  },

  // Method to insert a new node in the middle of an existing edge
  _addNode: function (sn, fn) {
    this.edges[sn][++this.nodeSize] = 1; // Create a new node and connect it to the source node
    this.edges[this.nodeSize] = this.edges[this.nodeSize] || []; // Initialize edges for the new node if not already present
    this.edges[this.nodeSize][fn] = this.edges[sn][fn]; // Connect the new node to the destination node
    this.edges[sn][fn] = 0; // Remove the connection between the original nodes
  },
};

var Activation = {
  get: function (name) {
    switch (name) {
      case Data.activation.SIGMOID:
        return function (x) {
          return 1 / (1 + Math.exp(-x));
        };
      case Data.activation.ARCTAN:
        return function (x) {
          return 1 / (Math.pow(x, 2) + 1);
        };
      case Data.activation.CUSTOM_TANGENT:
        return function (x) {
          return 2 / (1 + Math.exp(-4.9 * x)) - 1;
        };
      case Data.activation.HYPERBOLIC_TANGENT:
        return function (x) {
          return 1 / (1 + Math.exp(-2 * x));
        };
      case Data.activation.RELU:
        return function (x) {
          return Math.max(0, x);
        };
      default:
        return function (x) {
          return x;
        };
    }
  },
};
