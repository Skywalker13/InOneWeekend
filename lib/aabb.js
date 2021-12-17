import { Interval } from "./interval.js";

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
      this.x = new Interval(Math.min(a.e0, b.e0), Math.max(a.e0, b.e0));
      this.y = new Interval(Math.min(a.e1, b.e1), Math.max(a.e1, b.e1));
      this.z = new Interval(Math.min(a.e2, b.e2), Math.max(a.e2, b.e2));
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

  _hit(r, rayT, a, e) {
    const invD = 1.0 / r.direction[e];
    let t0 = (this.axis(a).min - r.origin[e]) * invD;
    let t1 = (this.axis(a).max - r.origin[e]) * invD;
    if (invD < 0) {
      const t = t0;
      t0 = t1;
      t1 = t;
    }
    const rayTmin = t0 > rayT.min ? t0 : rayT.min;
    const rayTmax = t1 < rayT.max ? t1 : rayT.max;
    return rayTmax > rayTmin;
  }

  hit(r, rayT) {
    if (!this._hit(r, rayT, 0, "e0")) {
      return false;
    }
    if (!this._hit(r, rayT, 1, "e1")) {
      return false;
    }
    if (!this._hit(r, rayT, 2, "e2")) {
      return false;
    }
    return true;
  }
}
