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
   * @memberof Camera
   */
  constructor() {
    this.vfov = 40;
    this.aperture = 0;
    this.focusDist = 10;

    this.lookfrom = new Point3(0, 0, -1);
    this.lookat = new Point3(0, 0, 0);
    this.vup = new Vec3(0, 1, 0);
  }

  initialize(aspectRatio) {
    const theta = degreesToRadians(this.vfov);
    const h = Math.tan(theta / 2);
    const viewportHeight = 2 * h;
    const viewportWidth = aspectRatio * viewportHeight;

    this.w = this.lookfrom.sub(this.lookat).unitVector();
    this.u = cross(this.vup, this.w).unitVector();
    this.v = cross(this.w, this.u);

    this.origin = new Vec3().copy(this.lookfrom);
    this.horizontal = this.u.mul(viewportWidth).$mul(this.focusDist);
    this.vertical = this.v.mul(viewportHeight).$mul(this.focusDist);
    this.lowerLeftCorner = this.origin
      .sub(this.horizontal.div(2))
      .$sub(this.vertical.div(2))
      .$sub(this.w.mul(this.focusDist));

    this.lensRadius = this.aperture / 2;
  }

  getRay(s, t) {
    const rd = randomInUnitDisk().$mul(this.lensRadius);
    const offset = this.u.mul(rd.x).$add(this.v.mul(rd.y));
    const rayTime = random(0.0, 1.0);

    return new Ray(
      this.origin.add(offset),
      this.lowerLeftCorner
        .add(this.horizontal.mul(s))
        .$add(this.vertical.mul(t))
        .$sub(this.origin)
        .$sub(offset),
      rayTime
    );
  }
}
