import player from '../player'

test("create a player with correct name", () => {
  const p = player("niko")
  expect(p.name).toBe("niko")
})

test("player should return an object", () => {
  const p = player("niko")
  expect(typeof p).toBe("object")
})

test("player should have its own gameboard property", () => {
  const p = player("niko")
  expect(p).toHaveProperty("gameboard")
})

