
//DOM elements
let canvas = document.querySelector("#canvas");
let currentScore = document.querySelector(".currentScore span");
let allTimeHighscore = document.querySelector(".highscore span");
let btnSlower = document.querySelector(".btn-slower");
let btnFaster = document.querySelector(".btn-faster");

//create 2D Canvas
let ctx = canvas.getContext("2d");

//Food which the snake should catch
let food;

//Color
let colorMatchField = "black";
let colorSnake = "white";
let colorFood = "yellow";

//Current Highscore and all time highscore
let currentHighscore = 1;
let highscore = 0;

//Initial Speed of snake and optional amount to increase or decrease speed
let speed = 200;
let speedChange = 50;

//Amount of rows and Cols on matchfield
const rows = 20;
const cols = 20;

//Cell size which depends on size of rows and cols
let cellWidth = canvas.width / rows;
let cellHeight = canvas.height / cols;

//Check if food ist collected
let foodCollected = false;

//The 4 arrow directions and the current selected
let directions = ["UP", "RIGHT", "DOWN", "LEFT"];
let direction = directions[0];

//Snake which starts a new round at x=10 y=10
let snake = [
   {
      x: 10,
      y: 10,
   },
];

//Place Food at a random position in the matchfield
function placeFood() {
   let randomX = Math.floor(Math.random() * cols);
   let randomY = Math.floor(Math.random() * rows);

   food = {
      x: randomX,
      y: randomY,
   };
}

//Drawing matchfield, snake and food
function draw() {
   //Gamefield
   ctx.fillStyle = colorMatchField;
   ctx.fillRect(0, 0, canvas.width, canvas.height);

   //Snake
   ctx.fillStyle = colorSnake;
   snake.forEach((element) => placeRect(element.x, element.y));

   //Food
   ctx.fillStyle = colorFood;
   placeRect(food.x, food.y);

   requestAnimationFrame(draw);
}

//Place a single rect
function placeRect(x, y) {
   ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth - 1, cellHeight - 1);
}

//save which key was pressed
function keyDown(e) {
   if (e.keyCode == 37) {
      direction = "LEFT";
   } else if (e.keyCode == 38) {
      direction = "UP";
   } else if (e.keyCode == 39) {
      direction = "RIGHT";
   } else if (e.keyCode == 40) {
      direction = "DOWN";
   }
}

//Shift Snake to expand the snake body
function shiftSnake() {
   for (let i = snake.length - 1; i > 0; i--) {
      const part = snake[i];
      const lastPart = snake[i - 1];
      part.x = lastPart.x;
      part.y = lastPart.y;
   }
}

//Game Loop
function gameLoop() {
   gameOver();

   if (foodCollected) {
      snake = [
         {
            x: snake[0].x,
            y: snake[0].y,
         },
         ...snake,
      ];

      currentHighscore++;
      currentScore.textContent = currentHighscore;

      foodCollected = false;
   }

   shiftSnake();

   //change direction of snake
   switch (direction) {
      case "LEFT":
         snake[0].x--;
         break;
      case "RIGHT":
         snake[0].x++;
         break;
      case "UP":
         snake[0].y--;
         break;
      case "DOWN":
         snake[0].y++;
         break;
   }

   //Check if snake collected the food
   if (food.x == snake[0].x && food.y == snake[0].y) {
      foodCollected = true;
      placeFood();
   }
}

//Game Over conditions
//Game is over if border of matchfield is touched or the snake touches itself
function gameOver() {
   let snakeHead = snake[0];
   let snakeAfterHead = snake.slice(1);
   let collision = snakeAfterHead.find(
      (element) => element.x == snakeHead.x && element.y == snakeHead.y
   );

   if (
      snake[0].x < 0 ||
      snake[0].x >= cols ||
      snake[0].y < 0 ||
      snake[0].y >= rows ||
      collision
   ) {
      placeFood();
      snake = [
         {
            x: 10,
            y: 10,
         },
      ];

      //setting the ne highscore
      if(highscore < currentHighscore){
         highscore = currentHighscore;
         allTimeHighscore.textContent = highscore;
      }
      //reset current highscore
      currentHighscore = 1;
      currentScore.textContent = currentHighscore;
      //reset speed of snake
      timerChange(200);
   }
}

//increase snake speed
btnSlower.addEventListener("click", ()=>{
   updatedSpeed = speed + speedChange;
   timerChange(updatedSpeed)
})

//decrease snake speed
btnFaster.addEventListener("click", ()=>{
   updatedSpeed = speed-speedChange;
   timerChange(updatedSpeed)
})

//change speed of snake
function timerChange(newSpeed){
   clearInterval(gameSpeed);
   speed = newSpeed;
   gameSpeed = setInterval(gameLoop, speed);
}

//eventlistener for keydown event
document.addEventListener("keydown", keyDown);

//start intervall of gameloop
let gameSpeed = setInterval(gameLoop, speed);
placeFood();
draw();
