import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}
  
class Board extends React.Component {
    renderSquare(i, posi) {
      return (
        <Square 
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i, posi)}    
        />
      );
    }
  
    render() {
      return (
        <div>
          <div className="status"></div>
          <div className="board-row">
            {this.renderSquare(0, [0,0])}
            {this.renderSquare(1, [0,1])}
            {this.renderSquare(2, [0,2])}
          </div>
          <div className="board-row">
            {this.renderSquare(3, [1,0])}
            {this.renderSquare(4, [1,1])}
            {this.renderSquare(5, [1,2])}
          </div>
          <div className="board-row">
            {this.renderSquare(6, [2,0])}
            {this.renderSquare(7, [2,1])}
            {this.renderSquare(8, [2,2])}
          </div>
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [{
          squares: Array(9).fill(null),
          position: null
        }],
        xIsNext: true,
        stepNumber: 0,
      };
    }

    handleClick(i, posi) {
      const history = this.state.history.slice(0,this.state.stepNumber + 1);
      const current = history[history.length - 1]
      const squares = current.squares.slice();
      if (calculateWinner(squares) || squares[i]){
        return;
      }
      squares[i] = this.state.xIsNext ? 'X' : 'O';
      this.setState({
        history: history.concat([{
          squares: squares,
          position: posi
        }]),        
        xIsNext: !this.state.xIsNext,
        stepNumber: history.length,
      });
    }

    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      });
    }
    
    render() {
      let status;
      const history = this.state.history;
      const current = history[this.state.stepNumber]
      const winner = calculateWinner(current.squares);

      console.log(current)
      
      const moves = history.map((step, move) => {
        
        const desc = move ? 
          'go to move #' + move + ` position [${ step.position }]` :
          'go to game start';
        return (
          
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{
            move !== this.state.stepNumber ? desc : <b>{desc}</b>
            }</button> 
          </li> 

        )
      })

      if(winner) {
        status = "Winner: " + winner;
      } else {
        status = "Next player: " + (this.state.xIsNext ? "X" : "O");
      }

      return (
        <div className="game">
          <div className="game-board">
            <Board 
              squares={current.squares}
              onClick={(i, posi) => this.handleClick(i, posi)}     
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
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  


function calculateWinner(squares) {
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