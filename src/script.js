
const game_board = (() => {
    let board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

    const set_box = (x, y, symbol) => {
        board[x][y] = symbol;
    };
    const get_box = (x, y) => {
        return board[x][y];
    };
    const get_board = () => {
        return board;
    };
    //converts an index x to board coordinates [x,y]
    function converter(x) {     
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (x == 0) {
                    return [i, j];
                }
                x--;
            }
        }
        return false;
    }
    function clearBoard() {
        board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    }
    function get_validMoves() {
        let validMoves = [];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] == 0) {
                    validMoves.push([i, j]);
                }
            }
        }
        return validMoves;
    }
    return {
        get_validMoves,
        get_box,
        clearBoard,
        converter,
        set_box,
        get_board,
        board,
    };
})();


const player = (type, name) => {
    //represents the selected cell on the board
    let selected = 0;       
    let active = true;

    const set_selected = (x) => {
        selected = x;
    };
    const get_selected = () => {
        return selected;
    };
    const set_move = (move) => {
        if (type == "Hard AI") {
            [x, y] = game_manager.computerMove(10);
        }
        else if (type == "Medium AI") {
            [x, y] = game_manager.computerMove(3);
        }
        else if (type == "Easy AI") {
            [x, y] = game_manager.computerMove(1);
        }
        else if (type == "Human") {
            if (!active) return false;
            else[x, y] = move;
        }
        return [x, y];
    };

    return {
        selected,
        set_selected,
        get_selected,
        set_move,
        name,
        type,
        active
    };
};

const visual_manager = (() => {
    let started = false;
    const playerOne_selector = document.querySelector("#playerOne_selector");
    const playerTwo_selector = document.querySelector("#playerTwo_selector");
    const boxes = document.querySelectorAll(".box");
    const div_game_board = document.querySelector("#game_board");
    const playerOne_name = document.querySelector("#playerOne_name");
    const playerTwo_name = document.querySelector("#playerTwo_name");
    const newGame_button = document.querySelector("#newGame_button");
    const winner_text = document.querySelector("#winner_text");

    newGame_button.addEventListener('click', () => {
        if (playerOne_selector.value != "Human") playerOne_name.value = "Computer";
        if (playerTwo_selector.value != "Human") playerTwo_name.value = "Computer";
        if (playerOne_name.value == "") playerOne_name.value = "Anonymus";
        if (playerTwo_name.value == "") playerTwo_name.value = "Anonymus";
        newGame_button.disabled = true;
        playerOne_selector.disabled = true;
        playerTwo_selector.disabled = true;
        newGame_button.classList.add("invisible");
        playerOne_name.classList.add("names");
        playerTwo_name.classList.add("names");
        playerOne_name.disabled = true;
        playerTwo_name.disabled = true;
        //the listener is added only one time at the beginning
        if (!started) {     
            started = true;
            div_game_board.addEventListener('click', (e) => {
                game_manager.humanMove(e.target.id);
            });
        }
        winner_text.textContent = "";
        game_board.clearBoard();
        update_board();
        game_manager.start(playerOne_selector.value, playerTwo_selector.value, playerOne_name.value, playerTwo_name.value);
    });

    function endGame(x) {
        winner_text.textContent = x;
        newGame_button.disabled = false;
        playerOne_selector.disabled = false;
        playerTwo_selector.disabled = false;
        playerOne_name.disabled = false;
        playerTwo_name.disabled = false;
        if (playerOne_name.value == "Anonymus" || playerOne_name.value == "Computer") playerOne_name.value = "";
        if (playerTwo_name.value == "Anonymus" || playerTwo_name.value == "Computer") playerTwo_name.value = "";
        newGame_button.classList.remove("invisible");
        playerOne_name.classList.remove("names");
        playerTwo_name.classList.remove("names");

    }

    function update_board() {
        board = game_board.get_board();
        boxes.forEach((box) => {
            [x, y] = game_board.converter(box.id);
            if (board[x][y] == 0) { box.textContent = ""; box.classList.remove("box_marked"); }
            else if (board[x][y] == 1) { box.textContent = "X"; box.classList.add("box_marked"); }
            else if (board[x][y] == -1) { box.textContent = "O"; box.classList.add("box_marked"); }
        });
    }

    return {
        endGame,
        update_board

    };
})();

