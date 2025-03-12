const startScreen = document.getElementById('start-screen');
const gameContainer = document.getElementById('game-container');
const board = document.getElementById('game-board');
const message = document.getElementById('message');
const resetBtn = document.getElementById('reset-btn');
const playerScoreEl = document.getElementById('player-score');
const computerScoreEl = document.getElementById('computer-score');
const winnerMessage = document.getElementById('winner-message');

let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let playerScore = 0;
let computerScore = 0;
let computerStarts = false; // Bilgisayarın başlayıp başlamadığını takip etmek için

document.getElementById('player-start').addEventListener('click', () => startGame('X', false));
document.getElementById('computer-start').addEventListener('click', () => startGame('O', true));

function startGame(firstPlayer, isComputerStarting) {
    startScreen.style.display = 'none';
    gameContainer.style.display = 'block';
    currentPlayer = firstPlayer;
    computerStarts = isComputerStarting;
    message.textContent = `Sıra: ${currentPlayer}`;
    createBoard();
    if (isComputerStarting) computerMove();
}

function createBoard() {
    board.innerHTML = '';
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.setAttribute('data-index', i);
        cell.addEventListener('click', handleCellClick);
        board.appendChild(cell);
    }
}

function handleCellClick(e) {
    const index = e.target.getAttribute('data-index');
    if (gameBoard[index] === '' && gameActive && currentPlayer === 'X') {
        makeMove(index, 'X');
        if (gameActive) computerMove();
    }
}

function makeMove(index, player) {
    gameBoard[index] = player;
    document.querySelector(`[data-index="${index}"]`).textContent = player;
    checkWinner();
    if (gameActive) {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        message.textContent = `Sıra: ${currentPlayer}`;
    }
}

function computerMove() {
    if (!gameActive) return;
    const bestMove = findBestMove();
    setTimeout(() => makeMove(bestMove, 'O'), 500);
}

function findBestMove() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 9; i++) {
        if (gameBoard[i] === '') {
            gameBoard[i] = 'O';
            let score = minimax(gameBoard, 0, false);
            gameBoard[i] = '';
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function minimax(board, depth, isMaximizing) {
    const result = checkResult();
    if (result !== null) {
        if (result === 'O') return 10 - depth;
        if (result === 'X') return -10 + depth;
        return 0; // Beraberlik
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkResult() {
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Satırlar
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Sütunlar
        [0, 4, 8], [2, 4, 6]             // Çaprazlar
    ];

    for (let condition of winConditions) {
        const [a, b, c] = condition;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            return gameBoard[a];
        }
    }

    if (!gameBoard.includes('')) return 'tie';
    return null;
}

function checkWinner() {
    const result = checkResult();
    if (result !== null) {
        gameActive = false;
        if (result === 'X') {
            message.textContent = 'X kazandı!';
            updateScore('X');
        } else if (result === 'O') {
            message.textContent = 'O kazandı!';
            updateScore('O');
        } else {
            message.textContent = 'Berabere!';
        }
    }
}

function updateScore(winner) {
    if (winner === 'X') playerScore++;
    else if (winner === 'O') computerScore++;
    playerScoreEl.textContent = playerScore;
    computerScoreEl.textContent = computerScore;

    if (playerScore === 3) endGame('Tebrikler, siz kazandınız!');
    else if (computerScore === 3) endGame('Bilgisayar kazandı!');
}

function endGame(text) {
    winnerMessage.textContent = text;
    winnerMessage.classList.add('show');
    board.style.pointerEvents = 'none';
}

function resetGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = computerStarts ? 'O' : 'X';
    message.textContent = `Sıra: ${currentPlayer}`;
    winnerMessage.classList.remove('show');
    board.style.pointerEvents = 'auto';
    createBoard();
    if (computerStarts && playerScore < 3 && computerScore < 3) computerMove();
}

resetBtn.addEventListener('click', resetGame);