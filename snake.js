let w = 0
let h = 0;
let spacing = 0;

let grid = [];
let gridx = 0; //Not to be set less than 10;
let gridy = 0;

let snake = [];
let food = [];
let snakeDirection = 0;

let xDown = null;
let yDown = null;

let timer = 0;
let restart = 0;

let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
document.onkeydown = checkKey;

function fixSize() {
  w = window.innerWidth;
  h = window.innerHeight;
  const canvas = document.getElementById('snakeCanvas');
  canvas.height = h;
  canvas.width = w;
}

function pageLoad() {

    window.addEventListener("resize", fixSize);
    window.addEventListener('touchstart', handleTouchStart, false);
    window.addEventListener('touchmove', handleTouchMove, false);

    fixSize();
    timer = setInterval(move, 75);

    gridx = Math.floor(w/50);
    gridy = Math.floor(h/50);

    snake = [];

    for (let i = 3; i >= 0; i--) {
      let x = i + 5;
      let y = 3;
      let direction = 0;
      snake.push({x, y, direction});
    }

    for (y = 0; y < gridy; y++) {
      grid[y] = [];
      for (x = 0; x < gridx; x++) {
        grid[y][x] = "-"
      }
    }

    for (let tiles of snake) {
      grid[tiles.y][tiles.x] = "x";
    }

    generateFood();

    grid[food[1]][food[0]] = "o";

    window.requestAnimationFrame(redraw);

}


function redraw() {

    const canvas = document.getElementById('snakeCanvas');
    const context = canvas.getContext('2d');

    context.globalCompositeOperation="source-over";
    context.fillStyle = '#000088';
    context.fillRect(0, 0, w, h);

    spacing = h/(gridy * 15);
    let squareSize = h/gridy - spacing/gridy;

    if (w < (h/gridy) * gridx) {
      let ratio = (w / gridx) * gridy;
      spacing = ratio/(gridy * 15);
      squareSize = ratio/gridy - spacing/gridy;
    }

    let leftSpacing = (w - gridx * squareSize)/2;
    let topSpacing = (h - gridy * squareSize)/2;

    for (y = 0; y < gridy; y++) {
      for (x = 0; x < gridx; x++) {

        if (grid[y][x] == "x" || grid[y][x] == "h") {
          context.fillStyle = 'white';
        } else if (grid[y][x] == "-"){
          context.fillStyle = 'black';
        } else {
          context.fillStyle = 'red';
        }

        context.beginPath();
        context.rect(x * squareSize + spacing + leftSpacing, y * squareSize + spacing + topSpacing, squareSize - spacing, squareSize - spacing);
        context.fill();

      }
    }

    if (restart == 1 || restart == 2) {

      context.fillStyle = "red";
      context.textAlign = "center";
      context.font = "72px Arial";

      if (isMobile) {
        context.fillText("Swipe left then right to restart", w/2, (h*4)/5);
      } else {
        context.fillText("Press 'X' to restart", w/2, (h*4)/5);
      }

    }

    window.requestAnimationFrame(redraw);

}

function move() {

  for (let tiles of snake) {

    grid[tiles.y][tiles.x] = "-";

    if (tiles.direction == 0) {
      tiles.x++;

      if (tiles.x >= gridx) {
        tiles.x = 0;
      }

    } else if (tiles.direction == 1) {
      tiles.y--;

      if (tiles.y < 0) {
        tiles.y = gridy - 1;
      }

    } else if (tiles.direction == 2) {
      tiles.x--;

      if (tiles.x < 0) {
        tiles.x = gridx - 1;
      }

    } else if (tiles.direction == 3) {
      tiles.y++;

      if (tiles.y >= gridy) {
        tiles.y = 0;
      }

    } else if (tiles.direction == 4) {
      tiles.direction = snake[snake.length - 2].direction;
    }

  }

  grid[snake[0].y][snake[0].x] = "h";

  for (let x = snake.length - 1; x >= 0; x--) {

    if (x != 0) {
      if (grid[snake[x].y][snake[x].x] == "h") {
        clearTimeout(timer);
        restart = 1;
      } else {
        grid[snake[x].y][snake[x].x] = "x";
      }
      snake[x].direction = snake[x - 1].direction;
    } else {

      if (!(((snake[x].direction == 0 && snakeDirection == 2) || (snake[x].direction == 1 && snakeDirection == 3)
          || (snake[x].direction == 2 && snakeDirection == 0) || (snake[x].direction == 3 && snakeDirection == 1)))) {
          snake[x].direction = snakeDirection;
      }
    }

  }

  if (grid[food[1]][food[0]] == grid[snake[0].y][snake[0].x]) {

    generateFood();

    let snakeLength = snake.length - 1;
    let x = snake[snakeLength].x;
    let y = snake[snakeLength].y;
    let num = snakeLength + 1;
    let direction = 4;

    snake.push({x, y, num, direction});

  }

  grid[food[1]][food[0]] = "o";

}

function generateFood() {

  let repeat = false;

  do {

    repeat = false;
    food[0] = Math.floor(Math.random() * gridx);
    food[1] = Math.floor(Math.random() * gridy);

    for (let i = 0; i < snake.length; i++) {
      if ((food[0] == snake[i].x) || (food[1] == snake[i].y)) {
        repeat = true;
      }
    }

  } while (repeat == true);

}

function checkKey(e) {

    e = e || window.event;

    if (e.keyCode == '38') {
        // up arrow
        snakeDirection = 1;
    }
    else if (e.keyCode == '40') {
        // down arrow
        snakeDirection = 3;
    }
    else if (e.keyCode == '37') {
       // left arrow
      snakeDirection = 2;
    }
    else if (e.keyCode == '39') {
       // right arrow
      snakeDirection = 0;
    } else if (e.keyCode == '88') {
      if (restart == 1) {
        restart = 0;
        pageLoad();
      }
    }

}

function getTouches(evt) {
  return evt.touches ||             // browser API
         evt.originalEvent.touches; // jQuery
}

function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0];
    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
};

function handleTouchMove(evt) {
    if ( ! xDown || ! yDown ) {
        return;
    }

    var xUp = evt.touches[0].clientX;
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
        if ( xDiff > 0 ) {
            /* left swipe */
            if (restart == 1) {
              restart = 2;
            }
            snakeDirection = 2;
        } else {
            /* right swipe */
            if (restart == 2) {
              restart = 0;
              pageLoad();
            }
            snakeDirection = 0;
        }
    } else {
        if ( yDiff > 0 ) {
            /* up swipe */
            snakeDirection = 1;
        } else {
            /* down swipe */
            snakeDirection = 3;
        }
    }
    /* reset values */
    xDown = null;
    yDown = null;
};
