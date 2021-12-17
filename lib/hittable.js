import { Point3, Vec3 } from "./vec3.js";
import { degreesToRadians, dot } from "./utils.js";
import { Ray } from "./ray.js";
import { AABB } from "./aabb.js";

export class HitRecord {
  constructor() {
    this.p = new Point3();
    this.normal = new Vec3();
    this.mat;
    this.t = 0;
    this.u = 0;
    this.v = 0;
    this.frontFace = false;
  }

  /**
   * Copy a HitRecord to this.
   *
   * @param {HitRecord} rec
   * @memberof HitRecord
   */
  copy(rec) {
    this.p.copy(rec.p);
    this.normal.copy(rec.normal);
    this.mat = rec.mat;
    this.t = rec.t;
    this.u = rec.u;
    this.v = rec.v;
    this.frontFace = rec.frontFace;
    return this;
  }

  /**
   * Store the front face normal (if outward or not).
   *
   * @param {Ray} r
   * @param {Point3} outwardNormal
   * @memberof HitRecord
   */
  setFaceNormal(r, outwardNormal) {
    this.frontFace = dot(r.direction, outwardNormal) < 0;
    this.normal.copy(this.frontFace ? outwardNormal : outwardNormal.not());
  }
}

export class Hittable {
  /**
   * Method to test when a ray is crossing an object.
   *
   * tMin and tMax are used in order to provide a range where it makes
   * sense to test the "hit".
   *
   * @param {Ray} r
   * @param {Number} tMin
   * @param {Number} tMax
   * @param {HitRecord} rec
   * @memberof Hittable
   */
  hit(r, rayT, rec) {
    throw new Error("Missing implementation");
  }

  boundingBox() {
    throw new Error("Missing implementation");
  }
}

export class Translate extends Hittable {
  constructor(p, displacement) {
    super();
    this.object = p;
    this.offset = new Vec3().copy(displacement);
    this.bbox = this.object.boundingBox().add(this.offset);
  }

  hit(r, rayT, rec) {
    const offsetR = new Ray(r.origin.sub(this.offset), r.direction, r.time);

    if (!this.object.hit(offsetR, rayT, rec)) {
      return false;
    }

    rec.p.$add(this.offset);

    return true;
  }

  boundingBox() {
    return this.bbox;
  }
}

export class RotateY extends Hittable {
  constructor(p, angle) {
    super();
    this.object = p;
    const radians = degreesToRadians(angle);
    this.sinTheta = Math.sin(radians);
    this.cosTheta = Math.cos(radians);
    this.bbox = new AABB().copy(this.object.boundingBox());

    const min = new Point3(Infinity, Infinity, Infinity);
    const max = new Point3(-Infinity, -Infinity, -Infinity);

    for (let i = 0; i < 2; ++i) {
      for (let j = 0; j < 2; ++j) {
        for (let k = 0; k < 2; ++k) {
          const x = i * this.bbox.x.max + (1 - i) * this.bbox.x.min;
          const y = j * this.bbox.y.max + (1 - j) * this.bbox.y.min;
          const z = k * this.bbox.z.max + (1 - k) * this.bbox.z.min;

          const newx = this.cosTheta * x + this.sinTheta * z;
          const newz = -this.sinTheta * x + this.cosTheta * z;

          min.e0 = Math.min(min.e0, newx);
          max.e0 = Math.max(max.e0, newx);
          min.e1 = Math.min(min.e1, y);
          max.e1 = Math.max(max.e1, y);
          min.e2 = Math.min(min.e2, newz);
          max.e2 = Math.max(max.e2, newz);
        }
      }
    }

    this.bbox.copy(new AABB(min, max));
  }

  hit(r, rayT, rec) {
    const origin = new Point3().copy(r.origin);
    const direction = new Vec3().copy(r.direction);

    origin.e0 = this.cosTheta * r.origin.e0 - this.sinTheta * r.origin.e2;
    origin.e2 = this.sinTheta * r.origin.e0 + this.cosTheta * r.origin.e2;

    direction.e0 =
      this.cosTheta * r.direction.e0 - this.sinTheta * r.direction.e2;
    direction.e2 =
      this.sinTheta * r.direction.e0 + this.cosTheta * r.direction.e2;

    const rotatedR = new Ray(origin, direction, r.time);

    if (!this.object.hit(rotatedR, rayT, rec)) {
      return false;
    }

    const p = new Point3().copy(rec.p);
    const normal = new Vec3().copy(rec.normal);

    p.e0 = this.cosTheta * rec.p.e0 + this.sinTheta * rec.p.e2;
    p.e2 = -this.sinTheta * rec.p.e0 + this.cosTheta * rec.p.e2;

    normal.e0 = this.cosTheta * rec.normal.e0 + this.sinTheta * rec.normal.e2;
    normal.e2 = -this.sinTheta * rec.normal.e0 + this.cosTheta * rec.normal.e2;

    rec.p.copy(p);
    rec.normal.copy(normal);

    return true;
  }

  boundingBox() {
    return this.bbox;
  }
}
