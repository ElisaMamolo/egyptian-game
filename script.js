/*Define global variables */
/*Gems and player*/
const gemsArray = ["gem1.png", "gem2.png", "gem3.png", "gem5.png", "gem1.png", "gem2.png", "gem3.png", "gem5.png"];
const gemsValues = [5, 25, 50, 100, 150, 200, 250, 300];
const playerImg = ["anubi.png", "ra.png", "phar.png", "cleo.png", "sfinge.png", "cat.png", "cleo2.png"];
let lastScores = [];
let myItems = [];
let valueOfGem;
let player;
let currentPlayer = playerImg[0];

/*score*/
let totalScore = 0;

/*levels and timing*/
let timeleft;
let gemsNumber;
let lvl = 1;
let wonGame = false;
let playerName ="player";
let framesNumber;

/*audio */
var audio = new Audio("theme_song.mp3");
audio.loop = true;
var coinAudio = new Audio("1up.wav");

/* make div instructions flow in with timer when page loads*/
$(document).ready(function() {
  setTimeout(() => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const instruction = document.getElementById("instruction");
    const divWidth = instruction.offsetWidth;
    const centerIt = (windowWidth - divWidth) / 2;

    // set css centreIt variable
    instruction.className += " shiftIn";
    instruction.style.setProperty("--centerIt", divWidth + centerIt + "px");
  }, 500);
});


//when the startPlaying button is clicked, play music
document.getElementById("startPlaying").addEventListener("click", function () {
  myGameArea.music();
  playerName = document.getElementById("inputName").value;
  document.getElementById("instruction").style.setProperty("display", "none");
  //start game area and create canvas when button is clicked
  myGameArea.start();
});

/*define gamearea */
const myGameArea = {
  canvas: document.createElement("canvas"),
  //track how many times the canvas is updated
  frames: 0,
  time: timeleft,
  level: lvl,
  start: function () {
    var context = new AudioContext();
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
    myGameArea.music();
    

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
    
    this.interval = setInterval(updateGameArea, 10);
    //countdown for each level
    let downloadTimer = setInterval(function(){
      if(timeleft <= 0){
        clearInterval(downloadTimer);
      }
      myGameArea.time = timeleft;
      timeleft -= 1;
      
    }, 1000);

  },
  music: function (param) {
    //if param -> if game stops, stop music
    if(param) {
      audio.muted = true;
    } else {
      audio.muted = false;
      audio.play();
    }
    
  },
  score: function () {
    if (myGameArea.time === undefined ) {
      myGameArea.time = "0";
    }
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
        //play sound
        coinAudio.play();
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
  player.newPos();
  //update x and y with the speed
  player.update();
  this.createRandomElements(gemsArray);
  //update frames
  myGameArea.frames += 1;
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

function createRandomElements(gems, levelup) {
 
  if (myItems.length > 0) {
    for (i = 0; i < myItems.length; i++) {
      if (myItems[i].img != undefined) {
        myItems[i].update();
      }
    }
  }
  //generate gems at the beginning of game when frames are 0 or if levelup
  if (myGameArea.frames === 0 || levelup === true) {
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
      return myItems.push(
        new Component(40, 40, item, "yellow",randomX, randomY, randomGemValue)
      );
    });
  }
}

function gameOver() {
  //check if win 
  if (wonGame) {
    myGameArea.stop();
    clearInterval(this.interval);
    totalScore = totalScore + myGameArea.points;
    wonGame = false;
    levelUp();
  } else if (timeleft === 0) {
    //you loose
    myGameArea.stop();
    myGameArea.music(true);
    totalScore = totalScore += myGameArea.points;
    lastScores.push(totalScore);
    //reset total score
    totalScore = 0;
    let instructions = document.getElementById("instruction");
    instructions.style.removeProperty("display");
    instructions.innerHTML = "Game Over! Time is up <br>" 
    + `Total Score:${lastScores[lastScores.length - 1]}<br>`;
    let buttonElement = document.createElement("button");
    buttonElement.setAttribute(
      "class",
      "mb-3 mt-5 btn btn-dark"
    );
    buttonElement.innerHTML = "Restart the game";
    instructions.appendChild(buttonElement);
    let btnElementNewPlayer = document.createElement("button");
    btnElementNewPlayer.innerHTML = "New Player";
    btnElementNewPlayer.setAttribute(
      "class",
      "mb-3 mt-5 btn btn-light"
    );
    instructions.appendChild(btnElementNewPlayer);
    showLastScores();
    buttonElement.addEventListener("click", function () {
      var context = new AudioContext();
      myGameArea.music();
      myGameArea.points = 0;
      lvl = 1;
      document.getElementById("instruction").style.setProperty("display", "none");
      
      //start game area and create canvas when button is clicked
      myGameArea.start();
    });
    btnElementNewPlayer.addEventListener("click", function () {
      
      document.getElementById("instruction").innerHTML = "";
      let buttonElement = document.createElement("button");
      buttonElement.setAttribute(
      "class",
      "mb-3 mt-5 btn btn-dark"
      );
      buttonElement.setAttribute('id', 'startPlaying');
      let inputElement = document.createElement("input");
      inputElement.setAttribute(
        "class",
        "mt-4 input"
        );
      inputElement.setAttribute('id', 'inputName');
      inputElement.value = "Insert player name";
      document.getElementById("instruction").appendChild(inputElement);
      buttonElement.innerHTML = "Restart the game";
      instructions.appendChild(buttonElement);
      buttonElement.addEventListener("click", function () {
        playerName = document.getElementById("inputName").value;
        var context = new AudioContext();
       
        myGameArea.points = 0;
        lvl = 1;
        document.getElementById("instruction").style.setProperty("display", "none");
        
        //start game area and create canvas when button is clicked
        myGameArea.start();
        myGameArea.music();
      });
    });
  }
  
}

function showLastScores() {
  let instructions = document.getElementById("instruction");
  let scoreTitle = document.createElement("h4");
  scoreTitle.innerHTML = "Last Scores";
  instructions.appendChild(scoreTitle);
  //show last 5 scores
  for (let i = 0; i < 5; i++) {
    if (lastScores[i] != undefined) {
      let scoreText = document.createElement("p");
      scoreText.innerHTML = playerName + " : " + lastScores[i];
      instructions.appendChild(scoreText);
    }
  }
}

function levelUp() {
  //go to next level
  lvl = lvl + 1;
  myGameArea.clear();
  myGameArea.start();
  currentPlayer = playerImg[lvl - 1];
  player = new Component(60, 70, currentPlayer, "red", 200, 200);
  //create instance of gems
  createRandomElements(gemsArray, true);
}

//create player from component class
player = new Component(60, 70, currentPlayer, "red", 200, 200);