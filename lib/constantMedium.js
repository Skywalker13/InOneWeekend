import { Hittable, HitRecord } from "./hittable.js";
import { Interval } from "./interval.js";
import { Isotropic } from "./material.js";
import { Vec3 } from "./vec3.js";

export class ConstantMedium extends Hittable {
  constructor(b, d, a) {
    super();
    this.boundary = b;
    this.negInvDensity = -1 / d;
    this.phaseFunction = new Isotropic(a);
  }

  hit(r, rayT, rec) {
    const rec1 = new HitRecord();
    const rec2 = new HitRecord();

    if (!this.boundary.hit(r, Interval.universe(), rec1)) {
      return false;
    }

    if (!this.boundary.hit(r, new Interval(rec1.t + 0.0001, Infinity), rec2)) {
      return false;
    }

    if (rec1.t < rayT.min) {
      rec1.t = rayT.min;
    }
    if (rec2.t > rayT.max) {
      rec2.t = rayT.max;
    }

    if (rec1.t >= rec2.t) {
      return false;
    }

    if (rec1.t < 0) {
      rec1.t = 0;
    }

    const rayLength = r.direction.length;
    const distanceInsideBoundary = (rec2.t - rec1.t) * rayLength;
    const hitDistance = this.negInvDensity * Math.log(Math.random());

    if (hitDistance > distanceInsideBoundary) {
      return false;
    }

    rec.t = rec1.t + hitDistance / rayLength;
    rec.p = r.at(rec.t);

    rec.normal = new Vec3(1, 0, 0);
    rec.frontFace = true;
    rec.mat = this.phaseFunction;

    return true;
  }

  boundingBox() {
    return this.boundary.boundingBox();
  }
}
