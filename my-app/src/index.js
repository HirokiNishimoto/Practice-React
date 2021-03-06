import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  // props（onClick, value)を受け取ってSquaeのJXSを返す
  return (
    <button
      className="square"
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  
  renderSquare(i) {
    // Squares are hold as list. This function receive index i (int) and return Square property.
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    // This fuctio n display 9 squares with renderSquare function.
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    // This functioln is called when the class where this function belong, initializing variables and properties.
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        places: Array(10).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    // when the bottun is clicked, inner state is changed.
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const places = current.places.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    places[this.state.stepNumber] = i;
    this.setState({
      history: history.concat(
        [
          {
            squares: squares,
            places: places,
          }
        ]
      ),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      const pair = i2cr(step.places[move-1])
      const place = !move ? null : 'Place : (' + pair[0] + ',' +pair[1] + ')' 
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>
            <div>{desc}</div>
            <div>{place}</div> 
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  // receive squares list and judge if the game is finished or not.
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}



ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

// 追加機能；履歴内のそれぞれの着手の位置を (col, row) というフォーマットで表示する。

function i2cr(i) {
  const pair = [Math.floor(i / 3) + 1, i % 3 + 1];
  return pair;
}

for (let i = 0; i < 9; i++) {
console.log(i2cr(i))
}