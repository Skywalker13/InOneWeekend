import { Point3 } from "./vec3.js";

export class AABB {
  constructor(a, b) {
    this.minimum = a;
    this.maximum = b;
  }

  copy(aabb) {
    this.minimum = aabb.minimum;
    this.maximum = aabb.maximum;
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

export function surroundingBox(box0, box1) {
  const small = new Point3(
    Math.min(box0.min().x, box1.min().x),
    Math.min(box0.min().y, box1.min().y),
    Math.min(box0.min().z, box1.min().z)
  );

  const big = new Point3(
    Math.max(box0.max().x, box1.max().x),
    Math.max(box0.max().y, box1.max().y),
    Math.max(box0.max().z, box1.max().z)
  );

  return new AABB(small, big);
}
