const barWidth = 200;
let ballX = 200;
let ballY = window.innerHeight - 200;
let ballGoingLeft = true;
let ballGoingUp = true;
const ballSize = 26;
const barOffset = 80;

function initializeGame() {
    // remove the "start game" icon
    clearSquare(maxRow - 2, 1);
    const ball = document.createElement("img");
    ball.id = "ball";
    ball.src = "img/ball.webp";
    ball.alt = "The ball";
    document.body.appendChild(ball);

    const bar = document.createElement("canvas");
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

async function playBall() {
    initializeGame()
    while (true) {
        ball.style.left = `${ballX}px`;
        ball.style.top = `${ballY}px`;
        if (ballGoingLeft) {
            if (ballX == 0) {
                ballGoingLeft = false;
            } else {
                ballX -= 1;
            }
        } else {
            if (ballX == window.innerWidth - ballSize) {
                ballGoingLeft = true;
            } else {
                ballX += 1;
            }
        }
        if (ballGoingUp) {
            if (ballY == 0) {
                ballGoingUp = false;
            } else {
                if (ballY % squareSize == 0) {
                    const col = Math.floor((ballX + ballSize / 2) / squareSize);
                    const row = Math.floor((ballY - squareSize)/ squareSize);
                    const square = document.getElementById(`square-${row}-${col}`);
                    if (square.textContent) {
                        ballGoingUp = false;
                        clearSquare(row, col);
                    }
                }
                ballY -= 1;
            }
        } else {
            if (ballY == window.innerHeight - ballSize - barOffset) {
                if (ballX > barX && ballX < barX + barWidth) {
                    ballGoingUp = true;
                } else {
                    ballY += 1;
                }
            } else if (ballY == window.innerHeight) {
                    word(20, 5, "game over")
            } else {
                ballY += 1;
            }
        }
        await sleep(1);
        barX = mouseX - barWidth/2
        bar.style.left = `${barX}px`;
    }
}
