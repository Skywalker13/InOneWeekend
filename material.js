import { Ray } from "./ray.js";
import { Vec3, Matrix, Point3, Color } from "./vec3.js";

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
    let scatterDirection = new Point3().add(rec.normal).add(randomUnitVector());

    /* Check for degenerated scatter direction */
    if (scatterDirection.nearZero()) {
      scatterDirection = new Point3().add(rec.normal);
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
   * @param {Color} a attenuation
   * @param {Number} f fuzziness
   * @memberof Metal
   */
  constructor(a, f) {
    super();
    this.albedo = a;
    this.fuzz = f;
  }

  scatter(rIn, rec, attenuation, scattered) {
    const reflected = Matrix.reflect(rIn.direction.unitVector(), rec.normal);
    scattered.copy(
      new Ray(rec.p, reflected.add(randomInUnitSphere().mul(this.fuzz)))
    );
    attenuation.copy(this.albedo);
    return Matrix.dot(scattered.direction, rec.normal) > 0;
  }
}

export class Dielectric extends Material {
  constructor(indexOfRefraction) {
    super();
    this.ir = indexOfRefraction;
  }

  scatter(rIn, rec, attenuation, scattered) {
    attenuation.copy(new Color(1, 1, 1));
    const refractionRatio = rec.frontFace ? 1 / this.ir : this.ir;

    const unitDirection = rIn.direction.unitVector();
    const refracted = Matrix.refract(
      unitDirection,
      rec.normal,
      refractionRatio
    );

    scattered.copy(new Ray(rec.p, refracted));
    return true;
  }
}
