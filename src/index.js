import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  return (
    <button
      className={`square ${props.win ? "win" : ""}`}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        win={this.props.winnerLine.indexOf(i) >= 0}
      />
    );
  }

  render() {
    let boardRows = [];
    let boardRow = [];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        boardRow = boardRow.concat(this.renderSquare(i * 3 + j));
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
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          point: "",
          player: ""
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      historyOrderAsc: true,
      winnerLine: []
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[this.state.stepNumber];
    const squares = current.squares.slice();
    const [winner] = calculateWinner(squares);
    if (winner) {
      return;
    }
    if (squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
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

    this.setState({
      history: history.concat([
        {
          squares: squares,
          point: point,
          player: player
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0
    });
  }

  changeHistoryOrder() {
    const historyOrderAsc = this.state.historyOrderAsc;
    this.setState({
      historyOrderAsc: !historyOrderAsc
    });
  }

  reset() {
    this.setState({
      history: [
        {
          squares: Array(9).fill(null),
          point: "",
          player: ""
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      historyOrderAsc: true,
      winnerLine: []
    });
  }

  render() {
    let history = this.state.history;
    const current = history[this.state.stepNumber];
    const [winner, line] = calculateWinner(current.squares);
    const historyOrderAsc = this.state.historyOrderAsc;
    let moves = history.map((step, move) => {
      const desc = move
        ? `Go to move #${move} by ${step.player} ${step.point}`
        : `Go to game start`;
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>
            <span className={this.state.stepNumber === move ? "current" : ""}>
              {desc}
            </span>
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
          ? `Next player: ${this.state.xIsNext ? "X" : "O"}`
          : "Even";
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winnerLine={line}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
          <button onClick={() => this.changeHistoryOrder()}>
            history order change
          </button>
          <span>{this.state.historyOrderAsc ? "asc" : "desc"}</span>
        </div>
        <div>
          <button onClick={() => this.reset()}>reset</button>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
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
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], lines[i]];
    }
  }
  return [null, []];
}
