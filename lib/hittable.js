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

export class Translate extends Hittable {
  constructor(p, displacement) {
    super();
    this.p = p;
    this.offset = displacement;
  }

  hit(r, tMin, tMax, rec) {
    const movedR = new Ray(r.origin.sub(this.offset), r.direction, r.time);
    if (!this.p.hit(movedR, tMin, tMax, rec)) {
      return false;
    }

    rec.p = rec.p.add(this.offset);
    rec.setFaceNormal(movedR, rec.normal);

    return true;
  }

  boundingBox(time0, time1, outputBox) {
    if (this.p.boundingBox(time0, time1, outputBox)) {
      return false;
    }

    outputBox.copy(
      new AABB(outputBox.min().add(offset), outputBox.max().add(offset))
    );

    return true;
  }
}

export class RotateY extends Hittable {
  constructor(p, angle) {
    super();
    this.p = p;
    const radians = degreesToRadians(angle);
    this.sinTheta = Math.sin(radians);
    this.cosTheta = Math.cos(radians);
    this.bbox = new AABB();
    this.hasbox = this.p.boundingBox(0, 1, this.bbox);

    const min = new Point3(Infinity, Infinity, Infinity);
    const max = new Point3(-Infinity, -Infinity, -Infinity);

    for (let i = 0; i < 2; ++i) {
      for (let j = 0; j < 2; ++j) {
        for (let k = 0; k < 2; ++k) {
          const x = i * this.bbox.max().x + (1 - i) * this.bbox.min().x;
          const y = j * this.bbox.max().y + (1 - j) * this.bbox.min().y;
          const z = k * this.bbox.max().z + (1 - k) * this.bbox.min().z;

          const newx = this.cosTheta * x + this.sinTheta * z;
          const newz = -this.sinTheta * x + this.cosTheta * z;

          const tester = new Vec3(newx, y, newz);

          for (let c = 0; c < 3; ++c) {
            min.e[c] = Math.min(min.e[c], tester.e[c]);
            max.e[c] = Math.max(max.e[c], tester.e[c]);
          }
        }
      }
    }

    this.bbox.copy(new AABB(min, max));
  }

  hit(r, tMin, tMax, rec) {
    const origin = new Point3().copy(r.origin);
    const direction = new Vec3().copy(r.direction);

    origin.e[0] = this.cosTheta * r.origin.e[0] - this.sinTheta * r.origin.e[2];
    origin.e[2] = this.sinTheta * r.origin.e[0] + this.cosTheta * r.origin.e[2];

    direction.e[0] =
      this.cosTheta * r.direction.e[0] - this.sinTheta * r.direction.e[2];
    direction.e[2] =
      this.sinTheta * r.direction.e[0] + this.cosTheta * r.direction.e[2];

    const rotatedR = new Ray(origin, direction, r.time);

    if (!this.p.hit(rotatedR, tMin, tMax, rec)) {
      return false;
    }

    const p = new Point3().copy(rec.p);
    const normal = rec.normal;

    p.e[0] = this.cosTheta * rec.p.e[0] + this.sinTheta * rec.p.e[2];
    p.e[2] = -this.sinTheta * rec.p.e[0] + this.cosTheta * rec.p.e[2];

    normal[0] = this.cosTheta * rec.normal[0] + this.sinTheta * rec.normal[2];
    normal[2] = -this.sinTheta * rec.normal[0] + this.cosTheta * rec.normal[2];

    rec.p.copy(p);
    rec.setFaceNormal(rotatedR, normal);

    return true;
  }
}
