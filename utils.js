export function degreesToRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

export function clamp(x, min, max) {
  if (x < min) {
    return min;
  }
  if (x > max) {
    return max;
  }
  return x;
}
