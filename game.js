const gridSizeLines = 15;
const boardSizePx = 700;
const gridPaddingPx = 25;
const gridSizePx = boardSizePx - 2 * gridPaddingPx;
const dpr = window.devicePixelRatio || 1;

function drawBoard() {
    const board = document.getElementById('board');
    const ctx = board.getContext('2d');
    ctx.strokeStyle = "#000000";

    board.width = boardSizePx * dpr;
    board.height = boardSizePx * dpr;
    board.style.width = boardSizePx + "px";
    board.style.height = boardSizePx + "px";
    ctx.scale(dpr, dpr);

    //horizontal
    for (let lines = 0; lines < gridSizeLines; lines++) {
        if (lines === 0 || lines === gridSizeLines - 1) {
            ctx.lineWidth = 2;
        } else {
            ctx.lineWidth = 1.5;
        }
        ctx.beginPath();
        ctx.moveTo(gridPaddingPx, lines*gridSizePx/(gridSizeLines - 1) + gridPaddingPx);
        ctx.lineTo(gridSizePx + gridPaddingPx, lines*gridSizePx/(gridSizeLines - 1) + gridPaddingPx);
        ctx.stroke();
    }

    //vertical
    for (let lines = 0; lines < gridSizeLines; lines++) {
        if (lines === 0 || lines === gridSizeLines - 1) {
            ctx.lineWidth = 2;
        } else {
            ctx.lineWidth = 1.5;
        }
        ctx.beginPath();
        ctx.moveTo(lines*gridSizePx/(gridSizeLines - 1) + gridPaddingPx, gridPaddingPx);
        ctx.lineTo(lines*gridSizePx/(gridSizeLines - 1) + gridPaddingPx, gridSizePx + gridPaddingPx);
        ctx.stroke();
    }

    //outer line
    ctx.strokeRect(gridPaddingPx, gridPaddingPx, gridSizePx, gridSizePx);

    //star points
    const starPoints = [
        [3, 3], [3, 11],
        [7, 7],
        [11, 3], [11, 11]
    ];

    for (const [row, col] of starPoints) {
        ctx.beginPath();
        ctx.arc(row * gridSizePx/(gridSizeLines - 1) + gridPaddingPx, col * gridSizePx/(gridSizeLines - 1) + gridPaddingPx, 4, 0, Math.PI * 2);
        ctx.fill();
    }

}
drawBoard();