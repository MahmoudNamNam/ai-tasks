function Bird() {
  this.network = new Network(); // Initialize a neural network for the bird
  this.seeTwoPipe = dashboard.seeTwoPipe; // Determine whether the bird can foresee two upcoming pipes
  this.init(); // Initialize bird's properties
}

Bird.prototype = {
  init: function () {
    this.fitness = 0; // The distance the bird has flown
    this.score = 0; // The number of pipes the bird has passed
    this.x = Data.game.BIRD_INIT_X; // Initial x-position of the bird
    this.y = Data.game.BIRD_INIT_Y; // Initial y-position of the bird
    this.speed = 0; // Current vertical speed of the bird
    this.alive = true; // Boolean indicating whether the bird is alive
  },

  fly: function (pipeDis, pipeUpper, pipe2Upper) {
    if (this.alive) {
      this.fitness++; // Increase fitness (distance flown)
      // Determine whether to fly based on neural network output
      if (
        this.network.getOutput(
          pipeDis / Data.animation.SCREEN_WIDTH,
          (this.y - pipeUpper) / Data.animation.SCREEN_HEIGHT,
          this.seeTwoPipe
            ? (this.y - pipe2Upper) / Data.animation.SCREEN_HEIGHT
            : 0
        )
      ) {
        this.speed = -Data.game.FLY_SPEED; // Set upward speed if network outputs a fly signal
      }
    }
    this.speed += Data.game.GRAVITY; // Apply gravity to the bird's speed
    this.y += this.speed; // Update the bird's vertical position based on speed
  },
};
