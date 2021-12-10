import { Ray } from "./ray.js";
import { Vec3, Matrix } from "./vec3.js";

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

  /* Diffuse renderers
   * 1. Rejection method
   * 2. True Lambertian reflection
   * 3. Alternative diffuse formulation
   *
   * [1] const target = rec.p.add(rec.normal).add(randomInUnitSphere());
   * [2] const target = rec.p.add(rec.normal).add(randomUnitVector());
   * [3] const target = rec.p.add(randomInHemisphere(rec.normal));
   */
  scatter(rIn, rec, attenuation, scattered) {
    const scatterDirection = rec.p
      .add(rec.normal)
      .add(randomUnitVector())
      .sub(rec.p);

    /* Check for degenerated scatter direction */
    if (scatterDirection.nearZero()) {
      scatterDirection = rec.normal;
    }

    scattered.copy(new Ray(rec.p, scatterDirection));
    attenuation.copy(this.albedo);
    return true;
  }
}

export class Metal extends Material {
  /**
   * Creates an instance of Metal material
   *
   * @param {Color} a
   * @memberof Metal
   */
  constructor(a) {
    super();
    this.albedo = a;
  }

  scatter(rIn, rec, attenuation, scattered) {
    const reflected = Matrix.reflect(rIn.direction.unitVector(), rec.normal);
    scattered.copy(new Ray(rec.p, reflected));
    attenuation.copy(this.albedo);
    return Matrix.dot(scattered.direction, rec.normal) > 0;
  }
}
