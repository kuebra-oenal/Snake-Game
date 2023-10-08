// Snake Game Master 4 : trying to understand the code step by step
// explanationary comments by ChatGPT

const board_border = 'black';
// const board_background = 'rgba(196, 181, 233, 0.712)';
const board_background = 'beige';
const snake_col = 'rgba(87, 50, 182, 0.712)';

let snake = [
    { x:200, y: 200},
];

let changing_direction = false;

let dx = 20;
let dy = 0;

let food_x;
let food_y;

let movementInterval = 100;
var score = 0;


// let food_a;
// let food_b;

const buttons = {};
const board = document.getElementById("id");
const snakeboard_ctx = board.getContext("2d");
const retryButton = document.getElementById('retryButton');

load();

document.addEventListener("keydown", changeDirection);

for (const element of document.querySelectorAll('button')) {
    buttons[element.classList[0]] = element
}

// logic
function load() {
    snake = [
        { x: 200, y: 200},
    ];

    changing_direction = false;

    dx = 20;
    dy = 0;

    food_x;
    food_y;

    score = 0;
    movementInterval = 100;
    main();
    genFood();
    setHighScore();
    retryButton.style.display = 'none';
}
function main(){
    var res = gameOver();
    if (res)
        return;

    changing_direction = false;
    clearCanvas();
    drawFood();
    moveSnake();
    drawSnake();
    drawScore();
    updateScore();

    setTimeout(main, movementInterval);
}

function clearCanvas(){

    snakeboard_ctx.fillStyle = board_background;

    snakeboard_ctx.strokeStyle = board_border;

    snakeboard_ctx.fillRect(0, 0, board.width, board.height);

    snakeboard_ctx.strokeRect(0, 0, board.width, board.height);


}

// food ----------------------------------------

function randomFood(min, max){
    return Math.round((Math.random() * (max - min) + min) / 20) * 20;
}

function genFood(){
    food_x = randomFood(0, board.width - 50);
    food_y = randomFood(0, board.height - 50);
    // snake.forEach((part) => {
    //     const has_eaten = part.x == food_x && part.y == food_y;
    //     if(has_eaten) genFood();
    // });
}

function randomFood2(min2, max2){
    return Math.round((Math.random() * (max2 - min2) + min2) / 20) * 20;
}

// function genFood2(){
//     food_a = randomFood2(0, board.width - 30);
//     food_b = randomFood2(0, board.height - 30);
// }


// move ----------------------------------------

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    snake.unshift(head);
    // Used to add the new head to the beginning of the snake array
    // Moves the snake one step in the specified direction

    const has_eaten_food = snake[0].x === food_x && snake[0].y === food_y;

    if (has_eaten_food) {
         genFood();
         score += 10;
    }
    else {
         snake.pop(70);
        // Removes tail of the snake
        // Makes the snake move forward by one step while maintaining its overall length
    }

}


function changeDirection(event) {
    const leftKey = 37;
    const rightKey = 39;
    const upKey = 38;
    const downKey = 40;


    // if (changing_direction) return;

    changing_direction = true;
    const keyPressed = event.keyCode;
    // const up = dy === -20;
    // const down = dy === 20;
    // const right = dx === 20;
    // const left = dx === -20;

    // if (keyPressed === leftKey && !right) {
    //      moveL()
    // }
    // if (keyPressed === upKey && !down) {
    //      moveU()
    // }
    // if (keyPressed === rightKey && !left) {
    //      moveR()
    // }
    // if (keyPressed === downKey && !up) {
    //      moveD()
    // }

    // Handle direction changes
    if (event.keyCode === leftKey && dx !== 20) {
        moveL();
    }
    if (event.keyCode === upKey && dy !== 20) {
        moveU();
    }
    if (event.keyCode === rightKey && dx !== -20) {
        moveR();
    }
    if (event.keyCode === downKey && dy !== -20) {
        moveD();
    }
    
}

function gameOver() {
    let over = false;
    
    if (
        snake[0].x < 0 ||
        snake[0].y < 0 ||
        snake[0].x >= board.width ||
        snake[0].y >= board.height
    ) {
        // Check if the snake is hitting the walls
        over = true; // Game over
    } else {
        // Wrap the snake around the board
        snake[0].x = (snake[0].x + board.width) % board.width;
        snake[0].y = (snake[0].y + board.height) % board.height;
    }

    // Check for collision with snake's own body
    for (var i = 1; i < snake.length - 1; i++) {
         var tmp = snake[i];
         if (tmp.x === snake[0].x && tmp.y === snake[0].y) {
              over = true;
              break;
         }
    }
    // If game is over, update UI and return true
    if (over) {
         snakeboard_ctx.fillStyle = "black";
         snakeboard_ctx.font = "70px hed";
         snakeboard_ctx.fillText("Game Over", 75, 250);
         setHighScore(score); // Update the high score to new high score if achieved.
         retryButton.style.display = 'block';
    }

    return over;
}



function moveU() {
    setActive('up');
    dx = 0;
    dy = -20;
}

function moveD() {
    setActive('down');
    dx = 0;
    dy = 20;
}

function moveR() {
    setActive('right');
    dx = 20;
    dy = 0;
}

function moveL() {
    setActive('left');
    dx = -20;
    dy = 0;
}

// design ----------------------------------------

function drawFood(){

    snakeboard_ctx.fillStyle = 'black';

    snakeboard_ctx.fillRect(food_x, food_y, 20, 20);
}

// function drawFood2(){
    
//     snakeboard_ctx.fillStyle = 'beige';

//     snakeboard_ctx.fillRect(food_a, food_b, 20, 20);
// }

// function drawSnakePart(snakePart){

//     snakeboard_ctx.fillStyle = snake_col;

//     snakeboard_ctx.fillRect(snakePart.x, snakePart.y, 20, 20);

// }

// function drawSnake(){
//     snake.forEach(drawSnakePart);
// }

function drawSnakePart(snakePart) {
    // Clip the snake's body segments to stay within the board boundaries
    const clippedX = Math.max(0, Math.min(board.width - 20, snakePart.x));
    const clippedY = Math.max(0, Math.min(board.height - 20, snakePart.y));

    snakeboard_ctx.fillStyle = snake_col;
    snakeboard_ctx.fillRect(clippedX, clippedY, 20, 20);
}

function drawSnake() {
    snake.forEach(drawSnakePart);
}
function drawScore() {
    snakeboard_ctx.fillStyle = "black";
    snakeboard_ctx.font = "20px hed";
    snakeboard_ctx.fillText("Score: " + score, 10, 20);
}

function setActive(btn) {
    for (const [button, element] of Object.entries(buttons)) {
         if (btn == button) element.classList.add('active')
         else element.classList.remove('active')
    }
}

function setHighScore() {
    let fetchedScore = Number(localStorage.getItem("highScore")) || 0;
    let highscore = document.getElementById("high-score");
    fetchedScore = Math.max(fetchedScore, score) || 0;
    highscore.textContent = fetchedScore;
    localStorage.setItem("highScore", fetchedScore);
}

function updateScore() {

    // Adjust movement interval based on the score
    if (score == 0) {
        movementInterval = 150; // Snake moves faster when score reaches 10
    }
    if (score >= 10) {
        movementInterval = 140; // Snake moves faster when score reaches 10
    }
    if (score >= 20) {
        movementInterval = 130; // Snake moves even faster when score reaches 20
    }
    if (score >= 30) {
        movementInterval = 120;
    }
    if (score >= 40) {
        movementInterval = 110;
    }
    if (score >= 50) {
        movementInterval = 100;
    }
}