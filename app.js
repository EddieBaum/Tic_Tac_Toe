
// Wrap every letter in a span
var textWrapper = document.querySelector('.ml10 .letters');
textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

anime.timeline({loop: true})
  .add({
    targets: '.ml10 .letter',
    rotateY: [-90, 0],
    duration: 1300,
    delay: (el, i) => 45 * i
  }).add({
    targets: '.ml10',
    opacity: 0,
    duration: 1000,
    easing: "easeOutExpo",
    delay: 1000
  });



//Elements on page
var startBoard; 
let xTurn = true; 
let xoMarc = '';
let humanMove; 
let aiMove; 
const coinFlipDisplayBox = document.getElementById('coinFlipWinnerDisplay');
const headsOrTailsButtons = Array.from(document.getElementsByClassName('headsTailsButton'));
const winningMessageScreen = document.getElementById('winningMessage'); 
const winDisplayMessage = document.getElementById('winDisplayMessage');
const restartButton = document.getElementById('restartButton'); 
const cells = document.querySelectorAll('[data-cell]');
const cellsArray = Array.from(cells);

var board = Array(9).fill("");      // initialize an empty board with 9 spaces
const winningCombos = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8]
];

function checkWin(board) {                          //this function checks for 3 marcs in a row each time a player clicks a cell
    for (let combo of winningCombos) {
        if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
            setTimeout(displayWinningScreen(), 1500);
            return true;
        }
    } if (board.every(cell => cell !== "")) {
        winningMessageScreen.style.display = 'flex';
    } else {
        return false;
    }
};

function whosTurn() { 
    if (xTurn) {
        return xoMarc = 'X'
    } else 
        return xoMarc = 'O'
};

whosTurn();

//Human move function ***************************************
function handleHumanMove(e) {
    // check if the cell is empty
    if (!e.target.innerHTML) {
        // place 'X' or 'O' in the cell
        e.target.innerHTML = xoMarc;
        board[e.target.dataset.cell] = xoMarc;
        xTurn = !xTurn;
        whosTurn();
        checkWin(board);
        // after human move, call the function to make AI move
        handleAIMove();
    }
}

//AI move function 
function handleAIMove() {
    const emptyCells = board.map((cell, index) => cell === '' ? index : null)
      .filter(cell => cell !== null);
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const chosenIndex = emptyCells[randomIndex];
    const chosenCell = document.querySelector(`[data-cell="${chosenIndex}"]`);
    chosenCell.innerHTML = xoMarc;
    board[chosenIndex] = xoMarc;
    xTurn = !xTurn;
    whosTurn();
    checkWin(board);
};

function coinFlip(userChoice) {    //Start game with a coin flip to see who goes first
    let flip = Math.random(); 
    let result; 
    if (flip <= .5) {
        result = 'heads'
    } else { 
        result = 'tails'
    }
    if (userChoice === result) {
        return true;
    } else {
        return false;
    }
};
  
function displayWinningScreen() {                   //full screen that displays winner of game or tie
    winningMessageScreen.style.display = 'flex';
    winDisplayMessage.innerHTML = xoMarc + ' WINS!'
};



//Event Listener functions 
headsOrTailsButtons.forEach(button => button.addEventListener('click', (e) => {
    let userChoice = e.target.id;
    cells.forEach(cell => cell.addEventListener('click', handleHumanMove));
    if (coinFlipDisplayBox.innerHTML === '') {
        coinFlip(userChoice);
        if (coinFlip(userChoice) === true) {
            coinFlipDisplayBox.innerHTML = 'You win, you go first.';
            coinFlipDisplayBox.style.opacity = '1';
            handleHumanMove();
        } else {
            coinFlipDisplayBox.innerHTML = 'You lose, I go first.';
            coinFlipDisplayBox.style.opacity = '1';
            handleAIMove(); 
        }
        
    }
})); 

headsOrTailsButtons.forEach(button => button.addEventListener('mouseover', (e) => {
    if (coinFlipDisplayBox.innerHTML) {
        headsOrTailsButtons.style.cursor = 'not-allowed';
    }
}));

cells.forEach(cell => cell.addEventListener('mouseover', (e) => {       //hover over cell effects
    if (e.target.innerHTML) {
        e.target.style.cursor = 'not-allowed'; 
    } else {
        e.target.style.backgroundColor = '#a38ae2'; 
        e.target.style.cursor = 'pointer';
        
    }
}));

cells.forEach(cell => cell.addEventListener('mouseout', (e) => {         //reset cell effects
    e.target.style.backgroundColor = '#24134d';
}));


restartButton.addEventListener('click', () => {
    winningMessageScreen.style.display = 'none';
    cells.forEach(cell => cell.innerHTML = "");
    board = Array(9).fill("");
    coinFlipDisplayBox.innerHTML = '';
    coinFlipDisplayBox.style.opacity = '0';
    cells.forEach(cell => cell.removeEventListener("click", handleHumanMove));
});



















function minimax(board, depth, isMaximizing) {
    let result = checkWin(board);
    if (result !== false) {
      if (result === "X") {
        return -10 + depth;
      } else if (result === "O") {
        return 10 - depth;
      } else {
        return 0;
      }
    }
  
    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
          board[i] = "O";
          let score = minimax(board, depth + 1, false);
          board[i] = "";
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
          board[i] = "X";
          let score = minimax(board, depth + 1, true);
          board[i] = "";
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  }









































/* CHAT GPT GUID TO CREAT TIC TAC TOE

Making a tic-tac-toe game with JavaScript involves several steps:

-1.Creating the game board: This can be done using HTML and CSS to create a 3x3 grid of cells, each of which can be clicked to make a move.
2.Adding event listeners to the cells: Use JavaScript to add an event listener to each cell that listens for a click event and updates the cell's contents accordingly.
3.Keeping track of moves: You'll need a way to keep track of which player's turn it is and which cells have been played. You can use variables and arrays to store this information.
4.Checking for a win: After each move, you'll need to check if either player has won the game by getting three in a row. You can use nested loops and conditional statements to check for a win.
5.Displaying the winner: If a player wins the game, you'll need to display a message indicating who won.
6.Here's a simplified example of what the JavaScript code for a tic-tac-toe game might look like:

let cells = document.querySelectorAll('[data-cell]');
let cellsArray = Array.from(cells);
let xIsNext = true;

cellsArray.forEach(cell => {
  cell.addEventListener("click", handleClick);
});

function handleClick(e) {
  let cell = e.target;
  let currentClass = xIsNext ? "x" : "o";
  cell.classList.add(currentClass);
  cell.innerHTML = currentClass;
  xIsNext = !xIsNext;
}
  */
