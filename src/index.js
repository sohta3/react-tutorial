import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square({ win, onClick, value }) {
  return (
    <button className={`square ${win ? "win" : ""}`} onClick={onClick}>
      {value}
    </button>
  );
}

function Board({ squares, onClick, winnerLine }) {
  const renderSquare = i => {
    return (
      <Square
        key={i}
        value={squares[i]}
        onClick={() => onClick(i)}
        win={winnerLine.indexOf(i) >= 0}
      />
    );
  };

  let boardRows = [];
  let boardRow = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      boardRow = boardRow.concat(renderSquare(i * 3 + j));
    }
    boardRows = boardRows.concat(
      <div className="board-row" key={i}>
        {boardRow}
      </div>
    );
    boardRow = [];
  }
  return <div>{boardRows}</div>;
}

function Game() {
  const [history, setHistory] = useState([
    {
      squares: Array(9).fill(null),
      point: "",
      player: ""
    }
  ]);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);
  const [historyOrderAsc, setHistoryOrderAsc] = useState(true);
  const [winnerLine, setWinnerLine] = useState([]);

  const calculateWinner = squares => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return [squares[a], lines[i]];
      }
    }
    return [null, []];
  };

  const handleClick = i => {
    // const history = history.slice(0, stepNumber + 1);
    const current = history[stepNumber];
    const squares = current.squares.slice();
    const [winner] = calculateWinner(squares);
    if (winner) {
      return;
    }
    if (squares[i]) {
      return;
    }
    squares[i] = xIsNext ? "X" : "O";
    const player = squares[i];

    let point = "";
    switch (i) {
      case 0:
        point = "col:1, row:1";
        break;
      case 1:
        point = "col:2, row:1";
        break;
      case 2:
        point = "col:3, row:1";
        break;
      case 3:
        point = "col:1, row:2";
        break;
      case 4:
        point = "col:2, row:2";
        break;
      case 5:
        point = "col:3, row:2";
        break;
      case 6:
        point = "col:1, row:3";
        break;
      case 7:
        point = "col:2, row:3";
        break;
      case 8:
        point = "col:3, row:3";
        break;
      default:
        break;
    }

    setHistory(
      history.concat([
        {
          squares: squares,
          point: point,
          player: player
        }
      ])
    );

    setStepNumber(history.length);
    setXIsNext(!xIsNext);
  };

  const jumpTo = step => {
    setStepNumber(step);
    setXIsNext(step % 2 === 0);
  };

  const changeHistoryOrder = () => {
    setHistoryOrderAsc(!historyOrderAsc);
  };

  const reset = () => {
    setHistory([
      {
        squares: Array(9).fill(null),
        point: "",
        player: ""
      }
    ]);
    setStepNumber(0);
    setXIsNext(true);
    setHistoryOrderAsc(true);
    setWinnerLine([]);
  };

  const current = history[stepNumber];
  const [winner, line] = calculateWinner(current.squares);
  let moves = history.map((step, move) => {
    const desc = move
      ? `Go to move #${move} by ${step.player} ${step.point}`
      : `Go to game start`;
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>
          <span className={stepNumber === move ? "current" : ""}>{desc}</span>
        </button>
      </li>
    );
  });

  if (!historyOrderAsc) {
    moves = moves.reverse();
  }

  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else {
    status =
      current.squares.indexOf(null) >= 0
        ? `Next player: ${xIsNext ? "X" : "O"}`
        : "Even";
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={current.squares}
          winnerLine={line}
          onClick={i => handleClick(i)}
        />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
        <button onClick={() => changeHistoryOrder()}>
          history order change
        </button>
        <span>{historyOrderAsc ? "asc" : "desc"}</span>
      </div>
      <div>
        <button onClick={() => reset()}>reset</button>
      </div>
    </div>
  );
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
