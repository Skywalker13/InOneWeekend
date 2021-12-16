import { Interval } from "./interval.js";
import { Vec3 } from "./vec3.js";

export class AABB {
  constructor(a, b, iz) {
    if (iz) {
      this.x = new Interval().copy(a);
      this.y = new Interval().copy(b);
      this.z = new Interval().copy(iz);
    } else if (a instanceof AABB) {
      this.x = new Interval(a.x, b.x);
      this.y = new Interval(a.y, b.y);
      this.z = new Interval(a.z, b.z);
    } else if (a) {
      this.x = new Interval(Math.min(a.e[0], b.e[0]), Math.max(a.e[0], b.e[0]));
      this.y = new Interval(Math.min(a.e[1], b.e[1]), Math.max(a.e[1], b.e[1]));
      this.z = new Interval(Math.min(a.e[2], b.e[2]), Math.max(a.e[2], b.e[2]));
    } else {
      this.x = new Interval();
      this.y = new Interval();
      this.z = new Interval();
    }
  }

  copy(aabb) {
    this.x.copy(aabb.x);
    this.y.copy(aabb.y);
    this.z.copy(aabb.z);
    return this;
  }

  add(a) {
    return new AABB(this.x.add(a.x), this.y.add(a.y), this.z.add(a.z));
  }

  pad() {
    const delta = 0.0001;
    const newX = new Interval().copy(
      this.x.size() >= delta ? this.x : this.x.expand(delta)
    );
    const newY = new Interval().copy(
      this.y.size() >= delta ? this.y : this.y.expand(delta)
    );
    const newZ = new Interval().copy(
      this.z.size() >= delta ? this.z : this.z.expand(delta)
    );

    return new AABB(newX, newY, newZ);
  }

  axis(n) {
    return n === 1 ? this.y : n === 2 ? this.z : this.x;
  }

  hit(r, rayT) {
    for (let a = 0; a < 3; ++a) {
      const invD = 1.0 / r.direction.e[a];
      let t0 = (this.axis(a).min - r.origin.e[a]) * invD;
      let t1 = (this.axis(a).max - r.origin.e[a]) * invD;
      if (invD < 0) {
        const t = t0;
        t0 = t1;
        t1 = t;
      }
      const rayTmin = t0 > rayT.min ? t0 : rayT.min;
      const rayTmax = t1 < rayT.max ? t1 : rayT.max;
      if (rayTmax <= rayTmin) {
        return false;
      }
    }
    return true;
  }
}
