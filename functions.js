// object to save the state of the table
var table = {
    "pole": []
};

// save current object
var currentCell = null;

var timer = 0;

// number of guessed pairs
var numPairsFound = 0;

//run function
function startGame() {
    numPairsFound = 0;
    // white fill
    table.pole = new Array(4);
    for (var i = 0; i < 4; i++) {
        table.pole[i] = new Array(4);
        for (var j = 0; j < 4; j++) {
            table.pole[i][j] = "white";
        }
    }

    // array colors
    var color = ["green", "red", "black", "yellow", "blue", "sienna", "purple", "#b0e0e6"];

    var colorNull = 0;

    // filling the playing field
    while (colorNull != 8) {

        // we get a random color
        var iter = randomInteger(0, color.length - 1);
        if (getColorNull(color) > 0 && getColorNull(color) < 8) {
            while (color[iter] == null) {
                iter = randomInteger(0, color.length - 1);
            }
        }

        // we get a random cell
        var ii = randomInteger(0, 3);
        var jj = randomInteger(0, 3);

        // set color for cell
        if (!isColor(table.pole, color[iter])) {

            // add new color only instead of white
            if (table.pole[ii][jj] == "white") {
                table.pole[ii][jj] = color[iter];
                var id = ii + ";" + jj;
                setColor(color[iter], id);
            }
        } else {
            color[iter] = null;
            colorNull = getColorNull(color);
        }
    }

    //hide colors in 10 seconds
    setTimeout("viewColor(null)", 10000);

    // run timer in 10 seconds
    setTimeout("runTimer()", 10000);
}

// run timer
function runTimer() {
    timer = new Date().getTime();

    var interval = setInterval(function () {
        if (timer == 0) return;
        var time = (new Date().getTime() - timer) / 1000;
        document.getElementById('timer').innerHTML = time;
        if (numPairsFound == 8) {
            var message = "Вы выиграли:\n Затраченное время: " + time;
            alert(message);
            timer = 0;
            setTimeout(function () {
                document.getElementById('timer').innerHTML = 0;
                viewColor(null)
            }, 5000)
        }
    }, 100);
}

// counts the number of colors used
function getColorNull(color) {
    var colorNull = 0;
    for (var kk = 0; kk < color.length; kk++) {
        if (color[kk] == null) {
            colorNull++;
        }
    }
    return colorNull;
}


function viewColor(tableCalls) {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            var id = i + ";" + j;
            if (tableCalls == null) {
                setColor("white", id);
            } else {
                if (tableCalls[i][j] != null) {
                    setColor(tableCalls[i][j], id);
                }
            }
        }
    }
}

// set color for cell
function setColor(color, id) {
    if (color != null) {
        var cell = document.getElementById(id);
        cell.setAttribute("style", "background: " + color);

        // add function
        if (cell.getAttribute("onclick") == null) {
            cell.setAttribute("onclick", "activeCell(this)");
        }
    }
}


function randomInteger(min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand;
}

// checks whether it is possible to add color to the table
function isColor(matr, color) {
    var count = 0;
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (matr[i][j] == color) {
                count = count + 1;
            }
        }
    }
    return count == 2;
}

//starts when a cell is selected
function activeCell(r) {

    // get id current cell
    var id = r.getAttribute("id");

    // get i,j in id
    var coord = id.split(";");
    var i = coord[0];
    var j = coord[1];

    //check if in memory cell
    if (currentCell == null) {
        //open the selected cell
        setColor(table.pole[i][j], id);

        // save cell
        currentCell = r;
    } else {
        //open the selected cell
        setColor(table.pole[i][j], id);

        // check colors in open cells
        setTimeout(function () {
                if (currentCell.getAttribute("style") != r.getAttribute("style")) {
                    // hide cells
                    setColor("white", id);
                    setColor("white", currentCell.getAttribute("id"));
                } else {
                    // check the id of the cells if they do not match, we believe that a pair of colors was found
                    if (currentCell.getAttribute("id") != r.getAttribute("id")) {
                        numPairsFound++;
                    }
                }
                currentCell = null;
            }
            , 200)
    }
}
