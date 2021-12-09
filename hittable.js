import { Point3, Vec3 } from "./vec3.js";

export class HitRecord {
  constructor() {
    this.p = new Point3();
    this.normal = new Vec3();
    this.t = 0;
  }
}

export class Hittable {
  hit(r, tMin, tMax, rec) {
    throw new Error("Missing implementation");
  }
}
