export const createPath = (p1x, p1y, p2x, p2y) => {
  var yDif = p2y - p1y;

  var curve = `M ${p1x} ${p1y} C ${p1x} ${p1y + 0.5 * yDif}, ${p2x} ${
    p1y + 0.5 * yDif
  }, ${p2x},
    ${p2y}`;

  return curve;
};
