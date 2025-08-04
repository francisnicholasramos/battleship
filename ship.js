export default function ship(length) {
  let hits = 0;
  function hit() {
    hits++;
  };

  function isSunk() {
    return hits >= length;
  };

  function getHits() {
    return hits;
  };

  return { hit, isSunk, getHits };
};

