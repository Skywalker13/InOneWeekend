import { Ray } from "./ray.js";
import { Point3, Vec3 } from "./vec3.js";

export class Camera {
  constructor() {
    const aspectRatio = 16 / 9;
    const viewportHeight = 2;
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
