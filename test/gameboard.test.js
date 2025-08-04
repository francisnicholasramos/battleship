import gameboard from "../gameboard";

test("place a ship", () => {
  const board = gameboard();
  board.placeShip(3,3,3);

  expect(board.ships.length).toBe(1)
})

test("missed attack", () => {
  const board = gameboard();
  board.placeShip(4,3,4);
  board.receiveAttack(4, 3);

  expect(board.missed.length).toBe(0)
})

test("isAllShipsSunk", () => {
  const board = gameboard();
  expect(board.isDefeated()).toBe(false)
})

