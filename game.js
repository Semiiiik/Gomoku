const gridSizeLines = 15;
const boardSizePx = 725;
const gridPaddingPx = 50;
const cordsPaddingPx = 35;
const gridSizePx = boardSizePx - 2 * gridPaddingPx;
const dpr = window.devicePixelRatio || 1;
const spacing = gridSizePx/(gridSizeLines - 1);

function drawBoard() {
    const board = document.getElementById('board');
    const ctx = board.getContext('2d');

    board.width = boardSizePx * dpr;
    board.height = boardSizePx * dpr;

    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "#000000";

    board.style.width = boardSizePx + "px";
    board.style.height = boardSizePx + "px";
    ctx.scale(dpr, dpr);

    //grid
    ctx.beginPath();
    for (let lines = 0; lines < gridSizeLines; lines++) {
        ctx.moveTo(gridPaddingPx, lines * spacing + gridPaddingPx);
        ctx.lineTo(gridSizePx + gridPaddingPx, lines * spacing + gridPaddingPx);

        ctx.moveTo(lines * spacing + gridPaddingPx, gridPaddingPx);
        ctx.lineTo(lines * spacing + gridPaddingPx, gridSizePx + gridPaddingPx);
    }
    ctx.stroke();
    //outer line
    ctx.lineWidth = 2;
    ctx.strokeRect(gridPaddingPx, gridPaddingPx, gridSizePx, gridSizePx);

    //star points
    const starPoints = [
        [3, 3], [3, 11],
        [7, 7],
        [11, 3], [11, 11]
    ]
    for (const [row, col] of starPoints) {
        ctx.beginPath();
        ctx.arc(row * spacing + gridPaddingPx, col * spacing + gridPaddingPx, 4, 0, Math.PI * 2);
        ctx.fill();
    }
    //coordinates
    ctx.font = "16px 'Lexend', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const cordsLetters = [
        "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O"
    ]

    for (let letters = 0; letters < cordsLetters.length; letters++) {
        const letter = cordsLetters[letters];
        ctx.fillText(letter, letters * spacing + gridPaddingPx, cordsPaddingPx + gridSizePx + gridPaddingPx);
    }

    const cordsNumbers = [
        "15", "14", "13", "12", "11", "10", "9", "8", "7", "6", "5", "4", "3", "2", "1",
    ]

    for (let numbers = 0; numbers < cordsNumbers.length; numbers++) {
        const number = cordsNumbers[numbers];
        ctx.fillText(number, gridPaddingPx - cordsPaddingPx, numbers * spacing + gridPaddingPx);
    }
}

drawBoard();
