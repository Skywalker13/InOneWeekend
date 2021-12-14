import { Ray } from "./ray.js";
import { Point3, Vec3 } from "./vec3.js";
import { degreesToRadians } from "./utils.js";
import { cross, random } from "./utils.js";

function randomInUnitDisk() {
  while (true) {
    const p = new Vec3(random(-1, 1), random(-1, 1), 0);
    if (p.lengthSquared >= 1) {
      continue;
    }
    return p;
  }
}

export class Camera {
  /**
   * Creates an instance of Camera.
   *
   * @param {Point3} lookfrom
   * @param {Point3} lookat
   * @param {Vec3} vup
   * @param {Number} vfov vertical field-of-view in degrees
   * @param {Number} aspectRatio
   * @param {Number} aperture
   * @param {Number} focusDist
   * @memberof Camera
   */
  constructor(
    lookfrom,
    lookat,
    vup,
    vfov,
    aspectRatio,
    aperture,
    focusDist,
    _time0 = 0,
    _time1 = 0
  ) {
    const theta = degreesToRadians(vfov);
    const h = Math.tan(theta / 2);
    const viewportHeight = 2 * h;
    const viewportWidth = aspectRatio * viewportHeight;

    this.w = lookfrom.sub(lookat).unitVector();
    this.u = cross(vup, this.w).unitVector();
    this.v = cross(this.w, this.u);

    this.origin = lookfrom;
    this.horizontal = this.u.mul(viewportWidth).mul(focusDist);
    this.vertical = this.v.mul(viewportHeight).mul(focusDist);
    this.lowerLeftCorner = this.origin
      .sub(this.horizontal.div(2))
      .sub(this.vertical.div(2))
      .sub(this.w.mul(focusDist));

    this.lensRadius = aperture / 2;
    this.time0 = _time0;
    this.time1 = _time1;
  }

  getRay(s, t) {
    const rd = new Point3().add(randomInUnitDisk().mul(this.lensRadius));
    const offset = this.u.mul(rd.x).add(this.v.mul(rd.y));

    return new Ray(
      this.origin.add(offset),
      this.lowerLeftCorner
        .add(this.horizontal.mul(s))
        .add(this.vertical.mul(t))
        .sub(this.origin)
        .sub(offset),
      random(this.time0, this.time1)
    );
  }
}