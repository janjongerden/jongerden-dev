const barWidth = 200;
let ballX = 200;
let ballY = window.innerHeight - 200;
let ballGoingLeft = true;
let ballGoingUp = true;
const ballSize = 26;
const barOffset = 80;
let score = 10;
const bar = document.createElement("canvas");
let barDragging = false;
let barDragOffset;
const isTouchOnly = 'ontouchstart' in window && navigator.maxTouchPoints > 0 && !matchMedia('(pointer: fine)').matches;

function initializeGame() {
    // remove the "start game" icon
    clearSquare(maxRow - 2, 1);
    const ball = document.createElement("img");
    ball.id = "ball";
    ball.src = "img/ball.webp";
    ball.alt = "The ball";
    document.body.appendChild(ball);

    bar.id = "bar";
    bar.width = "500";
    bar.height = "200";
    let barX = 20;
    let barY = window.innerHeight - barOffset;
    bar.style.top = `${barY}px`;
    document.body.appendChild(bar);

    const ctx = bar.getContext("2d");
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(0, 0, barWidth, 25, 10);
    ctx.fillStyle = "rgba(255, 255, 0, .5)";
    ctx.stroke();
    ctx.fill();
}

function incrementScore() {
    score += 10;
    word(maxRow - 1, 1, `score:${score}`)
}

bar.addEventListener('touchstart', (event) => {
    barDragging = true;
    barDragOffset = event.touches[0].clientX - bar.offsetLeft;
});

window.addEventListener('touchmove', (event) => {
    if (barDragging) {
        event.preventDefault(); // Prevent scrolling
        bar.style.left = `${event.touches[0].clientX - barDragOffset}px`;
    }
});

window.addEventListener('touchend', () => {
    barDragging = false;
});

async function playBall() {
    initializeGame()
    while (true) {
        ball.style.left = `${ballX}px`;
        ball.style.top = `${ballY}px`;
        if (ballGoingLeft) {
            if (ballX == 0) {
                ballGoingLeft = false;
            } else {
                if (ballX % squareSize == 0) {
                    const row = Math.floor((ballY + ballSize / 2) / squareSize);
                    const col = Math.floor((ballX - squareSize)/ squareSize);
                    const square = document.getElementById(`square-${row}-${col}`);
                    if (square && square.textContent) {
                        ballGoingLeft = false;
                        clearSquare(row, col);
                        incrementScore();
                    }
                }
                ballX -= 1;
            }
        } else { // going right
            if (ballX == window.innerWidth - ballSize) {
                ballGoingLeft = true;
            } else {
                if ((ballX + ballSize) % squareSize == 0) {
                    const row = Math.floor((ballY + ballSize / 2) / squareSize);
                    const col = Math.floor((ballX + ballSize)/ squareSize);
                    const square = document.getElementById(`square-${row}-${col}`);
                    if (square && square.textContent) {
                        ballGoingLeft = true;
                        clearSquare(row, col);
                        incrementScore();
                    }
                }
                ballX += 1;
            }
        }
        if (ballGoingUp) {
            if (ballY == squareSize) {
                ballGoingUp = false;
            } else {
                if (ballY % squareSize == 0) {
                    const col = Math.floor((ballX + ballSize / 2) / squareSize);
                    const row = Math.floor((ballY - squareSize)/ squareSize);
                    const square = document.getElementById(`square-${row}-${col}`);
                    if (square && square.textContent) {
                        ballGoingUp = false;
                        clearSquare(row, col);
                        incrementScore();
                    }
                }
                ballY -= 1;
            }
        } else { // going down
            if (ballY == window.innerHeight - ballSize - barOffset) {
                if (ballX > barX && ballX < barX + barWidth) {
                    ballGoingUp = true;
                } else {
                    ballY += 1;
                }
            } else if (ballY == window.innerHeight) {
                    word(20, 5, "game over")
            } else {
                if ((ballY + ballSize) % squareSize == 0) {
                    const col = Math.floor((ballX + ballSize / 2) / squareSize);
                    const row = Math.floor((ballY + ballSize)/ squareSize);
                    const square = document.getElementById(`square-${row}-${col}`);
                    if (square && square.textContent) {
                        ballGoingUp = true;
                        clearSquare(row, col);
                        incrementScore();
                    }
                }
                ballY += 1;
            }
        }
        await sleep(1);
        if (!isTouchOnly) {
            // only listen to the mouse position for non-touch devices
            barX = mouseX - barWidth/2
            bar.style.left = `${barX}px`;
        }
    }
}
