let mouseX = -1;
let mouseY = -1;

document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function setCharacter(row, col, char, link = "", clipboardText = "", noBounce = false) {
    if (char == ' ') {
        // ignore spaces: it looks weird when the ball bounces off of them
        return;
    }
    const square = document.getElementById(`square-${row}-${col}`);
    if (square) {
        square.textContent = char;
        square.setAttribute("data-noBounce", noBounce);
        if (clipboardText) {
            square.addEventListener("click", async (event) => {
                event.preventDefault();
                await navigator.clipboard.writeText(clipboardText);
                const message = activeLang == 'nl' ? "gekopieerd!" : "copied!";
                showToast(message, event.clientX, event.clientY);
            });
            square.classList.add("link");
            if (activeLang == "nl") {
                square.title = `kopieer "${clipboardText}"`;
            } else {
                square.title = `copy "${clipboardText}" to your clipboard`;
            }
        } else if (link) {
            square.addEventListener("click", function() {
                window.location.href = link;
            });
            square.classList.add("link");
            if (link.startsWith("http")) {
                // only show the destination of the link for external (absolute) links
                square.title = link;
            }
        } else {
            square.classList.remove("link");
        }
    }
}

function showToast(message, x, y) {
    toast.style.opacity = '1';
    toast.textContent = message;
    toast.style.left = `${x}px`;
    toast.style.top = `${y}px`;

    setTimeout(() => {
        toast.style.opacity = '0';
    }, 1500);
}

function word(row, col, word, link = "", noBounce = false) {
    for (let i = 0; i < word.length; i++) {
        setCharacter(row, col + i, word.charAt(i), link, "", noBounce);
    }
}

function updateCursor(col, row) {
    col++;
    if (col === maxCol - 1) {
        col = 1;
        row++;
    }
    return { col, row };
}

async function wrappingText(lines) {
    const startCol = 0;
    let row = 2;
    let readingUrl = false;
    let readingCopyable = false;
    let url = "";
    let clipboardText = "";

    for (const line of lines) {
        let col = startCol
        for (const char of line) {
            if (readingUrl) {
                if (char == '|') {
                    readingUrl = false;
                } else {
                    url += char;
                }
            } else {
                if (char == '[') {
                    readingCopyable = true;
                } else if (char == ']') {
                    readingCopyable = false;
                    ({ col, row } = updateCursor(col, row));
                    setCharacter(row, col, ' ');
                    ({ col, row } = updateCursor(col, row));
                    setCharacter(row, col, '⎘', url, clipboardText);
                    clipboardText = "";
                } else {
                    if (readingCopyable) {
                        clipboardText += char;
                    }
                    if (char == '{') {
                        readingUrl = true;
                    } else if (char == '}') {
                        url = "";
                    } else {
                        ({ col, row } = updateCursor(col, row));
                        await sleep(20);
                        setCharacter(row, col, char, url);
                    }
                }
            }
        }
        row++;
    }
}

function image(row, col, imageName, title, link = "", functionName = "") {
    const square = document.getElementById(`square-${row}-${col}`);
    if (square) {
        const image = document.createElement("img");
        image.src = imageName;
        image.title = title;
        square.appendChild(image);
        if (link) {
            square.addEventListener('click', function() {
                    window.location.href = link;
            });
            square.classList.add("link");
        } else if (functionName) {
            square.addEventListener('click', functionName);
            square.classList.add("link");
        }
    }
}

function clearSquare(row, col) {
    const square = document.getElementById(`square-${row}-${col}`);
    if (square) {
        square.replaceChildren();
    }
}

function drawPage(pageName, language) {
    let offset = 1;
    const menuSpacing = maxCol < 20 ? 1 : 2
    for (const link of headerLinks) {
        word(0, offset, link, `?page=${link}&lang=${activeLang}`);
        offset += link.length + menuSpacing;
    }
    const page = pages[pageName];
    document.title = `${pageName} - Jongerden Development`;
    texts = language == "nl" ? page.texts_nl : page.texts_en;
    wrappingText(texts);
    image(maxRow - 2, 1, "img/ball.webp", "Play ball", '', playBall);

    if (activeLang == "en") {
        image(maxRow - 2, maxCol - 2, "img/nl.png", "Nederlandse versie", `?page=${activePage}&lang=nl`);
    } else {
        image(maxRow - 2, maxCol - 2, "img/uk.png", "English version", `?page=${activePage}&lang=en`);
    }
}
