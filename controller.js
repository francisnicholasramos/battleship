import player from './player.js';
import ui from './ui.js';

const controller = (() => {
  let playerOne, playerTwo, ai;
  let aiTargets = [];
  let isVertical = true;
  let currentTurn = 'playerOne';

  function attackPlayer(x, y) {
    const hit = ai.gameboard.receiveAttack(x, y);
    ui.renderBoard(ai.gameboard, document.getElementById('ai-board'), true);

    if (ai.gameboard.isDefeated()) {
      ui.message('You win!');
      ui.disabled();
      return;
    }

    if (hit) {
      ui.message("You Hit!");
      ui.enableAttackListeners(attackPlayer);
    } else {
      ui.message("You Miss!");
      setTimeout(aiAttack, 500);
    }
  }

  function aiAttack() {
    let x, y;
    if (aiTargets.length) {
      [x, y] = aiTargets.shift();
    } else {
      do {
        x = Math.floor(Math.random() * 10);
        y = Math.floor(Math.random() * 10);
      } while (
        playerOne.gameboard.missed.some(([mx, my]) => mx === x && my === y) ||
        (playerOne.gameboard.board[y][x] && playerOne.gameboard.board[y][x].hit)
      );
    }

    const hit = playerOne.gameboard.receiveAttack(x, y);
    ui.renderBoard(playerOne.gameboard, document.getElementById('player1'), false);

    if (playerOne.gameboard.isDefeated()) {
      ui.message('You lose, AI wins!');
      ui.disabled();
      return;
    }

    if (hit) {
      ui.message("AI Hit!");
      setTimeout(aiAttack, 500);
    } else {
      ui.message("AI Miss!");
      ui.enableAttackListeners(attackPlayer);
    }
  }

  function placeAiShips() {
    let aiShips = [5, 4, 3, 3, 2];
    aiShips.forEach(length => {
      let placed = false;
      while (!placed) {
        const x = Math.floor(Math.random() * 10);
        const y = Math.floor(Math.random() * 10);
        const choices = [true, false];
        let random = choices[Math.floor(Math.random() * 2)];
        try {
          ai.gameboard.placeShip(x, y, length, random);
          placed = true;
        } catch {}
      }
    });
  }

  function renderSinglePlayer() {
    playerOne = player('Player 1');
    ai = player('AI');
    placeAiShips();

    ui.renderBoard(playerOne.gameboard, document.getElementById('player1'), false);
    ui.renderBoard(ai.gameboard, document.getElementById('ai-board'), true);
    ui.domShips();
    ui.disableShipsForAi();
    handleRotation();
    dragNdrop1p();
    dragShips();

    // console.table('Player1', playerOne.gameboard.board);
    // console.table('AI', ai.gameboard.board);
  }

  function playerVsPlayer(defender, boardID, x, y) {
    if ((currentTurn === 'playerOne' && defender !== playerTwo) ||
        (currentTurn === 'playerTwo' && defender !== playerOne)) return;

    const hit = defender.gameboard.receiveAttack(x, y);
    ui.renderBoard(defender.gameboard, document.getElementById(boardID), false); // re-render

    if (defender.gameboard.isDefeated()) {
      ui.message(`${currentTurn === 'playerOne' ? 'Player 1' : 'Player 2'} wins!`);
      ui.disabled();
      return;
    }

    if (hit) {
      ui.message("Hit! You can attack again.");
      ui.enableAttackListeners((x, y) => playerVsPlayer(defender, boardID, x, y), `#${boardID}`, '.cell');
    } else {
      ui.message("Miss!");
      currentTurn = currentTurn === 'playerOne' ? 'playerTwo' : 'playerOne';
      setTimeout(() => {
        const nextDefender = currentTurn === 'playerOne' ? playerTwo : playerOne;
        const nextBoardID = currentTurn === 'playerOne' ? 'showBoard2' : 'showBoard1';
        ui.message(`${currentTurn === 'playerOne' ? 'Player 1' : 'Player 2'}'s turn! Click to attack.`);
        ui.enableAttackListeners((x, y) => playerVsPlayer(nextDefender, nextBoardID, x, y), `#${nextBoardID}`, '.cell');
      }, 1000);
    }
  }

  function renderTwoPlayer() {
    playerOne = player('Player 1');
    playerTwo = player('Player 2');
    currentTurn = 'playerOne';

    ui.message('Player 1, place all your ships.')
    ui.renderBoard(playerOne.gameboard, document.getElementById('player1'), false);
    ui.domShips();
    handleRotation();
    dragNdrop2p();
    dragShips();

    document.querySelectorAll('.ships2').forEach(el => { el.style.display = 'none';});
    
    // console.log('PLAYER 1', playerOne.gameboard.board)
    // console.log('PLAYER 2', playerTwo.gameboard.board)
  }

  function renderBlindBoard() {
    ui.createBoards();
    ui.renderBoard(playerOne.gameboard, document.getElementById('showBoard1'), false);
    ui.renderBoard(playerTwo.gameboard, document.getElementById('showBoard2'), false);
  }

  function dragShips() {
    document.querySelectorAll('.ships').forEach(ship => {
      ship.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData('text/plain', ship.dataset.length);
        e.dataTransfer.setData('text/id', ship.id);
      });
    });

    document.querySelectorAll('.ships2').forEach(ship => {
      ship.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData('text/plain', ship.dataset.length);
        e.dataTransfer.setData('text/id', ship.id);
      });
    });
  }

  function handleRotation() {
    let btn = document.querySelector('.switch');

    btn.addEventListener('click', () => {
      isVertical = !isVertical;
      if (btn.textContent === 'Horizontal') {
        btn.textContent = 'Vertical';
      } else {
        btn.textContent = 'Horizontal';
      }
    });
  }

  function dragNdrop1p() {
    document.querySelectorAll(`#player1 .cell`).forEach(cell => {
      cell.addEventListener('dragover', (e) => e.preventDefault());

      cell.addEventListener('drop', (e) => {
        e.preventDefault();

        const x = Number(cell.dataset.x);
        const y = Number(cell.dataset.y);
        const length = Number(e.dataTransfer.getData('text/plain'));
        const id = e.dataTransfer.getData('text/id');

        try {
          playerOne.gameboard.placeShip(x, y, length, isVertical);
          ui.renderBoard(playerOne.gameboard, document.getElementById('player1'), false);
          dragNdrop1p();

          const placedShip = document.getElementById(id);
          if (placedShip) placedShip.remove();

          const shipsLeft = document.querySelectorAll('.ships').length;

          if (shipsLeft <= 0) {
            ui.message(`All ships placed! Let the battle begin!`);
            document.querySelectorAll('.switch')[0].style.display = 'none'
            ui.enableAttackListeners(attackPlayer);
          } else {
            ui.message(`Keep placing ships:`);
          }
        } catch (err) {
          console.log(err);
          ui.message('Invalid placement. Try again.');
        }
      });
    });
  }

  function dragNdrop2p(targetPlayer = playerOne) {
    const boards = ['player1', 'player2'];
    boards.forEach(uid => {
      document.querySelectorAll(`#${uid} .cell`).forEach(cell => {
        cell.addEventListener('dragover', (e) => {
          e.preventDefault()
        });

        cell.addEventListener('drop', (e) => {
          e.preventDefault();

          const x = Number(cell.dataset.x);
          const y = Number(cell.dataset.y);
          const length = Number(e.dataTransfer.getData('text/plain'));
          const id = e.dataTransfer.getData('text/id');

          try {
            targetPlayer.gameboard.placeShip(x, y, length, isVertical);
            ui.renderBoard(targetPlayer.gameboard, document.getElementById(uid), false);
            dragNdrop2p();

            const placedShip = document.getElementById(id);
            if (placedShip) placedShip.remove();

            const shipsLeft = document.querySelectorAll('.ships').length;
            const shipsLeft1 = document.querySelectorAll('.ships2').length;

            if (shipsLeft <= 0) {
              ui.renderBoard(playerTwo.gameboard, document.getElementById('player2'), false);
              document.querySelector('#player1').style.display = 'none';

              dragShips();
              dragNdrop2p(playerTwo);
              document.querySelectorAll('.ships2').forEach(el => {
                el.style.display = 'inline-block';
              });
            } 
            
            if (shipsLeft1 <= 0) {
              document.getElementById('player1').remove();
              document.getElementById('player2').remove();
              document.querySelector('.switch').style.display = 'none';
              renderBlindBoard();
              ui.enableAttackListeners((x, y) => playerVsPlayer(playerTwo, 'showBoard2', x, y), '#showBoard2', '.cell');
              ui.message(`All ships are placed. It's your turn Player 1.`);
            }

            else {
              ui.message('Keep placing ships:');
            }
          } catch (err) {
            console.log(err);
            ui.message('Invalid placement. Try again.');
          }


        })
      })
    })
  }

  return { renderSinglePlayer, renderTwoPlayer };
})();

export default controller;
