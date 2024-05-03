function Generation() {
  this.generationNum = 1; // Initialize generation number
  this.birds = []; // Array to store bird instances

  // Create birds with mutated neural networks
  for (var i = 0; i < Data.generation.BIRD_NUM; i++) {
    this.birds[i] = new Bird(); // Create a new bird instance
    this.birds[i].network.mutate(); // Mutate the bird's neural network to introduce variation
  }
}


// * Mutation
Generation.prototype = {
  nextGeneration: function () {
    // Sort birds based on fitness (distance flown)
    this.birds.sort(function (a, b) {
      return b.fitness - a.fitness; // Sort in descending order based on fitness
    });

    // Determine the number of survivors based on dashboard settings
    Data.generation.SURVIVOR_NUM = dashboard.getSurvivorNum();

    // Remove birds beyond the survivor number
    for (
      var i = Data.generation.SURVIVOR_NUM;
      i < Data.generation.BIRD_NUM;
      i++
    ) {
      this.birds[i] = null; // Remove the bird instance
      delete this.birds[i]; // Delete the reference
    }

    // Update total bird number based on dashboard settings
    Data.generation.BIRD_NUM = dashboard.getBirdNum();

    // Update mutation chance based on dashboard settings
    Data.generation.MUTATE_CHANCE = dashboard.getMutateChance(); //* R

    // Remove excess birds beyond the updated bird number
    for (
      var i = Data.generation.SURVIVOR_NUM - 1;
      i >= Data.generation.BIRD_NUM;
      i--
    ) {
      this.birds[i] = null; // Remove the bird instance
      delete this.birds[i]; // Delete the reference
    }

    // Ensure survivor number does not exceed the total bird number
    Data.generation.SURVIVOR_NUM = Math.min(
      Data.generation.SURVIVOR_NUM,
      Data.generation.BIRD_NUM
    );

    // Generate new birds through breeding
    for (
      var i = Data.generation.SURVIVOR_NUM;
      i < Data.generation.BIRD_NUM;
      i++
    ) {
      // Create a new bird by breeding two random parent birds
      this.birds[i] = this._breed(
        Math.floor(Math.random() * Data.generation.SURVIVOR_NUM),
        Math.floor(Math.random() * Data.generation.SURVIVOR_NUM)
      );
    }

    // Initialize properties of surviving birds
    for (var i = 0; i < Data.generation.SURVIVOR_NUM; i++) {
      this.birds[i].init(); // Reinitialize each surviving bird for the new generation
    }

    this.generationNum++; // Increment the generation number
  },

  // *crossover
  _breed: function (birdA, birdB) {
    var baby = new Bird(); // Create a new bird (baby)
    baby.network.setActivation(
      Activation.get(dashboard.getActivationFunction())
    ); // Set activation function for baby's neural network

    // Ensure birdA is the fitter parent (higher fitness value)
    if (this.birds[birdA].fitness < this.birds[birdB].fitness) {
      var t = birdA;
      birdA = birdB;
      birdB = t;
    }

    // Inherit neural network structure from parent birdA
    baby.network.nodeSize = this.birds[birdA].network.nodeSize;
    for (var i = 1; i <= baby.network.nodeSize; i++) {
      baby.network.edges[i] = [];
      for (var j in this.birds[birdA].network.edges[i]) {
        if (
          this.birds[birdB].network.edges.hasOwnProperty(i) &&
          this.birds[birdB].network.edges[i].hasOwnProperty(j)
        ) {
          // Randomly select edges from parent birds based on fitness
          baby.network.edges[i][j] =
            Math.random() < 0.5
              ? this.birds[birdA].network.edges[i][j]
              : this.birds[birdB].network.edges[i][j];
        } else {
          baby.network.edges[i][j] = this.birds[birdA].network.edges[i][j];
        }
      }
    }

    // Mutate the baby's neural network based on mutation chance
    if (Math.random() <= Data.generation.MUTATE_CHANCE) {
      baby.network.mutate();
    }

    return baby; // Return the newly created bird (baby)
  },
};
