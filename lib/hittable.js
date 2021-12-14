import { Point3, Vec3 } from "./vec3.js";
import { dot } from "./utils.js";

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
    this.normal = this.frontFace ? outwardNormal : outwardNormal.not();
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
  hit(r, tMin, tMax, rec) {
    throw new Error("Missing implementation");
  }

  boundingBox(time0, time1, outputBox) {
    throw new Error("Missing implementation");
  }
}
