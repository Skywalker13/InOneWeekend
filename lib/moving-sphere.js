import { Sphere } from "./sphere.js";
import { surroundingBox } from "./aabb.js";

export class MovingSphere extends Sphere {
  /**
   * Creates an instance of MovingSphere.
   *
   * @param {Point3} cen0
   * @param {Point3} cen1
   * @param {Number} _time0
   * @param {Number} _time1
   * @param {Number} r
   * @param {Material} m
   * @memberof Sphere
   */
  constructor(cen0, cen1, _time0, _time1, r, m) {
    super(cen0, r, m);
    this.center0 = cen0;
    this.center1 = cen1;
    this.time0 = _time0;
    this.time1 = _time1;
    this.radius = r;
    this.mat = m;
  }

  center(time) {
    return this.center0.add(
      this.center1
        .sub(this.center0)
        .mul((time - this.time0) / (this.time1 - this.time0))
    );
  }

  boundingBox(time0, time1, outputBox) {
    const box0 = new AABB(
      this.center(this._time0).sub(
        new Vec3(this.radius, this.radius, this.radius)
      ),
      this.center(this._time0).add(
        new Vec3(this.radius, this.radius, this.radius)
      )
    );
    const box1 = new AABB(
      this.center(this._time1).sub(
        new Vec3(this.radius, this.radius, this.radius)
      ),
      this.center(this._time1).add(
        new Vec3(this.radius, this.radius, this.radius)
      )
    );
    outputBox.copy(surroundingBox(box0, box1));

    return true;
  }
}
