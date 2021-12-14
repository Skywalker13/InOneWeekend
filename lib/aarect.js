import { Hittable } from "./hittable.js";
import { Vec3 } from "./vec3.js";

export class XYrect extends Hittable {
  constructor(_x0, _x1, _y0, _y1, _k, mat) {
    super();
    this.x0 = _x0;
    this.x1 = _x1;
    this.y0 = _y0;
    this.y1 = _y1;
    this.k = _k;
    this.mp = mat;
  }

  hit(r, tMin, tMax, rec) {
    const t = (this.k - r.origin.z) / r.direction.z;
    if (t < tMin || t > tMax) {
      return false;
    }
    const x = r.origin.x + t * r.direction.x;
    const y = r.origin.y + t * r.direction.y;
    if (x < this.x0 || x > this.x1 || y < this.y0 || y > this.y1) {
      return false;
    }
    rec.u = (x - this.x0) / (this.x1 - this.x0);
    rec.v = (y - this.y0) / (this.y1 - this.y0);
    rec.t = t;
    const outwardNormal = new Vec3(0, 0, 1);
    rec.setFaceNormal(r, outwardNormal);
    rec.mat = this.mp;
    rec.p = r.at(t);
    return true;
  }
}

export class XZrect extends Hittable {
  constructor(_x0, _x1, _z0, _z1, _k, mat) {
    super();
    this.x0 = _x0;
    this.x1 = _x1;
    this.z0 = _z0;
    this.z1 = _z1;
    this.k = _k;
    this.mp = mat;
  }

  hit(r, tMin, tMax, rec) {
    const t = (this.k - r.origin.y) / r.direction.y;
    if (t < tMin || t > tMax) {
      return false;
    }
    const x = r.origin.x + t * r.direction.x;
    const z = r.origin.z + t * r.direction.z;
    if (x < this.x0 || x > this.x1 || z < this.z0 || z > this.z1) {
      return false;
    }
    rec.u = (x - this.x0) / (this.x1 - this.x0);
    rec.v = (z - this.z0) / (this.z1 - this.z0);
    rec.t = t;
    const outwardNormal = new Vec3(0, 1, 0);
    rec.setFaceNormal(r, outwardNormal);
    rec.mat = this.mp;
    rec.p = r.at(t);
    return true;
  }
}

export class YZrect extends Hittable {
  constructor(_y0, _y1, _z0, _z1, _k, mat) {
    super();
    this.y0 = _y0;
    this.y1 = _y1;
    this.z0 = _z0;
    this.z1 = _z1;
    this.k = _k;
    this.mp = mat;
  }

  hit(r, tMin, tMax, rec) {
    const t = (this.k - r.origin.x) / r.direction.x;
    if (t < tMin || t > tMax) {
      return false;
    }
    const y = r.origin.y + t * r.direction.y;
    const z = r.origin.z + t * r.direction.z;
    if (y < this.y0 || y > this.y1 || z < this.z0 || z > this.z1) {
      return false;
    }
    rec.u = (y - this.y0) / (this.y1 - this.y0);
    rec.v = (z - this.z0) / (this.z1 - this.z0);
    rec.t = t;
    const outwardNormal = new Vec3(1, 0, 0);
    rec.setFaceNormal(r, outwardNormal);
    rec.mat = this.mp;
    rec.p = r.at(t);
    return true;
  }
}
