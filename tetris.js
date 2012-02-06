/**
 * Tetris v 0.90
 * Created by Olmer.
 * IDE: JetBrains PHPStorm
 * Date: 06.07.11
 * Time: 11:44
 * Mailto: baris@bigmir.net
 */

/** ##########################################################################
 *
 *                  Main documentation for all functions.
 *
 *
 * tetris_globals = {}              - Main global object w/ all methods.
 * keyhandler()                     - Handles keypresses. Calls reaction to keypress.
 * bind_controls()                  - Bind handler to keypress. Disables controls on pause.
 * unbind_controls()                - Reverse.
 * clear_field()                    - Cleanes screen on new game.
 * get_random_piece()               - Returns pieces name for constructor.
 * Piece()                          - Main constructor. Recieves pieces name. Have next methods and vars:
 * disposition                      - Index of different pieces disposition. For use in constructor only.
 * coordinates = {x,y}              - Current coordinates.
 * width                            - Maximum pieces width.
 * height                           - Maximum pieces height.
 * structure                        - Piece.
 * do_rotate()                      - Changes pieces structure (rotate it). Uses "disposition" var.
 * do_move()                        - Main function. Calls corectness checking, drawing if correct,
 *                                      locking and endgame.
 * is_move_allowed()                - Main check. Recieves direction of move, returns result of checking.
 * is_rotation_allowed()            - Rotation corectness check. Recieves objects parameters,
 *                                      returns result of checking.
 * do_draw()                        - Draws piece. Recieves direction.
 * lock()                           - Locks piece if reached bottom.
 * if_filled()                      - Checkes filled lines. If filled, calls line cleaner. Also calculates
 *                                      speed, score, cleared lines count and display this values.
 * line_cleaner()                   - Clears filled line and shift upper lines down. Recieves index of
 *                                      line, that needs to be cleared.
 * draw_next_piece()                - Displays next piece. Recieves pieces type.
 * ('btn_start').onclick()          - Start button's click handler. Do lots of thing, mainly resets
 *                                      counters, clear field etc. Launches main function.
 * ('btn_pause').onclick()          - Binds/unbinds controls, pauses timer.
 *
 * ##########################################################################
 */

/** ##########################################################################
 *
 *                           History of creation
 *
 *
 * 0.  Organization. Idea. Desire. Thinking about general structure.
 * 1.  Visual. HTML. Table. Giving id's to each cell.
 * 2.  Programming. Constructor. Giving properties to each type of piece (coordinates, structure etc.).
 * 3.  Programming. Adding to constructor rotating methods.
 * 4.  Programming. Array with types of pieces. Random piece's generation.
 * 5.  Programming. Loop to display piece.
 * 6.  Programming. Timer and loop for falling pieces.
 * 7.  Programming. Adding delimiters, when piece reaches the bottom.
 * 8.  Programming. Lock piece if have fallen.
 * 9.  Programming. Main loop. Creating new piece after locking old.
 * 10. Programming. Adding triggers when piece have fallen onto locked one.
 * 11. Programming. Adding endgame condition.
 * 12. Events. Adding keypress listeners.
 * 13. Events. Handling 'left' and 'right' keypresses.
 * 14. Programming.Adding delimiters.
 * 15. Programming.Creating function to clear lines.
 * 16. Refactoring. Debugging.
 * 17. Events. Creating rotation event.
 * 18. Programming.Adding delimiters.
 * 19. Events. Acceleration event.
 * 20. Organization. Creating to-do list.
 * 21. Refactoring. Creating global object and copying to it all methods and vars. Spotting some bugs.
 * 22. Visual. Creating next piece window and handler for it.
 * 23. Events. Start/new games/pause buttons.
 * 24. Refactoring. Some class refactoring. Putting global methods in prototype.
 * 25. Programming. Scoring.
 * 26. Programming. Lines count.
 * 27. Programming. Speed.
 * 28. Organization. Creating documentation.
 *
 * ##########################################################################
 */

