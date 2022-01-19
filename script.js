const gemsArray = ["/img/1.png", "/img/2.gif", "/img/3.gif", "/img/4.gif","/img/1.png", "/img/2.gif", "/img/3.gif", "/img/4.gif"];
const gemsValues = [5, 25, 50, 100, 150, 200, 250, 300];
let bestScores = [];

let totalScore = 0;

let myItems = [];
let valueOfGem;

let framesNumber;

//levels and timing
let timeleft;
let gemsNumber;
let lvl = 1;
let wonGame = false;

let player;




//when the button is clicked, play music
document.getElementById("startPlaying").addEventListener("click", function () {
  var context = new AudioContext();
  //myGameArea.music();
  document.getElementById("bg").remove();
  //start game area and create canvas when button is clicked
  myGameArea.start();
});

const myGameArea = {
  canvas: document.createElement("canvas"),
  //track how many times the canvas is updated
  frames: 0,
  time: timeleft,
  level: lvl,
  start: function () {
    this.canvas.setAttribute("id", "canvas");
    let divElement = document.createElement("div");
    divElement.setAttribute(
      "class",
      " d-flex flex-column align-items-center justify-content-center"
    );
    this.context = this.canvas.getContext("2d");
    this.canvas.width = 900;
    this.canvas.height = 700;
    myGameArea.points = 0;
    myGameArea.level = lvl;
    

    if (lvl === 1) {
      timeleft = 15;
      gemsNumber = 6;
    } else if (lvl === 2) {
      timeleft = 15;
      gemsNumber = 9;
    } else if (lvl === 3) {
      timeleft = 15;
      gemsNumber = 13;
    } else if (lvl === 4) {
      timeleft = 15;
      gemsNumber = 16;
    }
    
    document.body.appendChild(divElement);
    divElement.appendChild(this.canvas);
    document.body.setAttribute(
      "class",
      "background"
    );

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    //add gems and torches
    console.log("start" + player.x, player.y);
    //createRandomElements(gemsArray);
    this.interval = setInterval(updateGameArea, 10);
    //TODO: change the timeout dynamically based on level
    let downloadTimer = setInterval(function(){
      if(timeleft <= 0){
        clearInterval(downloadTimer);
      }
      myGameArea.time = timeleft;
      timeleft -= 1;
      
    }, 1000);

  },
  music: function () {
    var audio = new Audio("theme_song.mp3");
    audio.play();
  },
  score: function () {
    this.context.font = "20px serif";
    this.context.fillStyle = "black";
    this.context.fillText(`Level: ${myGameArea.level}`, 190, 50);
    this.context.fillText(`Score: ${myGameArea.points}`, 350, 50);
    this.context.fillText(`Time left: ${myGameArea.time} seconds`, 500, 50);
  },
  clear: function () {
    //get context and clear canvas
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  stop: function () {
    clearInterval(this.interval);
  },
};

//create components, for our player element, and for the obstacles
class Component {
  constructor(width, height, file, color, x, y, value) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.file = file;
    this.color = color;
    this.speedX = 0;
    this.speedY = 0;
    this.value = value;

    // Load the image
    const img = new Image();
    img.addEventListener('load', () => {
      // Once image loaded => draw
      this.img = img;
      //this.draw();
    });
    
    img.src = file;

    
  }

  newPos() {
    //give player a new position based on the speed
    this.x += this.speedX;
    this.y += this.speedY;
  }

  crashWith(myItems) {
    var myleft = this.x;
    var myright = this.x + this.width;
    var mytop = this.y;
    var mybottom = this.y + this.height;

    for (let i = 0; i < myItems.length; i++) {
      var otherleft = myItems[i].x;
      var otherright = myItems[i].x + myItems[i].width;
      var othertop = myItems[i].y;
      var otherbottom = myItems[i].y + myItems[i].height;
      var crash = true;

      //context.clearRect(20, 20, element.x, element.y);

      if (
        mybottom < othertop ||
        mytop > otherbottom ||
        myright < otherleft ||
        myleft > otherright
      ) {
        crash = false;
      }
      if (crash) {
        //update score on each crash

        myGameArea.points += myItems[i].value[0];
        //remove item from array and canvas
        myItems.splice(i, 1);
        //add time for each grabbed gem
        if(myGameArea.level === 3) {
          timeleft += 1; 
        }
        if(myItems.length === 0) {
          wonGame = true;
        }
      }
    }
    return crash;
  }

  update() {
    //take x,y, width and heigh and create whatever is in x and y
    const ctx = myGameArea.context;
    ctx.fillStyle = this.color;
    ctx.drawImage(this.img,this.x, this.y, this.width, this.height);
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

//this gets called every 20 milliseconds
function updateGameArea() {
  if (player.crashWith(myItems)) {
    //myGameArea.points = valueOfGem[0];
    myGameArea.clear();
  }
  //clear game area
  myGameArea.clear();
  //give new position to the player
  //update x and y with the speed
  player.newPos();

  player.update();

  this.createRandomElements(gemsArray);
  //update frames
  myGameArea.frames += 1;

  console.log(wonGame);
  //check if gameover
  gameOver();
  // update and draw the score
  myGameArea.score();
}

//update speed when arrows are clicked
document.addEventListener("keydown", (e) => {
  switch (e.keyCode) {
    case 38: // up arrow
      player.speedY -= 10;
      break;
    case 40: // down arrow
      player.speedY += 10;
      break;
    case 37: // left arrow
      player.speedX -= 10;
      break;
    case 39: // right arrow
      player.speedX += 10;
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

//TODO: this can be reused also for generating enemies
//do some refactoring for it later
//arrayEnemies
function createRandomElements(gems, levelup) {
  for (i = 0; i < myItems.length; i++) {
    myItems[i].update();
  }
  if (myGameArea.frames === 0 || levelup === true) {
    //This condition will determine every how many update we create new obstacles.
    //We set every 120 updates, that means 2.4 seconds,
    //because we call the updateGameArea() function every 20 milliseconds.

    //get random images from image list/array
    let randomGems = gems.map((image) => {
      return gems[Math.floor(Math.random() * gems.length)];
    });

    let randomValue = gemsValues.map((value) => {
      return gemsValues[Math.floor(Math.random() * gemsValues.length)];
    });
    let randomGemValue = randomValue.slice(0, 1);
    //get first n number of gems depending on total dictated by level
    let randomGemsSliced = randomGems.slice(0, gemsNumber);

    //generate a new instance of component with newly created random values
    let generateGems = randomGemsSliced.map((item) => {
      //get random x and y withing canvas width and height
      let randomX = Math.floor(Math.random() * (canvas.width - 0 + 1)) + 0;
      let randomY = Math.floor(Math.random() * (canvas.height - 0 + 1)) + 0;
      //myItems.push(new Component(20, 20, randomGemsSliced[item], randomX, randomY));
      return myItems.push(
        new Component(20, 20, item, "yellow",randomX, randomY, randomGemValue)
      );
    });
  }
}

function gameOver() {
  //check if win 
  if (wonGame) {
    myGameArea.stop();
    clearInterval(this.interval);
    alert("WIN!" + `    Score: ${myGameArea.points}`);
    totalScore = totalScore += myGameArea.points;
    bestScores.push(totalScore);
    wonGame = false;
    levelUp();
  } else if (timeleft === 0) {
    //you loose
    myGameArea.stop();
    totalScore = totalScore += myGameArea.points;
    bestScores.push(totalScore);
    alert("Game Over! Time is up" + `  Score: ${myGameArea.points}`);
  }
  
}

function levelUp() {
  //go to next level
  lvl = lvl + 1;
  myGameArea.clear();
  myGameArea.start();
  player = new Component(60, 60, '/img/anubi.png', "red", 200, 200);
  //create instance of gems
  createRandomElements(gemsArray, true);
}

//create player from component class
player = new Component(60, 60, '/img/anubi.png', "red", 200, 200);

/* TEMPORARLY COMMENT OUT FLAME
TODO: remove comments
document.addEventListener("keydown", function (event) {
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");

  //Make the canvas occupy the full page
  var W = window.innerWidth,
    H = window.innerHeight;
  canvas.width = W;
  canvas.height = H;

  var particles = [];
  var mouse = {};

  //Lets create some particles now
  var particle_count = 100;
  for (var i = 0; i < particle_count; i++) {
    particles.push(new particle());
  }

  //finally some mouse tracking
  canvas.addEventListener("keydown", trackPlayer);

  function trackPlayer(e) {
    //since the canvas = full page the position of the mouse
    //relative to the document will suffice
    mouse.x = player.x;
    mouse.y = player.y;
  }

  function particle() {
    //speed, life, location, life, colors
    //speed.x range = -2.5 to 2.5
    //speed.y range = -15 to -5 to make it move upwards
    //lets change the Y speed to make it look like a flame
    //this speed is for styling the flame
    this.speed = { x: -2.5 + Math.random() * 5, y: -15 + Math.random() * 10 };
    //location = mouse coordinates
    //Now the flame follows the player coordinates
    if (player.x && player.y) {
      this.location = { x: player.x, y: player.y };
    } else {
      this.location = { x: W / 2, y: H / 2 };
    }
    //radius range = 10-30
    this.radius = 10 + Math.random() * 20;
    //life range = 20-30
    this.life = 20 + Math.random() * 10;
    this.remaining_life = this.life;
    //colors
    this.r = 74;
    this.g = 77;
    this.b = 84;
  }

  function draw() {
    //Painting the canvas black
    //Time for lighting magic
    //particles are painted with "lighter"
    //In the next frame the background is painted normally without blending to the
    //previous framevar im = new Image();

    ctx.globalCompositeOperation = "source-over";

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = "lighter";

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      ctx.beginPath();
      //changing opacity according to the life.
      //opacity goes to 0 at the end of life of a particle
      p.opacity = Math.round((p.remaining_life / p.life) * 100) / 100;
      //a gradient instead of white fill
      var gradient = ctx.createRadialGradient(
        p.location.x,
        p.location.y,
        0,
        p.location.x,
        p.location.y,
        p.radius
      );

      p.r = 255;
      p.g = 69;
      p.b = 0;
      gradient.addColorStop(
        0,
        "rgba(" + p.r + ", " + p.g + ", " + p.b + ", " + p.opacity + ")"
      );
      gradient.addColorStop(
        0.2,
        "rgba(" + p.r + ", " + p.g + ", " + p.b + ", " + p.opacity + ")"
      );
      gradient.addColorStop(
        1,
        "rgba(" + p.r + ", " + p.g + ", " + p.b + ", 0)"
      );
      ctx.fillStyle = gradient;
      ctx.arc(p.location.x, p.location.y, p.radius, Math.PI * 2, false);
      ctx.fill();

      //lets move the particles
      p.remaining_life--;
      p.radius--;
      p.location.x += p.speed.x;
      p.location.y += p.speed.y;

      //regenerate particles
      if (p.remaining_life < 0 || p.radius < 0) {
        //a brand new particle replacing the dead one
        particles[i] = new particle();
      }
    }

  }

  setInterval(draw, 33);



  $(function () {
    $(".torch").click(function () {
      $(".torch").addClass(".torch .after-click");
    });
  });
  
});

*/
