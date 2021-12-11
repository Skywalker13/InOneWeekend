import { Ray } from "./ray.js";
import { Matrix, Point3, Vec3 } from "./vec3.js";
import { degreesToRadians } from "./utils.js";

export class Camera {
  /**
   * Creates an instance of Camera.
   *
   * @param {Point3} lookfrom
   * @param {Point3} lookat
   * @param {Vec3} vup
   * @param {Number} vfov vertical field-of-view in degrees
   * @param {Number} aspectRatio
   * @memberof Camera
   */
  constructor(lookfrom, lookat, vup, vfov, aspectRatio) {
    const theta = degreesToRadians(vfov);
    const h = Math.tan(theta / 2);
    const viewportHeight = 2 * h;
    const viewportWidth = aspectRatio * viewportHeight;

    const w = lookfrom.sub(lookat).unitVector();
    const u = Matrix.cross(vup, w).unitVector();
    const v = Matrix.cross(w, u);

    this.origin = lookfrom;
    this.horizontal = u.mul(viewportWidth);
    this.vertical = v.mul(viewportHeight);
    this.lowerLeftCorner = this.origin
      .sub(this.horizontal.div(2))
      .sub(this.vertical.div(2))
      .sub(w);
  }

  getRay(s, t) {
    return new Ray(
      this.origin,
      this.lowerLeftCorner
        .add(this.horizontal.mul(s))
        .add(this.vertical.mul(t))
        .sub(this.origin)
    );
  }
}