var tetris_globals = {};
function keyhandler(e) {
    var code = (e.charCode) ? e.charCode : ((e.keyCode) ? e.keyCode : ((e.which) ? e.which : 0));
    if (code >= 37 && code <= 40) {
        switch (code) {
            case 37:
                if (tetris_globals.piece.is_move_allowed('left') === 'allow') {
                    tetris_globals.piece.do_draw('left');
                }
                break;
            case 39:
                if (tetris_globals.piece.is_move_allowed('right') === 'allow') {
                    tetris_globals.piece.do_draw('right');
                }
                break;
            case 38:
                if (tetris_globals.is_rotation_allowed(tetris_globals.piece.coordinates, tetris_globals.piece.structure, tetris_globals.piece.width, tetris_globals.piece.height, tetris_globals.piece.do_rotate, tetris_globals.piece.disposition) === 'allow') {
                    tetris_globals.piece.do_rotate();
                    tetris_globals.piece.do_draw(false);
                }
                break;
            case 40:
                var check_result = tetris_globals.piece.is_move_allowed('down');
                if (check_result === 'allow') {
                    tetris_globals.piece.do_draw('down');
                }
                else if (check_result === 'dropped') {
                    tetris_globals.piece.lock();
                }
        }
        e.returnValue = false;
        return false
    }
    return true
}
tetris_globals.bind_controls = function () {
    if (document.addEventListener) {
        document.addEventListener('keydown', keyhandler, false);
    } else if (document.attachEvent) {
        document.attachEvent('onkeydown', keyhandler);
    } else {
        document.onkeydown = keyhandler;
    }
};
tetris_globals.unbind_controls = function () {
    if (document.removeEventListener) {
        document.removeEventListener('keydown', keyhandler, false);
    } else if (document.detachEvent) {
        document.detachEvent('onkeydown', keyhandler);
    } else {
        document.onkeydown = function () {
            return false
        };
    }
};
tetris_globals.clear_field = function () {
    for (var jj = 0; jj < 20; jj++) {
        for (var ii = 0; ii < 10; ii++) {
            var element_id = 'c' + ii + '_' + jj;
            var element = document.getElementById(element_id);
            element.style.backgroundColor = 'white';
        }
    }
};
tetris_globals.get_random_piece = function () {
    var array_pieces = ['i', 't', 'z', 's', 'l', 'j', 'o'];
    return array_pieces[Math.floor(Math.random() * (7))];
};
tetris_globals.Piece = function (type) {
    //Pieces disposition
    this.disposition = 0;
    switch (type) {
        case 'i':
            this.width = this.height = 4;
            //Piece
            this.structure = [
                [1, 1, 1, 1],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ];
            //Rotation
            this.do_rotate = function () {
                switch (this.disposition) {
                    case 0:
                        this.structure = [
                            [0, 1, 0, 0],
                            [0, 1, 0, 0],
                            [0, 1, 0, 0],
                            [0, 1, 0, 0]
                        ];
                        this.disposition = 1;
                        break;
                    case 1:
                        this.structure = [
                            [1, 1, 1, 1],
                            [0, 0, 0, 0],
                            [0, 0, 0, 0],
                            [0, 0, 0, 0]
                        ];
                        this.disposition = 0;
                }
            };
            break;
        case 't':
            this.width = this.height = 3;
            this.structure = [
                [0, 1, 0],
                [1, 1, 1],
                [0, 0, 0]
            ];
            this.do_rotate = function () {
                switch (this.disposition) {
                    case 0:
                        this.structure = [
                            [0, 1, 0],
                            [0, 1, 1],
                            [0, 1, 0]
                        ];
                        this.disposition = 1;
                        break;
                    case 1:
                        this.structure = [
                            [1, 1, 1],
                            [0, 1, 0],
                            [0, 0, 0]
                        ];
                        this.disposition = 2;
                        break;
                    case 2:
                        this.structure = [
                            [0, 1, 0],
                            [1, 1, 0],
                            [0, 1, 0]
                        ];
                        this.disposition = 3;
                        break;
                    case 3:
                        this.structure = [
                            [0, 1, 0],
                            [1, 1, 1],
                            [0, 0, 0]
                        ];
                        this.disposition = 0;
                }
            };
            break;
        case 'z':
            this.width = this.height = 3;
            this.structure = [
                [1, 1, 0],
                [0, 1, 1],
                [0, 0, 0]
            ];
            this.do_rotate = function () {
                switch (this.disposition) {
                    case 0:
                        this.structure = [
                            [0, 1, 0],
                            [1, 1, 0],
                            [1, 0, 0]
                        ];
                        this.disposition = 1;
                        break;
                    case 1:
                        this.structure = [
                            [1, 1, 0],
                            [0, 1, 1],
                            [0, 0, 0]
                        ];
                        this.disposition = 0;
                }
            };
            break;
        case 's':
            this.width = this.height = 3;
            this.structure = [
                [0, 1, 1],
                [1, 1, 0],
                [0, 0, 0]
            ];
            this.do_rotate = function () {
                switch (this.disposition) {
                    case 0:
                        this.structure = [
                            [1, 0, 0],
                            [1, 1, 0],
                            [0, 1, 0]
                        ];
                        this.disposition = 1;
                        break;
                    case 1:
                        this.structure = [
                            [0, 1, 1],
                            [1, 1, 0],
                            [0, 0, 0]
                        ];
                        this.disposition = 0;
                }
            };
            break;
        case 'l':
            this.width = this.height = 3;
            this.structure = [
                [0, 0, 1],
                [1, 1, 1],
                [0, 0, 0]
            ];
            this.do_rotate = function () {
                switch (this.disposition) {
                    case 0:
                        this.structure = [
                            [1, 0, 0],
                            [1, 0, 0],
                            [1, 1, 0]
                        ];
                        this.disposition = 1;
                        break;
                    case 1:
                        this.structure = [
                            [1, 1, 1],
                            [1, 0, 0],
                            [0, 0, 0]
                        ];
                        this.disposition = 2;
                        break;
                    case 2:
                        this.structure = [
                            [1, 1, 0],
                            [0, 1, 0],
                            [0, 1, 0]
                        ];
                        this.disposition = 3;
                        break;
                    case 3:
                        this.structure = [
                            [0, 0, 1],
                            [1, 1, 1],
                            [0, 0, 0]
                        ];
                        this.disposition = 0;
                }
            };
            break;
        case 'j':
            this.width = this.height = 3;
            this.structure = [
                [1, 0, 0],
                [1, 1, 1],
                [0, 0, 0]
            ];
            this.do_rotate = function () {
                switch (this.disposition) {
                    case 0:
                        this.structure = [
                            [1, 1, 0],
                            [1, 0, 0],
                            [1, 0, 0]
                        ];
                        this.disposition = 1;
                        break;
                    case 1:
                        this.structure = [
                            [1, 1, 1],
                            [0, 0, 1],
                            [0, 0, 0]
                        ];
                        this.disposition = 2;
                        break;
                    case 2:
                        this.structure = [
                            [0, 1, 0],
                            [0, 1, 0],
                            [1, 1, 0]
                        ];
                        this.disposition = 3;
                        break;
                    case 3:
                        this.structure = [
                            [1, 0, 0],
                            [1, 1, 1],
                            [0, 0, 0]
                        ];
                        this.disposition = 0;
                }
            };
            break;
        case 'o':
            this.width = this.height = 2;
            this.structure = [
                [1, 1],
                [1, 1]
            ];
            this.do_rotate = function () {
            };
    }
    //Starting coordinates
    this.coordinates = {xx:3, yy:20};
};
tetris_globals.do_move = function () {
    var check_result = tetris_globals.piece.is_move_allowed('down');
    if (check_result === 'allow') {
        tetris_globals.moved_once = true;
        tetris_globals.piece.do_draw('down');
        tetris_globals.global_timeout = setTimeout(tetris_globals.do_move, tetris_globals.speed);
    }
    else if (check_result === 'dropped') {
        if (tetris_globals.moved_once) {
            tetris_globals.moved_once = false;
            tetris_globals.piece.lock();
            tetris_globals.if_filled();
            tetris_globals.piece = new tetris_globals.Piece(tetris_globals.next_piece);
            tetris_globals.next_piece = tetris_globals.get_random_piece();
            tetris_globals.draw_next_piece(tetris_globals.next_piece);
            tetris_globals.do_move();
        }
        else {
            tetris_globals.is_started = false;
            tetris_globals.unbind_controls();
            document.getElementById('btn_start').value = 'Start';
            console.log('Game over');
        }
    }
};
tetris_globals.Piece.prototype.is_move_allowed = function (direction) {
    var xmod, ymod;
    var element_id, element;
    switch (direction) {
        case 'down':
            xmod = 0;
            ymod = -1;
            break;
        case 'left':
            xmod = -1;
            ymod = 0;
            break;
        case 'right':
            xmod = 1;
            ymod = 0;
            break;
        default:
            xmod = ymod = 0;
    }
    for (var ii = 0; ii < this.height; ii++) {
        for (var jj = 0; jj < this.width; jj++) {
            if (this.structure[jj][ii] === 1) {
                if (this.coordinates.yy - jj !== 0) {
                    element_id = 'c' + (this.coordinates.xx + ii + xmod) + '_' + (this.coordinates.yy - jj + ymod);
                    element = document.getElementById(element_id);
                    if (direction === 'left' || direction === 'right') {
                        if ((this.coordinates.xx + ii + xmod ) < 0 || (this.coordinates.xx + ii + xmod) > 9) {
                            return 'cancel';
                        }
                        if (element.style.backgroundColor === 'gray') {
                            return 'cancel';
                        }
                    }
                    if (element.style.backgroundColor === 'gray') {
                        return 'dropped'
                    }
                }
                else if ((this.coordinates.yy - jj) < 1) {
                    if (direction !== 'left' && direction !== 'right') {
                        return 'dropped';
                    }
                }
            }
        }
    }
    return 'allow';
};
tetris_globals.is_rotation_allowed = function (coordinates, structure, width, height, do_rotate, disposition) {
    var _coordinates = {xx:coordinates.xx, yy:coordinates.yy};
    var piece_copy = {coordinates:_coordinates, structure:structure, height:height, width:width, do_rotate:do_rotate, disposition:disposition};
    piece_copy.do_rotate();
    for (var jj = 0; jj < piece_copy.height; jj++) {
        for (var ii = 0; ii < piece_copy.width; ii++) {
            if (piece_copy.structure[jj][ii] === 1) {
                var element_id = 'c' + (piece_copy.coordinates.xx + ii) + '_' + (piece_copy.coordinates.yy - jj);
                if ((piece_copy.coordinates.xx + ii) < 0 ||
                    (piece_copy.coordinates.xx + ii) > 9 ||
                    (piece_copy.coordinates.yy - jj) < 0 ||
                    (piece_copy.coordinates.yy - jj) > 19 ||
                    (document.getElementById(element_id).style.backgroundColor === 'gray')) {
                    return 'cancel';
                }
            }
        }
    }
    return 'allow';
};
tetris_globals.Piece.prototype.do_draw = function (direction) {
    var element_id, element;
    for (var ii = -1; ii < this.height + 1; ii++) {
        for (var jj = -1; jj < this.width + 1; jj++) {
            if ((this.coordinates.xx + ii) >= 0 && (this.coordinates.xx + ii) < 10 &&
                (this.coordinates.yy - jj + 1 ) >= 0 && (this.coordinates.yy - jj + 1 ) < 20) {
                element_id = 'c' + (this.coordinates.xx + ii) + '_' + (this.coordinates.yy - jj + 1 );
                element = document.getElementById(element_id);
                if (element.style.backgroundColor === 'black') {
                    element.style.backgroundColor = 'white';
                }
            }
        }
    }
    switch (direction) {
        case 'down':
            this.coordinates.yy--;
            break;
        case 'left':
            this.coordinates.xx--;
            break;
        case 'right':
            this.coordinates.xx++;
    }
    for (ii = 0; ii < this.height; ii++) {
        for (jj = 0; jj < this.width; jj++) {
            if (this.structure[jj][ii] === 1) {
                element_id = 'c' + (this.coordinates.xx + ii) + '_' + (this.coordinates.yy - jj);
                element = document.getElementById(element_id);
                element.style.backgroundColor = 'black';
            }
        }
    }
};
tetris_globals.Piece.prototype.lock = function () {
    for (var ii = 0; ii < this.height; ii++) {
        for (var jj = 0; jj < this.width; jj++) {
            if (this.structure[jj][ii] === 1) {
                var element_id = 'c' + (this.coordinates.xx + ii) + '_' + (this.coordinates.yy - jj);
                var element = document.getElementById(element_id);
                element.style.backgroundColor = 'gray';
            }
        }
    }
};
tetris_globals.if_filled = function () {
    var speed_array = [800, 770, 740, 710, 680, 650, 620, 590, 560, 530, 500, 470, 440, 410, 380, 350, 320, 290, 260, 230];
    var line_filled, jj = 0, lines_in_row = 0;
    while (jj < 20) {
        line_filled = true;
        for (var ii = 0; ii < 10; ii++) {
            var element_id = 'c' + ii + '_' + jj;
            var element = document.getElementById(element_id);
            if (element.style.backgroundColor !== 'gray') {
                line_filled = false;
                break;
            }
        }
        if (line_filled) {
            lines_in_row++;
            tetris_globals.lines_count++;
            tetris_globals.line_cleaner(jj);
        }
        else {
            switch (lines_in_row) {
                case 1:
                    tetris_globals.total_score += 100;
                    break;
                case 2:
                    tetris_globals.total_score += 225;
                    break;
                case 3:
                    tetris_globals.total_score += 550;
                    break;
                case 4:
                    tetris_globals.total_score += 800;
            }
            lines_in_row = 0;
            jj++;
        }
    }
    var speed_index = (Math.floor(tetris_globals.lines_count / 10));
    tetris_globals.speed = speed_array[speed_index];
    document.getElementById('speed_count').innerHTML = speed_index + 1;
    document.getElementById('lines_count').innerHTML = tetris_globals.lines_count;
    document.getElementById('total_score').innerHTML = tetris_globals.total_score;
};
tetris_globals.line_cleaner = function (jj) {
    for (jj; jj < 19; jj++) {
        for (var ii = 0; ii < 10; ii++) {
            var element_id = 'c' + ii + '_' + jj;
            var element_shift_id = 'c' + ii + '_' + (jj + 1);
            var element = document.getElementById(element_id);
            var element_shift = document.getElementById(element_shift_id);
            element.style.backgroundColor = element_shift.style.backgroundColor;
        }
    }
};
tetris_globals.draw_next_piece = function (piece_type) {
    var next_piece = new tetris_globals.Piece(piece_type);
    for (var jj = 0; jj < 4; jj++) {
        for (var ii = 0; ii < 4; ii++) {
            var element_id = 'n' + ii + '_' + jj;
            var element = document.getElementById(element_id);
            if (jj < next_piece.height && ii < next_piece.width && next_piece.structure[jj][ii] === 1) {
                element.style.backgroundColor = 'black';
            }
            else {
                element.style.backgroundColor = 'white';
            }
        }
    }
};
document.getElementById('btn_start').onclick = function () {
    tetris_globals.lines_count = 0;
    tetris_globals.total_score = 0;
    tetris_globals.speed = 800;
    if (!tetris_globals.is_started) {
        tetris_globals.is_started = true;
        document.getElementById('btn_start').value = 'New game';
    }
    else {
        clearTimeout(tetris_globals.global_timeout);
        document.getElementById('btn_pause').value = 'Pause';
    }
    document.getElementById('speed_count').innerHTML = 1;
    tetris_globals.unbind_controls();
    tetris_globals.bind_controls();
    tetris_globals.clear_field();
    tetris_globals.is_paused = false;
    tetris_globals.moved_once = false;
    tetris_globals.piece = new tetris_globals.Piece(tetris_globals.get_random_piece());
    tetris_globals.next_piece = tetris_globals.get_random_piece();
    tetris_globals.draw_next_piece(tetris_globals.next_piece);
    tetris_globals.do_move();
};
document.getElementById('btn_pause').onclick = function () {
    if (tetris_globals.is_started === true) {
        if (tetris_globals.is_paused === false) {
            document.getElementById('btn_pause').value = 'Continue';
            tetris_globals.unbind_controls();
            clearTimeout(tetris_globals.global_timeout);
        }
        else {
            document.getElementById('btn_pause').value = 'Pause';
            tetris_globals.bind_controls();
            tetris_globals.do_move();
        }
        tetris_globals.is_paused = !tetris_globals.is_paused;
    }
};

//TODO: Стили.
//TODO: Оптимизировать код. Поискать баги.
//TODO: Файрфокс - баг. Проверить в других браузерах.
//TODO: Холл славы.
//TODO: Интеграция с социальными сетями.
//TODO: Возможно настрока управления. Несколько вариантов.
//TODO: Больше очей при сбрасывании.
//TODO: Больше очей при увеличении скорости - не факт.
//TODO: Точнее настроить время.
