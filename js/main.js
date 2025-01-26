'use strict';

let canvas = document.getElementById('game');
let ctx = canvas.getContext('2d');
let img1 = new Image();
img1.src = "./images/player1.png";
let img2 = new Image();
img2.src = "./images/player2.png";


let board = [];
let winner = null;

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
    for (let i=0; i < board.length; i++) {
        for (let j=0; j < board[i].length; j++) {
            // draw player 1
            if (board[i][j] == 1) {
                ctx.drawImage(img1, j*200+50, i*200+50);
            } 
            // draw player 2
            else if (board[i][j] == 2) {
                ctx.drawImage(img2, j*200+50, i*200+50);
            }
        }
    }
}

function check_win() {
    // check horizontal
    for (let i=0; i < board.length; i++) {
        if (board[i][0] == 1 && board[i][1] == 1 && board[i][2] == 1) {
            winner = 'player 1';
        } else if (board[i][0] == 2 && board[i][1] == 2 && board[i][2] == 2) {
            winner = 'player 2';
        }
    }

    // check vertical
    for (let i=0; i < board.length; i++) {
        if (board[0][i] == 1 && board[1][i] == 1 && board[2][i] == 1) {
            winner = 'player 1';
        } else if (board[0][i] == 2 && board[1][i] == 2 && board[2][i] == 2) {
            winner = 'player 2';
        }
    }

    console.log(winner);
}

function createBoard() {
    board = [[0, 0, 0], [0, 2, 0], [0, 0, 0]];
    winner = null;
    drawBoard();
}

function move(canvas, event) {
    // player movement
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    let place_x = Math.floor(x / 200);
    let place_y = Math.floor(y / 200);
    let move_made = false;
    console.log(place_x)
    if (place_x <= 3 && place_y <= 3) {
        if (board[place_y][place_x] == 0) {
            board[place_y][place_x] = 1;
            move_made = true;
        }
    }
    
    // random movement
    let move_x = 0;
    let move_y = 0;
    let check = false;
    let full = true;
    do {
        move_x = Math.floor(Math.random() * 3); 
        move_y = Math.floor(Math.random() * 3);
        // only if there are still moves available
        for (let i=0; i < board.length; i++) {
            for (let j=0; j < board[i].length; j++){
                if (board[i][j] == 0) 
                    full = false;
            }
        }
        check = !full && ((board[move_y][move_x] == 1) || (board[move_y][move_x] == 2)); 
    } while(check);
    
    if (!full && move_made) {
        board[move_y][move_x] = 2;
    }

    check_win();
    drawBoard();
}

function main() {
    createBoard();
}

canvas.addEventListener('mousedown', function(e) {
    move(canvas, e)
})

main();