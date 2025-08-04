import Ship from './ship.js'

function gameboard() {
  const board = Array(10) // 2D array
        .fill(null) 
        .map(() => Array(10).fill(null)); 
  const ships = [];
  const missed = [];

  function placeShip(x, y, length, horizontal=true) {
    for (let i=0; i < length; i++) {
      const coordX = horizontal ? x + i : x; 
      const coordY = horizontal ? y : y + i; 

      if (coordX >= board.length || coordY >= board.length) {
        throw new Error("Out of bounds.")
      }

      if (board[coordY][coordX]) {
        throw new Error("Overlap.")
      }
    }

    // place the ship
    const ship = Ship(length)
    for (let i=0; i < length; i++) {
      const coordX = horizontal ? x + i : x; 
      const coordY = horizontal ? y : y + i; 
      board[coordY][coordX] = {
        ship,
        index: i,
        hit: false,
      };
    }
    ships.push(ship)
  }

  function receiveAttack(x,y) {
    const target = board[y][x];

    if (target === null) {
      missed.push([x,y])
      return false;
    } 

    if (target.ship && typeof target.ship.hit === 'function') {
      target.hit = true;
      target.ship.hit(target.index);
      return true;
    }

    return false;
  }

  function isDefeated() {
    return ships.length > 0 && ships.every(ship => ship.isSunk())
  }


  return {
    placeShip,
    receiveAttack,
    isDefeated,
    board,
    ships,
    missed,

  }
}

export default gameboard;

//                     0 x,x,x,x,x,x,x,x,x,x
//                     1 x,x,x,x,x,x,x,x,x,x
//                     2 x,x,x,x,x,x,x,x,x,x
//                     3 x,x,x,x,x,x,x,x,x,x
//                     4 x,x,x,x,x,x,x,x,x,x
//                     5 x,x,x,x,x,x,x,x,x,x
//                     6 x,x,x,x,x,x,x,x,x,x
//                     7 x,x,x,x,x,x,x,x,x,x
//                     8 x,x,x,x,x,x,x,x,x,x
//                     9 x,x,x,x,x,x,x,x,x,x
//                       0 1 2 3 4 5 6 7 8 9

