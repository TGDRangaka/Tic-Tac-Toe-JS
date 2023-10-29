let isPlayer = true;
let board = [new Array(), new Array(), new Array()];

// assign empty to all pieces
for(let i = 0; i < 3; i++){
    for(let j = 0; j < 3; j++){
        board[i][j] = 'EMPTY';
    }
}

// .box action
for(let i = 0; i < 9; i++){
    $(".box").eq(i).on('click', ()=>{
        let row = Number.parseInt(i / 3);
        let col = i % 3;

        if(!isValidMove(board, row, col)) return;

        movePiece('O', board, row, col);
        $(".box").eq(i).css('backgroundImage', "url('/imgs/o.png')");

        if(isHaveWinner(board)){
            console.log("Have a winner - O!");
        }

        computerMove(board);

        if(isHaveWinner(board)){
            console.log("Have a winner - X!");
        }

        console.log(board);

    });
}

// isHaveWinner
function isHaveWinner(board){

    //check H Lines
    for(let i = 0; i < 3; i++){
        if(board[i][1] === "EMPTY") continue;
        if(board[i][0] === board[i][1] && board[i][2] === board[i][1]){
            return true;
        }
    }

    //check V Lines
    for(let i = 0; i < 3; i++){
        if(board[1][i] === "EMPTY") continue;
        if(board[0][i] === board[1][i] && board[2][i] === board[1][i]){
            return true;
        }
    }

    //check diagonal lines
    let center = board[1][1];

    if(center === "EMPTY") return false;

    if(center === board[0][0] && center === board[2][2]){
        return true;
    }else if(center === board[2][0] && center === board[0][2]){
        return true;
    }

    return false;
}

// isValidMove
function isValidMove(board, row, col){
    return board[row][col] === 'EMPTY';
}

// movePiece
function movePiece(piece, board, row, col){
    board[row][col] = piece;
}

// computer move
function computerMove(board){
    let row = 0,
        col = 0;

    do {
        row = Math.floor((Math.random() * 3));
        col = Math.floor((Math.random() * 3));

    } while (!isValidMove(board, row, col));

    movePiece('X', board, row, col);
    let index = (row * 3) + col;
    console.log('index : ' + index);
    $(".box").eq(index).css('backgroundImage', "url('/imgs/x.png')");
}