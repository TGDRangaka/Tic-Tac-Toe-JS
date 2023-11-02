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
        if(isGameOver) {
            resetBoard(board);
            isGameOver = false;
            return;
        }

        let row = Number.parseInt(i / 3);
        let col = i % 3;

        if(!isHaveValidMoves(board)) {
            isGameOver = true;
            showWinner(['tied']);
            return;
        }

        if(isValidMove(board, row, col)) {
            movePiece('O', board, row, col);
            $(".box").eq(i).css('backgroundImage', "url('./imgs/o.png')");

            if(isHaveWinner(board)){
                let info = isHaveWinner(board);
                showWinner(info);
                return;
            }

            if(!isHaveValidMoves(board)) {
                isGameOver = true;
                showWinner(['tied']);
                return;
            }

            computerMove(board);

            console.log(board);
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

// showWinner
function showWinner(pieces){
    isGameOver = true;
    $(".box").text("Click to reset board");

    if(pieces[0] === 'tied') {
        Swal.fire({
            title: `--Tied--`,
            width: 600,
            padding: '3em',
            color: 'white',
            background: '#121212',
            backdrop: `
            rgba(0,0,123,0.4)
            url("./imgs/lose.gif")
            center top
            no-repeat
            `
        })
        
        return;
    }

    for(let i = 1; i < 4; i++){
        let index = pieces[i][0] * 3 + pieces[i][1];
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
            url("./imgs/win.gif")
            center top
            no-repeat
            `
        })
    }else if(pieces[0] === 'X'){
        Swal.fire({
            title: `You Lose :)`,
            width: 600,
            padding: '3em',
            color: 'white',
            background: '#121212',
            backdrop: `
            rgba(0,0,123,0.4)
            url("./imgs/lose.gif")
            center top
            no-repeat
            `
        })
    }

    score(pieces[0]);
}

let playerScore = 0;
let computerScore = 0;

// score
function score(side) {
    if(side === 'O'){
        $(".player-score").text(++playerScore)
    }else{
        $(".computer-score").text(++computerScore);
    }
}

// resetBoard
function resetBoard(board){
    for(let i = 0; i < 3; i++){
        for(let j = 0; j < 3; j++){
            board[i][j] = 'EMPTY';
        }
    }

    $(".box").css('backgroundImage', 'none');
    $(".box").css('border', 'none');
    $(".box").text("");
}

// computer move
function computerMove(board){
    let bestMove = getBestMove(board);
    let row = bestMove[1], col = bestMove[2];
    
    movePiece('X', board, row, col);
    let index = (row * 3) + col;
    $(".box").eq(index).css('backgroundImage', "url('./imgs/x.png')");
    console.log('Best Move === ' + bestMove);

    // let row = 0,
    //     col = 0;

    // do {
    //     row = Math.floor((Math.random() * 3));
    //     col = Math.floor((Math.random() * 3));
    // } while (!isValidMove(board, row, col));

    // movePiece('X', board, row, col);
    // let index = (row * 3) + col;
    // $(".box").eq(index).css('backgroundImage', "url('./imgs/x.png')");

    if(isHaveWinner(board)){
        let info = isHaveWinner(board);
        showWinner(info);
    }

}

// minmax computer move
function getBestMove(board){
    let row = 0, col = 0, moves = [], z = -10;

    for(let i = 0; i < 3; i++){
        for(let j = 0; j < 3; j++){
            row = i, col = j;
            if(isValidMove(board, row, col)){
                movePiece('X', board, row, col);
                let score = minmax(0, true, board);
                moves.push([score, row, col]);
                if(score > z ){
                    z = score;
                }
                undoMove(board, row, col);
                console.log(row + '-' + col + '  score : ' + score);
            }

        }
    }
    
    let bestMoves = moves.filter(move => move[0] == z);
    console.log(bestMoves)

    if(bestMoves.length == 1){
        return bestMoves[0];
    }else{
        return bestMoves[Math.floor((Math.random() * bestMoves.length))];
    }

}

// minmax 
function minmax(depth, isPlayer, board){
    if(depth == 3){
        return 0;
    }
    if(isHaveWinner(board)){
        let info = isHaveWinner(board);
        // console.log("winner = " + info);
        if(info[0] === 'O'){
            return -10 + depth;
        }else{
            return 10 - depth;
        }
    }

    let max = 0, min = 0;
    if(isPlayer){
        for(let i = 0; i < 3; i++){
            for(let j = 0; j < 3; j++){
    
                let row = i, col = j;
                if(isValidMove(board, row, col)){
                    movePiece('O', board, row, col);
                    let score = minmax(depth + 1, !isPlayer, board);
                    undoMove(board, row, col);

                    min = score < min ? score : min;
                }
            }
        }
        return min;
    }else{
        for(let i = 0; i < 3; i++){
            for(let j = 0; j < 3; j++){
    
                let row = i, col = j;
                    if(isValidMove(board, row, col)){
                    movePiece('X', board, row, col);
                    let score = minmax(depth + 1, !isPlayer, board);
                    undoMove(board, row, col);

                    max = score > max ? score : max;
                }
            }
        }
        return max;
    }
}

// undoMove
function undoMove(board, row, col){
    board[row][col] = 'EMPTY';
}