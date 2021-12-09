import { Point3, Vec3, Matrix } from "./vec3.js";

export class HitRecord {
  constructor() {
    this.p = new Point3();
    this.normal = new Vec3();
    this.t = 0;
    this.frontFace = false;
  }

  /**
   * Copy a HitRecord to this.
   *
   * @param {HitRecord} rec
   * @memberof HitRecord
   */
  copy(rec) {
    this.p = rec.p;
    this.normal = rec.normal;
    this.t = rec.t;
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
    this.frontFace = Matrix.dot(r.direction, outwardNormal) < 0;
    this.normal = this.frontFace ? outwardNormal : -outwardNormal;
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
}
