const gemsArray = ["/img/1.gif", "/img/2.gif", "/img/3.gif", "/img/4.gif"];
let myItems = [];

//when the button is clicked, play music
document.getElementById("startPlaying").addEventListener("click", function () {
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
    let divHolder = document.createElement("div");
    divHolder.classList.add("torch");
    divHolder.setAttribute("id", "torchid");
    this.canvas.setAttribute("onclick", "onclickTorch()");
    this.canvas.setAttribute("id", "canvas");
    this.context = this.canvas.getContext("2d");
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    document.body.appendChild(divHolder);
    document.body.childNodes[8].appendChild(this.canvas);
    this.interval = setInterval(updateGameArea, 20);
  /*
    // Paint the canvas black.
    context.fillStyle = "white";
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
  */
    //createRandomElements(gemsArray);
    
    document.addEventListener("keydown", function (event) {
      let ctx = canvas.getContext("2d");
      let W = window.innerWidth, H = window.innerHeight;
      var base_image = new Image();
      base_image.src = 'https://images.unsplash.com/photo-1499955618064-79cd8e8d8672?ixlib=rb-0.3.5&q=85&fm=jpg&crop=entropy&cs=srgb&s=13c8ccb1b33e610c3e8d6a4094dc85fd';
      base_image.onload = function(){
        ctx.drawImage(base_image, 100, 100);
      }
      var particles = [];
      var flame = {};
    
      //Lets create some particles now
      var particle_count = 100;
      for (var i = 0; i < particle_count; i++) {
        particles.push(new particle());
      }
    
      //finally some mouse tracking
      track_mouse(false)
    
      function track_mouse(e) {
        //since the canvas = full page the position of the mouse
        //relative to the document will suffice
        flame.x = player.x;
        flame.y = player.y;
      }
    
      function particle() {
        //speed, life, location, life, colors
        //speed.x range = -2.5 to 2.5
        //speed.y range = -15 to -5 to make it move upwards
        //lets change the Y speed to make it look like a flame
        this.speed = {
          x: -2.5 + Math.random() * 5,
          y: -15 + Math.random() * 10,
        };
        //location = mouse coordinates
        //Now the flame follows the mouse coordinates
        if (flame.x && flame.y) {
          this.location = { x: flame.x, y: flame.y };
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
        
    
    
        ctx.globalCompositeOperation = "source-out";
        //		var im = new Image();
        //		im.src = "./background.jpg";
        //		im.onload = function (){
        //		ctx.drawImage(im, W, H);
        //		}
    
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, W, H);
    
        //		var src    = "../images/background.jpg";
        //	    var img    = new Image();
        //	    img.src    = src;
        //	    $(img).load(function() {
        //			var pattern = ctx.createPattern(img, 'repeat');
        //			ctx.fillStyle = pattern;
        //			ctx.fillRect(0, 0, W, H);
        //		  });
    
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
          //			p.r = 128;
          //			p.g = 34;
          //			p.b = 34;
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
    
        ctx.drawImage(base_image, 100, 100);
      }
    
      setInterval(draw, 33);
    
    
    /*
    this.canvas.addEventListener("mousemove", function (event) {
      x = event.clientX;
      y = event.clientY;
      //circle size
    radius = 250;
    let context = document.getElementsByTagName("canvas")[0].getContext("2d");
    // first reset the gCO
    context.globalCompositeOperation = "source-over";
    // Paint the canvas black.
    context.fillStyle = "#000";
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    
    context.beginPath();
    radialGradient = context.createRadialGradient(x, y, 1, x, y, radius);
    radialGradient.addColorStop(0, "rgba(255,255,255,1)");
    radialGradient.addColorStop(1, "rgba(0,0,0,0)");
    
    context.globalCompositeOperation = "destination-out";
    
    context.fillStyle = radialGradient;
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    context.fill();
    context.closePath();
    });
    */
    });
    
  },
  music: function () {
    var audio = new Audio("theme_song.mp3");
    audio.play();
  },
  score: function () {
    const points = Math.floor(this.frames / 5);
    //this.context.font = "18px serif";
    //this.context.fillStyle = "black";
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
    img.addEventListener("load", () => {
      // Once image loaded => draw
      this.img = img;
      img.src = "/img/anubi.png";
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
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    //ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
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
  //clear game area, the canvas
  myGameArea.clear();
  //give new position to the player
  //update x and y with the speed
  player.newPos();
  //update component
  player.update();
  //update obstacle
  
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

//TODO: this can be reused also for generating enemies
//do some refactoring for it later
//arrayEnemies
function createRandomElements(gems) {
  //depending on the level define number of gems
  //TODO: change this as hardcoded now -total gems number depending on theme

  let gemsNumber = 2;
  let torchNumber = 3;

  //get random images from image list/array
  let randomGems = gems.map((image) => {
    return gems[Math.floor(Math.random() * gems.length)];
  });

  //get first n number of gems depending on total dictated by level
  let randomGemsSliced = randomGems.slice(0, gemsNumber);

  //get random x and y withing canvas width and height
  let randomX = Math.floor(Math.random() * (window.width - 0 + 1)) + 0;
  let randomY = Math.floor(Math.random() * (window.height - 0 + 1)) + 0;

  //generate a new instance of component with newly created random values
  //generate gems and defenders

  let generateGems = randomGemsSliced.map((item) => {
    myItems.push(
      //new Component(20, 20, randomGemsSliced[item], randomX, randomY)
    );
  });

}


function onclickTorch(){
  document.getElementById("torchid").setAttribute("class", "torch canvas after-click");
}


//create player from component class
const player = new Component(20, 20, "red", 180, 380);



