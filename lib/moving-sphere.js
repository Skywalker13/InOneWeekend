import { Sphere } from "./sphere.js";

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
}
