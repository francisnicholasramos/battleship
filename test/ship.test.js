import ship from '../ship';

test("increment hits by 1", () => {
  let s = ship();
  s.hit();
  expect(s.getHits()).toBe(1)
})

test("sinks ship after 2 hits", () => {
  let s = ship(2);
  s.hit();
  s.hit();
  expect(s.getHits()).toBe(2)
})

test("ship is not sunk intially", () => {
  const s = ship(3);
  expect(s.isSunk()).toBe(false)
})


