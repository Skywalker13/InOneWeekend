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
      const invD = 1.0 / r.direction[a];
      const t0 = this.min()[a] - r.origin[a] * invD;
      const t1 = this.max()[a] - r.origin[a] * invD;
      if (invD < 0) {
        const t = t0;
        t0 = t1;
        t1 = t;
      }
      tMin = t0 > tMin ? t0 : tMin;
      tMax = t1 < tMax ? t1 : tMax;
      if (tMax <= tMin) {
        return false;
      }
    }
    return true;
  }
}
