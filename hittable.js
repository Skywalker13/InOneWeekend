import { Point3, Vec3, Matrix } from "./vec3.js";

export class HitRecord {
  constructor() {
    this.p = new Point3();
    this.normal = new Vec3();
    this.t = 0;
    this.frontFace = false;
  }

  copy(rec) {
    this.p = rec.p;
    this.normal = rec.normal;
    this.t = rec.t;
    this.frontFace = rec.frontFace;
  }

  setFaceNormal(r, outwardNormal) {
    this.frontFace = Matrix.dot(r.direction, outwardNormal) < 0;
    this.normal = this.frontFace ? outwardNormal : -outwardNormal;
  }
}

export class Hittable {
  hit(r, tMin, tMax, rec) {
    throw new Error("Missing implementation");
  }
}
