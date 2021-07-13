const player = (type,name="no name") => {
    let x = 0;
    let y = 0;
    const set_move = () => {
        if(type=="AI"){
        x = Math.floor(Math.random() * 3);
        y = Math.floor(Math.random() * 3);
        }
        else if(type=="Human"){
            x=prompt("b")
            y=prompt("b")
            }
        return [x, y];
    };

    return { set_move, type,name};
};

const player_one = player("Human",);
const player_two = player("AI","sasa");


const game_manager = (function () {

    const board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    let x;
    let y;
    let currentS;
    let winner_name

    for (let round = 0; round < 9; round++) {
        if (round % 2 == 0) {
            [x, y] = player_one.set_move();
            currentS = 1;

        } else {
            [x, y] = player_two.set_move();
            currentS = -1;
        }
        if (board[x][y] == 0) {
            board[x][y] = currentS;

            if (checkwin()) {
                if(currentS == 1){
                    winner_name=player_one.name
                }else{
                    winner_name=player_two.name
                }
                console.log("winner is ",winner_name)
                break;
            }

        }
        else {
            round--;
        }
        console.log(board[0],board[1],board[2])
        if (round == 8) console.log("draw");

        function checkwin() {
            let row = 0;
            let column = 0;
            let diag1 = 0;
            let diag2 = 0;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    column += board[j][i];
                    row += board[i][j];
                    if (row / 3 == 1 || column / 3 == 1) {
                        return true;
                    }
                }
                row = 0;
                column = 0;
            }
            for (let i = 0; i < 3; i++) {
                let rev=board.slice().reverse();
                diag1 += board[i][i];
                diag2 += rev[i][i];
                if (diag1 / 3 == 1 || diag2 / 3 == 1) {
                    return true;
                }
            }
        }
    }
    return { board, player_two, player_one, board };
})(player_one,player_two);