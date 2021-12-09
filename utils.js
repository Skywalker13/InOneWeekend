export function degreesToRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

export function clamp(x, min, max) {
  return x < min ? min : x > max ? max : x;
}
