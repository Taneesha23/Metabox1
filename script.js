// ---------- Constants ----------

// Every possible winning line, as board positions 0-8:
//   0 | 1 | 2
//   3 | 4 | 5
//   6 | 7 | 8
const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6]             // diagonals
];

// ---------- Game state ----------

let board = Array(9).fill("");   // "" = empty, otherwise "X" or "O"
let startingPlayer = "X";        // who starts the current round (alternates)
let currentPlayer = "X";         // whose turn it is right now
let gameOver = false;            // true after a win or a draw
let winningLine = [];            // the 3 winning positions, if any

// The score is NOT reset by a new round
const score = { X: 0, O: 0, draws: 0 };

// ---------- Page elements ----------

const boardElement = document.getElementById("board");
const statusElement = document.getElementById("status");
const scoreXElement = document.getElementById("score-x");
const scoreOElement = document.getElementById("score-o");
const scoreDrawElement = document.getElementById("score-draw");
const newRoundButton = document.getElementById("new-round");
const resetScoresButton = document.getElementById("reset-scores");

// ---------- Setup ----------

// Create the 9 squares once. Each is a <button> so it works with the keyboard too.
const squares = [];
for (let i = 0; i < 9; i++) {
  const square = document.createElement("button");
  square.type = "button";
  square.className = "square";
  square.setAttribute("aria-label", "Square " + (i + 1));
  square.addEventListener("click", () => handleSquareClick(i));
  boardElement.appendChild(square);
  squares.push(square);
}

newRoundButton.addEventListener("click", startNewRound);
resetScoresButton.addEventListener("click", resetScores);

// ---------- Game logic ----------

function handleSquareClick(index) {
  // Ignore clicks on filled squares or after the round has ended
  if (board[index] !== "" || gameOver) {
    return;
  }

  // Place the current player's mark
  board[index] = currentPlayer;

  // Check for a win FIRST (a full board can still be a win)
  const line = findWinningLine();
  if (line) {
    gameOver = true;
    winningLine = line;
    score[currentPlayer]++;          // runs once, because the board locks right after
    statusElement.textContent = currentPlayer + " wins!";
  } else if (board.every((cell) => cell !== "")) {
    gameOver = true;
    score.draws++;
    statusElement.textContent = "Draw";
  } else {
    // Round continues: switch player
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusElement.textContent = currentPlayer + "'s turn";
  }

  render();
}

// Returns the winning line (e.g. [0, 1, 2]) or null if nobody has won
function findWinningLine() {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (board[a] !== "" && board[a] === board[b] && board[a] === board[c]) {
      return line;
    }
  }
  return null;
}

function startNewRound() {
  // Alternate who starts: X, then O, then X, ...
  startingPlayer = startingPlayer === "X" ? "O" : "X";

  board = Array(9).fill("");
  currentPlayer = startingPlayer;
  gameOver = false;
  winningLine = [];
  statusElement.textContent = currentPlayer + "'s turn";
  render();
}

// Sets all scores back to 0. The board and the current round are left alone.
function resetScores() {
  score.X = 0;
  score.O = 0;
  score.draws = 0;
  render();
}

// ---------- Drawing the page ----------

// Update the page so it matches the current game state
function render() {
  squares.forEach((square, i) => {
    const mark = board[i];
    square.textContent = mark;
    square.className = "square";
    if (mark === "X") square.classList.add("x");
    if (mark === "O") square.classList.add("o");
    if (winningLine.includes(i)) square.classList.add("win");

    // Disabled squares can't be clicked or focused
    square.disabled = mark !== "" || gameOver;
  });

  scoreXElement.textContent = score.X;
  scoreOElement.textContent = score.O;
  scoreDrawElement.textContent = score.draws;
}

render();
