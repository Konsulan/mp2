'use strict';

let canvas = document.getElementById('game');
let ctx = canvas.getContext('2d');
let board = [];
let winner = null;
let x_moves = 0;
let last_x_move = 0;
let last_y_move = 0;
let locked = false;

let img1 = new Image();
img1.src = "./images/player1.png";
let img2 = new Image();
img2.src = "./images/player2.png";

let rematch_card = document.getElementById("rematch_card");
let play_again_button = document.getElementById("play_again")
let player_win_card = document.getElementById("player_win");
let com_win_card = document.getElementById("com_win");


/** 
 * Zeichnet das komplette Spielfeld
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

function announce_win() {
    console.log('winner: ' + winner);
    rematch_card.style.display = "block";
    if(winner === 'player 1'){
        player_win_card.style.display = "block";
    }else{
        com_win_card.style.display = "block";
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

    // check diagonal
    if (board[0][0] == 1 && board[1][1] == 1 && board[2][2] == 1) {
        winner = 'player 1';
    } else if(board[0][0] == 2 && board[1][1] == 2 && board[2][2] == 2) {
        winner = 'player 2';
    } else if (board[0][2] == 1 && board[1][1] == 1 && board[2][0] == 1) {
        winner = 'player 1';
    } else if (board[0][2] == 2 && board[1][1] == 2 && board[2][0] == 2) {
        winner = 'player 2';
    }

    if (winner !== null) {
        announce_win();
        return true;
    }

    return false
}

function createBoard() {
    board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    winner = null;
    x_moves = 0;
    locked = true;
    drawBoard();
    sleep(1500).then(() => {
        board[1][1] = 2;
        drawBoard();
        locked = false;
    });
}

function resetGame(){
    location.reload();
}

function move(canvas, event) {
    if (winner === null && !locked) {
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
        drawBoard();
        check_win();
        if (winner !== null) {
            return;
        }



        // random movement
        locked = true;
        sleep(1500).then(() => {
            let move_x = 0;
            let move_y = 0;
            let check = false;
            let full = true;
            if(x_moves < 1) {
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
                    x_moves++;
                    board[move_y][move_x] = 2;
                    last_x_move = move_x;
                    last_y_move = move_y;
                }
            } else {
                switch(last_y_move) {
                    case 0:
                        switch(last_x_move) {
                            case 0:
                                move_y = 2;
                                move_x = 2;
                                break;
                            case 1:
                                move_y = 2;
                                move_x = 1;
                                break;
                            case 2:
                                move_y = 2;
                                move_x = 0;
                                break;
                        }
                        break;    
                    case 1:
                        switch(last_x_move) {
                            case 0:
                                move_y = 1;
                                move_x = 2;
                                break;
                            case 2:
                                move_y = 1;
                                move_x = 0;
                                break;
                        }
                        break;
                    case 2:
                        switch(last_x_move) {
                            case 0:
                                move_y = 0;
                                move_x = 2;
                                break;
                            case 1:
                                move_y = 0;
                                move_x = 1;
                                break;
                            case 2:
                                move_y = 0;
                                move_x = 0;
                                break;
                        }
                        break;
                }
                board[move_y][move_x] = 2;
            }

            check_win();
            drawBoard();
            locked = false;
        });
    }
}

// sleep time expects milliseconds
function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

function acceptTerms(){
    document.getElementById("terms_banner").style.display = "none";
    localStorage.setItem("accepted_all", true);
}

function showTerms(){
    document.getElementById("terms_banner").style.display = "block";
}

function showCheckboxes(){
    console.log("show")
    document.getElementById("game_settings").style.display = "block";
}
  
  

function main() {
    rematch_card.style.display = "none";
    player_win_card.style.display = "none";
    com_win_card.style.display = "none";

    play_again_button.addEventListener("click",resetGame);

    if(localStorage.getItem("accepted_all")){
        acceptTerms();
    }

    createBoard();
}

canvas.addEventListener('mousedown', function(e) {
    move(canvas, e)
})

main();