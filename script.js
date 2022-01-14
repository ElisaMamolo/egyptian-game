const myObstacles = []; //store all created obstacles

const myGameArea = {
  canvas: document.getElementById("canvas"),
  //track how many times the canvas is updated
  frames: 0,
  start: function () {
    this.canvas.width = 200;
    this.canvas.height = 200;
    this.context = this.canvas.getContext("2d");
    //insert canvas inside of the bdy as its first child
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    document
      .getElementById("startPlaying")
      .addEventListener("click", function () {
        var context = new AudioContext();
        //myGameArea.music();
        document.getElementById("startPlaying").remove();
      });
    //call update game area every 20 seconds
    //this.interval = setInterval(updateGameArea, 20);
  },
  music: function () {
    var audio = new Audio('theme_song.mp3');
    audio.play();
  },
  score: function () {
    const points = Math.floor(this.frames / 5);
    this.context.font = "18px serif";
    this.context.fillStyle = "black";
    this.context.fillText(`Score: ${points}`, 350, 50);
  },
  clear: function () {
    //get context and clear canvas
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  stop: function () {
    clearInterval(this.interval);
  },
  
};
//this gets called every 20 milliseconds
function updateGameArea() {  
}

myGameArea.start();



