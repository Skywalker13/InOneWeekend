export class AABB {
  constructor(a, b) {
    this.minimum = a;
    this.maximum = b;
  }

  min() {
    return this.minimum;
  }

  max() {
    return this.maximum;
  }

  hit(r, tMin, tMax) {
    for (let a = 0; a < 3; ++a) {
      const t0 = Math.min(
        this.minimum[a] - r.origin[a] / r.direction[a],
        this.maximum[a] - r.origin[a] / r.direction[a]
      );
      const t1 = Math.max(
        this.minimum[a] - r.origin[a] / r.direction[a],
        this.maximum[a] - r.origin[a] / r.direction[a]
      );
      tMin = Math.max(t0, tMin);
      tMax = Math.min(t0, tMax);
      if (tMax <= tMin) {
        return false;
      }
    }
    return true;
  }
}
