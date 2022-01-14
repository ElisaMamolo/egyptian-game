const myGems = []; //store all created objects
const imageArray = ["1.gif", "2.gif", "3.gif", "4.gif"];
//when the button is clicked, play music
document.getElementById("startPlaying")
.addEventListener("click", function () {
  var context = new AudioContext();
  //myGameArea.music();
  document.getElementById("startPlaying").remove();
  //start game area and create canvas when button is clicked
  
  myGameArea.start();
});

const myGameArea = {
  canvas: document.createElement("canvas"),
  //track how many times the canvas is updated
  frames: 0,
  start: function () {
    this.canvas.width = 600;
    this.canvas.height = 600;
    this.canvas.setAttribute('style', 'background-color:black')
    this.context = this.canvas.getContext("2d");
    //insert canvas inside of the bdy as its first child
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    //call update game area every 20 seconds
    this.interval = setInterval(updateGameArea, 20);
    createRandomGems(imageArray);
  },
  music: function () {
    var audio = new Audio('theme_song.mp3');
    audio.play();
  },
  score: function () {
    const points = Math.floor(this.frames / 5);
    this.context.font = "18px serif";
    this.context.fillStyle = "white";
    this.context.fillText(`Score: ${points}`, 350, 50);
  },
  clear: function () {
    //get context and clear canvas
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  stop: function () {
    clearInterval(this.interval);
  }
};

//create components, for our player element, and for the obstacles
class Component {
  constructor(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.color = color;
    this.x = x;
    this.y = y;

    this.speedX = 0;
    this.speedY = 0;

    // Load the image
    let img = new Image();
    img.addEventListener('load', () => {
      // Once image loaded => draw
      this.img = img;
      img.src = '/anubi.png';
      this.draw();
    });
    
  }

  newPos() {
    //give player a new position based on the speed
    this.x += this.speedX;
    this.y += this.speedY;
  }

  update() {
    //take x,y, width and heigh and create whatever is in x and y
    const ctx = myGameArea.context;
    //ctx.fillStyle = this.color;
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  left() {
    return this.x;
  }
  right() {
    return this.x + this.width;
  }
  top() {
    return this.y;
  }
  bottom() {
    return this.y + this.height;
  }
}

//create player from component class
const player = new Component(50, 100, "red", 150, 300);

//this gets called every 20 milliseconds
function updateGameArea() {
  //clear game area, the canvas
  myGameArea.clear();
  //give new position to the player
  //update x and y with the speed
  player.newPos();
  //update component
  player.update();
  //update obstacle
  this.updateObstacles();
  //check if game over
  
  // update and draw the score
  myGameArea.score();
}

//update speed when arrows are clicked
document.addEventListener("keydown", (e) => {
  switch (e.keyCode) {
    case 38: // up arrow
      player.speedY -= 3;
      break;
    case 40: // down arrow
      player.speedY += 3;
      break;
    case 37: // left arrow
      player.speedX -= 3;
      break;
    case 39: // right arrow
      player.speedX += 3;
      break;
  }
});

//We will also need a keyup function so we stop adding speed to our player,
//otherwise, this won´t stop until another key is pressed. Let´s add it as well.
document.addEventListener("keyup", (e) => {
  //when nothing is moved speed is 0
  player.speedX = 0;
  player.speedY = 0;
});

function createRandomGems (imageArray) {
  //depending on the level define number of gems
  //TODO: change this as hardcoded now -totalgems number depending on theme
  let gemsNumber = 2;
  //get random images from image list/array
  let randomGems = imageArray.map(image => {
    return imageArray[Math.floor(Math.random() * imageArray.length)]
  });
  //get random x and y withing canvas width and height
  debugger;
  
  let randomX =  Math.floor(Math.random() * (max - min + 1)) + min;
  let randomY =  Math.floor(Math.random() * (max - min + 1)) + min;
  let randomStart;
  //set random starting pont
  //handle movement towards target
}
