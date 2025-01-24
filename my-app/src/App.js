import './app.css';
import { useState, useRef } from 'react';

function App() {
	const rows = 50;
	const cols = 50;

	const [matrix, setMatrix] = useState(createRandomMatrix(rows, cols));
	const [isRunning, setIsRunning] = useState(false);
	const intervalRef = useRef(null);

	function createRandomMatrix(rows, cols) {
		return Array.from({ length: rows }, () =>
			Array.from({ length: cols }, () => (Math.random() > 0.85 ? 1 : 0))
		);
	}

	function findNeighbors(matrix, x, y) {
		let neighbors = 0;
		const rows = matrix.length;
		const cols = matrix[0].length;

		const directions = [
			[-1, -1], [-1, 0], [-1, 1],
			[0, -1], [0, 1],
			[1, -1], [1, 0], [1, 1],
		];

		for (const [dx, dy] of directions) {
			const nx = x + dx;
			const ny = y + dy;

			if (nx >= 0 && nx < rows && ny >= 0 && ny < cols) {
				neighbors += matrix[nx][ny];
			}
		}

		return neighbors;
	}

	const updateMatrix = () => {
		setMatrix((matrix) => {
			const newMatrix = matrix.map((arr) => [...arr]);

			for (let x = 0; x < matrix.length; x++) {
				for (let y = 0; y < matrix[x].length; y++) {
					const neighbors = findNeighbors(matrix, x, y);

					if (matrix[x][y] === 1) {
						if (neighbors < 2 || neighbors > 3) {
							newMatrix[x][y] = 0;
						}
					} else {
						if (neighbors === 3) {
							newMatrix[x][y] = 1;
						}
					}
				}
			}

			return newMatrix;
		});
	};

	const startGame = () => {
		setIsRunning(true);
		intervalRef.current = setInterval(updateMatrix, 100);
	};

	const stopGame = () => {
		setIsRunning(false);
		clearInterval(intervalRef.current);
	};

	const randomFill = () => {
		stopGame();
		setMatrix(createRandomMatrix(rows, cols));
	};

	const clearGame = () => {
		stopGame();
		setMatrix(Array.from({ length: rows }, () => Array(cols).fill(0)));
	}

	return (
		<div className='game'>
			<div className="grid">
				{matrix.map((row) =>
					row.map((cell, colIndex) => (
						<div
							key={colIndex}
							className={`cell ${cell === 1 ? 'active' : ''}`}
						></div>
					))
				)}
			</div>
			<div className="controls">
				<button onClick={startGame} disabled={isRunning}>Старт</button>
				<button onClick={stopGame} disabled={!isRunning}>Стоп</button>
				<button onClick={() => randomFill()}>случайно заполнить</button>
				<button onClick={() => clearGame()}>очистить</button>
			</div>
		</div>
	);
}

export default App;
