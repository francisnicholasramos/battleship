const ui = (() => {
  function renderBoard(gboard, container, isComputer) {
    container.innerHTML = '';

    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.x = x;
        cell.dataset.y = y;
 
        if (isComputer) {
          cell.classList.add('ai-cell');
        }

        const square = gboard.board[y][x];

        // add hit mark on board
        if (square && square.ship && square.hit) {
          cell.classList.add('hit');
        } 

        // place ship in human's board
        else if (square && square.ship && !isComputer) {
          cell.classList.add('ship');
        }  

        // add missed mark on board
        else if (gboard.missed.some(([mx, my]) => mx === x && my === y)) {
          cell.classList.add('miss');
        }

        if (isComputer) {
          cell.style.backgroundColor = ''
        } 

        else if (square && container.id === 'player1') {
          cell.style.backgroundColor = 'lightblue'
        }

        else if (square && container.id === 'player2') {
          cell.style.backgroundColor = '#f7d76e'
        }

        container.appendChild(cell);
      }
    }
  }

  function chooseMode(callback) {
    const playerName1 = document.querySelector('#grid1')
    const playerName2 = document.querySelector('#grid2')

    // TWO PLAYER
    document.querySelector('.two-player').addEventListener('click', () => {
      document.querySelector('.single-player').remove();
      document.querySelector('.two-player').remove();

      document.getElementById('ai-board').remove();

      document.getElementById('message').textContent = '';

      playerName1.textContent = 'Player 1'
      playerName2.textContent = `Player 2`

      callback(false); 
    })

    // SINGLE PLAYER
    document.querySelector('.single-player').addEventListener('click', () => {
      document.querySelector('.single-player').remove();
      document.querySelector('.two-player').remove();

      playerName1.textContent = 'Your board'
      playerName2.textContent = `AI's board`

      document.getElementById('message').textContent = '';

      document.getElementById('ai-board').style.display = 'grid';

      callback(true);
    })

  }

  function domShips() {
    const container = document.querySelector('.switchContainer')
    const player1 = document.querySelector('.human'); 
    const player2 = document.querySelector('.ai'); 
    let btn1 = document.createElement('button');
    let btn2 = document.createElement('button');

    const ships = [
      {id: 'carrier', name: 'Carrier [5]', length: 5 }, 
      {id: 'battleship', name: 'Battleship [4]', length: 4 }, 
      {id: 'cruiser', name: 'Cruiser [3]', length: 3 }, 
      {id: 'submarine', name: 'Submarine [3]', length: 3 }, 
      {id: 'destroyer', name: 'Destroyer [2]', length: 2 } 
    ];

    btn1.textContent = 'Horizontal';
    btn1.classList.add('switch');

    btn2.textContent = 'Horizontal';
    btn2.classList.add('switch');
    btn2.classList.add('sw2');

    for (let i = 0; i < 5; i++) {
    let ships1 = document.createElement('div');
      player1.appendChild(ships1);
      ships1.classList.add('ships');
      ships1.textContent = ships[i].name;
      ships1.setAttribute('id', ships[i].id)
      ships1.setAttribute('data-length', ships[i].length);
      ships1.setAttribute('draggable', true);


    let ships2 = document.createElement('div');
      player2.appendChild(ships2);
      ships2.classList.add('ships2');
      ships2.classList.add('test');
      ships2.textContent = ships[i].name;
      ships2.setAttribute('id', ships[i].id+`${i+1}`)
      ships2.setAttribute('data-length', ships[i].length);
      ships2.setAttribute('draggable', true);
    }

    container.appendChild(btn1);
  } 

  function disableShipsForAi() {
    document.querySelectorAll('.test').forEach(ship => ship.remove());
  }

  // blind boards
  function createBoards() {
    const player1 = document.querySelector('.human');
    const player2 = document.querySelector('.ai');

    const boards = []; 

    for (let i = 0; i < 2; i++) {
      const board = document.createElement('div');
      board.classList.add('board');
      board.setAttribute('id', `showBoard${i+1}`);
      boards.push(board); 
    }

    player1.appendChild(boards[0]); 
    player2.appendChild(boards[1]); 
  }

  function disabled() {
    document.querySelectorAll('.cell').forEach(cell => {
      cell.style.pointerEvents = 'none';
      cell.style.opacity = '0.5'; 
    })
  }

  function message(text) {
    document.querySelector('#message').textContent = text;

    if (text === 'You Miss!' || text === 'AI Miss!') {
      document.querySelector('#message').style.color = 'red';
    } else if (text === 'AI Hit!' || text === 'You Hit!') {
      document.querySelector('#message').style.color = 'black';
    }
  }

  function enableAttackListeners(callback, board="#ai-board", cell=".ai-cell") {
    document.querySelectorAll(`${board} ${cell}`).forEach(cell => {
      cell.onclick = null;
      cell.addEventListener('click', function atk() {
        const x = Number(this.dataset.x);
        const y = Number(this.dataset.y);
        callback(x, y);
      });
    });
  }

  return { 
    renderBoard, 
    message,
    enableAttackListeners,
    disabled,
    domShips,
    chooseMode,
    disableShipsForAi,
    createBoards
  }; 
})();

export default ui;