const game_manager = (() => {
    let player_one;
    let player_two;
    let round = -1;
    let active_player;
    //player used in the minimax simulations
    let dummy_player = player("Human", "");     
    let dummy_moves = [];

    function start(typeOne, typeTwo, nameOne, nameTwo) {
        player_one = player(typeOne, nameOne);
        player_two = player(typeTwo, nameTwo);
        round = 0;
        if (player_one.type != "Human") play();
        else player_two.active = false;
    }

    function play(move) {

        active_player;
        board = game_board.get_board();
        if (check_end()) return false;
        if (round % 2 == 0) {
            active_player = player_one;
            player_move(player_one, 1, move);
        }
        else {
            active_player = player_two;
            player_move(player_two, -1, move);
        }
        visual_manager.update_board();
        if (check_end()) return false;
        if (player_one.type != "Human" && player_two.type != "Human")
            setTimeout(function () { play(); }, 300);
        else if (player_one.type == "Human" && player_two.type == "Human") {

            player_one.active = !player_one.active;
            player_two.active = !player_two.active;
        }
        else if (active_player.type != "Human") return false;
        else if (active_player.type == "Human")
            setTimeout(function () { play(); }, 300);



    }

    function player_move(player, currentSymbol, move) {
        do {
            [x, y] = player.set_move(move);
        } while (!check_playable(x, y));
        game_board.set_box(x, y, currentSymbol);
        round++;

    }

    function humanMove(id) {
        round % 2 == 0 ? active_player = player_one : active_player = player_two;
        if (!active_player.active) return false;
        active_player.set_selected(game_board.converter(id));
        if (active_player.get_selected() == 0) return false;
        if (!check_playable(...active_player.get_selected())) return false;
        play(active_player.get_selected());
    }

    function computerMove(difficulty) {
        let { dummy_moves } = minimax(0, difficulty);
        // Pick a random move when there are choices
        return dummy_moves[Math.floor(Math.random() * dummy_moves.length)];
    }

    function check_playable(x, y) {
        if (x > 2 || y > 2) return false;
        if (game_board.get_box(x, y) == 0) {
            return true;
        }
        return false;
    }
    // if called with test it's a minimax simulation and it returns -10 for win and 0 for draw
    function check_end(test) {
        if (win_combo()) {
            if (test != undefined) return -10;  
            if (round > 9) return true;
            if (round % 2 == 1) visual_manager.endGame(player_one.name + " won!");
            else visual_manager.endGame(player_two.name + " won!");
            round = 10;
            return true;
        } else if (round == 9) {
            if (test != undefined) {
                return 0;
            }
            visual_manager.endGame("It's a draw!");
            round = 10;
            return true;
        }
        if (test != undefined);
        else return false;
    }

    function win_combo(x) {

        let board = game_board.get_board();
        if (x != undefined) { board = x; }
        let row = 0;
        let column = 0;
        let diag1 = 0;
        let diag2 = 0;
        let rev = 0;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                column += board[j][i];
                row += board[i][j];
                if (Math.abs(row / 3) == 1 || Math.abs(column / 3) == 1) {
                    return true;
                }
            }
            row = 0;
            column = 0;
        }
        for (let i = 0; i < 3; i++) {
            rev = board.slice().reverse();
            diag1 += board[i][i];
            diag2 += rev[i][i];
            if (Math.abs(diag1 / 3) == 1 || Math.abs(diag2 / 3) == 1) {
                return true;
            }
        }
        return false;
    }

    //reverts minimax simulation moves
    function takeBack() {
        if (dummy_moves.length === 0) return false; // cannot undo
        [x, y] = dummy_moves.pop();
        this.board[x][y] = 0;
        return true;
    }

    //minimax algorith to find next move, depth how many times the function was called
    function minimax(depth, difficulty) {
        depth++;
        if (depth > difficulty) return 0;
        let simbol;
        dummy_player;
        round % 2 == 0 ? simbol = 1 : simbol = -1;
        let ende = check_end(1);
        //win situation
        if (ende) return { value: ende }; 
        //draw situation      
        if (ende == 0) return { value: ende };    

        let best = { value: -Infinity };
        for (let move of game_board.get_validMoves()) {

            [x, y] = move;
            game_board.get_board()[x][y] = simbol;
            dummy_moves.push(move);
            ++round;
            let { value } = minimax(depth, difficulty);
            takeBack();
            --round;
            // Reduce magnitude of value (so shorter paths to wins are prioritised) and negate it
            value = value ? (Math.abs(value) - 1) * Math.sign(-value) : 0;
            if (value >= best.value) {
                if (value != 10 && value < 10) {
                    if (value > best.value) best = { value, dummy_moves: [] };
                    // keep track of equally valued moves
                    best.dummy_moves.push(move); 
                }
            }
        }
        return best;
    }


    return {
        computerMove,
        dummy_moves,
        minimax,
        humanMove,
        start,
        play,
        win_combo,
        check_playable,
        player_two,
        round,
        active_player,
    };
})();


