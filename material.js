import { Ray } from "./ray";

function randomInUnitSphere() {
  while (true) {
    const p = Vec3.random(-1, 1);
    if (p.lengthSquared >= 1) {
      continue;
    }
    return p;
  }
}

function randomUnitVector() {
  return randomInUnitSphere().unitVector();
}

function randomInHemisphere(normal) {
  const inUnitSphere = randomInUnitSphere();
  return Matrix.dot(inUnitSphere, normal) > 0
    ? inUnitSphere
    : inUnitSphere.not();
}

export class Material {
  scatter(rIn, rec, attenuation, scattered) {
    throw new Error("Missing implementation");
  }
}

export class Lambertian extends Material {
  /**
   * Creates an instance of Lambertian material
   *
   * @param {Color} a
   * @memberof Lambertian
   */
  constructor(a) {
    super();
    this.albedo = a;
  }

  scatter(rIn, rec, attenuation, scattered) {
    const scatterDirection = rec.normal.add(randomUnitVector());

    /* Check for degenerated scatter direction */
    if (scatterDirection.nearZero()) {
      scatterDirection = rec.normal;
    }

    scattered.copy(new Ray(rec.p, scatterDirection));
    attenuation.copy(this.albedo);
    return true;
  }
}
