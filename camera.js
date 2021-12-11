import { Ray } from "./ray.js";
import { Point3, Vec3 } from "./vec3.js";
import { degreesToRadians } from "./utils.js";

export class Camera {
  /**
   * Creates an instance of Camera.
   *
   * @param {*} vfov vertical field-of-view in degrees
   * @param {*} aspectRatio
   * @memberof Camera
   */
  constructor(vfov, aspectRatio) {
    const theta = degreesToRadians(vfov);
    const h = Math.tan(theta / 2);
    const viewportHeight = 2 * h;
    const viewportWidth = aspectRatio * viewportHeight;

    const focalLength = 1;

    this.origin = new Point3(0, 0, 0);
    this.horizontal = new Vec3(viewportWidth, 0, 0);
    this.vertical = new Vec3(0, viewportHeight, 0);
    this.lowerLeftCorner = this.origin
      .sub(this.horizontal.div(2))
      .sub(this.vertical.div(2))
      .sub(new Vec3(0, 0, focalLength));
  }

  getRay(u, v) {
    return new Ray(
      this.origin,
      this.lowerLeftCorner
        .add(this.horizontal.mul(u))
        .add(this.vertical.mul(v))
        .sub(this.origin)
    );
  }
}
