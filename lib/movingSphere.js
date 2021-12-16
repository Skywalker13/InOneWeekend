import { Sphere } from "./sphere.js";
import { AABB } from "./aabb.js";
import { Vec3 } from "./vec3.js";

export class MovingSphere extends Sphere {
  /**
   * Creates an instance of MovingSphere.
   *
   * @param {Point3} c0
   * @param {Point3} c1
   * @param {Number} r
   * @param {Material} m
   * @memberof Sphere
   */
  constructor(c0, c1, r, m) {
    super(c0, r, m);
    this.center0 = c0;
    this.center1 = c1;
    this.centerVec = c1.sub(c0);
    this.radius = r;
    this.mat = m;

    const rvec = new Vec3(this.radius, this.radius, this.radius);
    const box0 = new AABB(this.center0.sub(rvec), this.center0.add(rvec));
    const box1 = new AABB(this.center1.sub(rvec), this.center1.add(rvec));
    this.bbox = new AABB(box0, box1);
  }

  center(time) {
    return this.center0.add(this.centerVec.mul(time));
  }

  boundingBox() {
    return this.bbox;
  }
}
