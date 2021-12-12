import { Ray } from "./ray.js";
import { Vec3, Point3, Color } from "./vec3.js";
import { dot, reflect, refract } from "./utils.js";

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
  return dot(inUnitSphere, normal) > 0 ? inUnitSphere : inUnitSphere.not();
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
    const reflected = reflect(rIn.direction.unitVector(), rec.normal);
    scattered.copy(
      new Ray(rec.p, reflected.add(randomInUnitSphere().mul(this.fuzz)))
    );
    attenuation.copy(this.albedo);
    return dot(scattered.direction, rec.normal) > 0;
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
    const cosTheta = Math.min(dot(unitDirection.not(), rec.normal), 1.0);
    const sinTheta = Math.sqrt(1.0 - cosTheta * cosTheta);

    const cannotRefract = refractionRatio * sinTheta > 1.0;
    let direction = new Vec3();

    if (
      cannotRefract ||
      Dielectric.reflectance(cosTheta, refractionRatio) > Math.random()
    ) {
      direction = reflect(unitDirection, rec.normal);
    } else {
      direction = refract(unitDirection, rec.normal, refractionRatio);
    }

    scattered.copy(new Ray(rec.p, direction));
    return true;
  }

  /**
   * Christophe Schlick approximation for reflectance
   *
   * @static
   * @param {Number} cosine
   * @param {Number} refIdx
   * @returns {Number}
   * @memberof Dielectric
   */
  static reflectance(cosine, refIdx) {
    let r0 = (1 - refIdx) / (1 + refIdx);
    r0 = r0 * r0;
    return r0 + (1 - r0) * Math.pow(1 - cosine, 5);
  }
}
