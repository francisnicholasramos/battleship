import board from "./gameboard.js";

export default function player(name) {
  const gameboard = board();
  return { name, gameboard }
}
