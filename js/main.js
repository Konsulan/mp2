'use strict';

let canvas = document.getElementById('game');
let ctx = canvas.getContext('2d');


let board = [];

/** 
 * Zeichnet das raster des Spielfelds
 * Felder:  0   - 200
 *          200 - 400
 *          400 - 600
 *          600 - 800 (erst später, wenn bot schummelt)
 */
function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    for (let i = 0; i < 2; i++) {
        // vertikale linien
        ctx.moveTo(200*(i+1), 0);
        ctx.lineTo(200*(i+1), 600);
        
        // horizontale linien
        ctx.moveTo(0, 200*(i+1));
        ctx.lineTo(600, 200*(i+1));
    }
    ctx.stroke();

    ctx.beginPath();
    for (let i=0; i < board.length; i++) {
        for (let j=0; j < board[i].length; j++) {
            // draw player 1
            if (board[i][j] == 1) {
                
            } 
            // draw player 2
            else if (board[i][j] == 2) {

            }

        }
    }
    ctx.stroke();
}

function createBoard() {
    board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    drawBoard();
}

function move(canvas, event) {
    // player movement
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    if (x <= 200) {
        if (y <= 200) {
            board[0][0] = 1;
        } else if (y <= 400) {
            board[1][0] = 1;
        } else if (y <= 600) {
            board[2][0] = 1;
        }
    } else if (x <= 400) {
        if (y <= 200) {
            board[0][1] = 1;
        } else if (y <= 400) {
            board[1][1] = 1;
        } else if (y <= 600) {
            board[2][1] = 1;
        }
    } else if (x <= 600) {
        if (y <= 200) {
            board[0][2] = 1;
        } else if (y <= 400) {
            board[1][2] = 1;
        } else if (y <= 600) {
            board[2][2] = 1;
        }
    }
    drawBoard();
}

function main() {
    createBoard();
}

canvas.addEventListener('mousedown', function(e) {
    move(canvas, e)
})

main();