let isPlayer = true;
let isGameOver = false;
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
        if(isGameOver) return;

        let row = Number.parseInt(i / 3);
        let col = i % 3;

        if(!isHaveValidMoves(board)) {
            isGameOver = true;
            return;
        }

        if(isValidMove(board, row, col)) {
            movePiece('O', board, row, col);
            $(".box").eq(i).css('backgroundImage', "url('/imgs/o.png')");

            if(isHaveWinner(board)){
                let info = isHaveWinner(board);
                showWinner(info);
                isGameOver = true;
                return;
            }

            if(!isHaveValidMoves(board)) {
                isGameOver = true;
                return;
            }

            computerMove(board);

            console.log(board);
        }

        

    });
}

// isHaveWinner
function isHaveWinner(board){

    //check H Lines
    for(let i = 0; i < 3; i++){
        if(board[i][1] === "EMPTY") continue;
        if(board[i][0] === board[i][1] && board[i][2] === board[i][1]){
            return [board[i][0], [i, 0], [i, 1], [i,2]];
        }
    }

    //check V Lines
    for(let i = 0; i < 3; i++){
        if(board[1][i] === "EMPTY") continue;
        if(board[0][i] === board[1][i] && board[2][i] === board[1][i]){
            return [board[0][i], [0, i], [1, i], [2, i]];
        }
    }

    //check diagonal lines
    let center = board[1][1];

    if(center === "EMPTY") return null;

    if(center === board[0][0] && center === board[2][2]){
        return [center, [0, 0], [1, 1], [2, 2]];
    }else if(center === board[2][0] && center === board[0][2]){
        return [center, [2, 0], [1, 1], [0, 2]];
    }

    return null;
}

// isHaveValidMoves
function isHaveValidMoves(board){
    let is = false;
    board.map((row) => {
        row.map((piece) => {
            console.log(piece);
            if(piece === 'EMPTY') is = true;
        });
    });

    return is;
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
    $(".box").eq(index).css('backgroundImage', "url('/imgs/x.png')");

    if(isHaveWinner(board)){
        let info = isHaveWinner(board);
        showWinner(info);
        isGameOver = true;
    }
}

// showWinner
function showWinner(pieces){
    for(let i = 1; i < 4; i++){
        let index = pieces[i][0] * 3 + pieces[i][1];
        console.log("W = " + index);
        $(".box").eq(index).css('border', '5px solid red');
    }

    if(pieces[0] === 'O'){
        Swal.fire({
            title: `You Win!!!`,
            width: 600,
            padding: '3em',
            color: 'white',
            background: '#121212',
            backdrop: `
            rgba(0,0,123,0.4)
            url("/imgs/win.gif")
            center top
            no-repeat
            `
        })
    }else {
        Swal.fire({
            title: `You Lose :)`,
            width: 600,
            padding: '3em',
            color: 'white',
            background: '#121212',
            backdrop: `
            rgba(0,0,123,0.4)
            url("/imgs/lose.gif")
            center top
            no-repeat
            `
        })
    }
}