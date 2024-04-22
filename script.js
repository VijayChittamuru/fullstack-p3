// Codepen's infinite loop protection was giving a false-positive for checkTie() in devtools
// This is here to prevent the false-positive
window.CP.PenTimer.MAX_TIME_IN_LOOP_WO_EXIT = 4000;

document.addEventListener("DOMContentLoaded", () => {
	const rows = 6;
	const cols = 7;
	const board = [];
	const gameBoard = document.getElementById("gameBoard");
	const resetBoardButton = document.getElementById("resetBoardButton");
	const resetScoreButton = document.getElementById("resetScoreButton");
	const turnIndicator = document.getElementById("turnIndicator");
	let currentPlayer = "red";
	let gameActive = true;

	toastr.options = {
		closeButton: true,
		positionClass: "toast-bottom-right",
	};

	function initializeBoard() {
		for (let row = 0; row < rows; row++) {
			const currentRow = [];
			for (let col = 0; col < cols; col++) {
				const cell = document.createElement("div");
				cell.classList.add("cell");
				cell.dataset.column = col;
				cell.dataset.row = row;
				gameBoard.appendChild(cell);
				currentRow.push(null);
				cell.addEventListener("click", () => placePiece(col));
			}
			board.push(currentRow);
		}
	}

	function placePiece(col) {
		if (!gameActive) {
			toastr.error("Please reset the board to play again");
			return;
		}
		for (let row = rows - 1; row >= 0; row--) {
			if (!board[row][col]) {
				board[row][col] = currentPlayer;
				const cell = document.querySelector(
					`.cell[data-row="${row}"][data-column="${col}"]`
				);
				const piece = document.createElement("div");
				piece.classList.add(currentPlayer);
				cell.appendChild(piece);

				if (checkWin(row, col)) {
					turnIndicator.textContent = `${currentPlayer.toUpperCase()} wins!`;
					gameActive = false;
					gameOver = true;
					updateScores(currentPlayer);
					return;
				}

				if (checkTie()) {
					turnIndicator.textContent = "It's a TIE!";
					gameOver = true;
					gameActive = false;
					return;
				}

				currentPlayer = currentPlayer === "red" ? "yellow" : "red";
				break;
			}
		}
		turnIndicator.textContent = `${currentPlayer.toUpperCase()}'s Turn`;
	}

	function checkWin(row, col) {
		// Check all directions from given piece to see if someone has won
		return (checkDirection(row, col, 0, 1) + checkDirection(row, col, 0, -1) + 1 >= 4 || // Horizontal
				checkDirection(row, col, 1, 0) + checkDirection(row, col, -1, 0) + 1 >= 4 || // Vertical
				checkDirection(row, col, 1, 1) + checkDirection(row, col, -1, -1) + 1 >= 4 || // Diagonal \
				checkDirection(row, col, 1, -1) + checkDirection(row, col, -1, 1) + 1 >= 4) // Diagonal /
	}
	
	function checkDirection(row, col, rowIncrement, colIncrement) {
		let count = 0;
		let r = row + rowIncrement;
		let c = col + colIncrement;
		while (
			r >= 0 &&
			r < rows &&
			c >= 0 &&
			c < cols &&
			board[r][c] === currentPlayer
		) {
			count++;
			r += rowIncrement;
			c += colIncrement;
		}
		return count;
	}

	function checkTie() {
		for (let i = 0; i < cols; i++) {
			if (board[0][i] === null) {
				return false;
			}
		}
		return true;
	}

	function updateScores(winningPlayer) {
		const scoreId = winningPlayer === "red" ? "redScore" : "yellowScore";
		const scoreElement = document.getElementById(scoreId);
		let currentScore = parseInt(scoreElement.textContent, 10);
		scoreElement.textContent = currentScore + 1;
	}

	resetBoardButton.addEventListener("click", resetBoard);

	function resetBoard() {
		gameActive = true;
		board.forEach((row) => row.fill(null));
		document.querySelectorAll(".cell").forEach((cell) => (cell.innerHTML = ""));
		currentPlayer = (currentPlayer === "red" ? "yellow" : "red");
		turnIndicator.textContent = `${currentPlayer.toUpperCase()}'s Turn`;
		toastr.info("Board has been reset.");
	}

	resetScoreButton.addEventListener("click", resetScores);
	function resetScores() {
		const redScore = document.getElementById("redScore");
		const yellowScore = document.getElementById("yellowScore");
		redScore.textContent = 0;
		yellowScore.textContent = 0;
		toastr.info("Scores have been reset.");
	}
	
	initializeBoard();
});
