import { AABB } from "./aabb.js";
import { Hittable } from "./hittable.js";
import { dot } from "./utils.js";
import { Vec3 } from "./vec3.js";

const PIx2 = Math.PI * 2;

export class Sphere extends Hittable {
  /**
   * Creates an instance of Sphere.
   *
   * @param {Point3} cen
   * @param {Number} r
   * @param {Material} m
   * @memberof Sphere
   */
  constructor(cen, r, m) {
    super();
    this.center0 = cen;
    this.radius = r;
    this.radiusSquared = r * r;
    this.mat = m;

    const rvec = new Vec3(this.radius, this.radius, this.radius);
    this.bbox = new AABB(this.center0.sub(rvec), this.center0.add(rvec));
  }

  center() {
    return this.center0;
  }

  /**
   * Hit sphere
   *
   * x² + y² + z² = R²
   *
   * When a point is on the sphere
   *   x² + y² + z² = R²
   * When a point is inside the sphere
   *   x² + y² + z² < R²
   * When a point is outside the sphere
   *   x² + y² + z² > R²
   *
   * Formulas with origin C = (Cx, Cy, Cz)
   *   (x - Cx)² + (y - Cy)² + (z - Cz)² = r²
   * Same formulas with vectors P = (x, y, z)
   *   (P - C) · (P - C) = r²
   *
   * Any point P that satisfies this equation is on the sphere.
   *
   * We can replace P by P(t): (P(t) - C) · (P(t) - C) = r²
   * Our ray: P(t) = A + t·b
   *
   * The equation can be changed to:
   *   (A + t·b - C) · (A + t·b - C) = r²
   * We search the 0:
   *   t²·b² + 2·t·b · (A - C) + (A - C)² - r² = 0
   *
   * Ref. https://fr.wikipedia.org/wiki/Sph%C3%A8re#%C3%89quations
   */
  hit(r, rayT, rec) {
    /* Legend
     * (A - C) : is the sphere origin, oc = (r.origin - center)
     * r       : is the radius
     * b       : is the direction (r.direction)
     *
     * Ref. https://fr.wikipedia.org/wiki/%C3%89quation_du_second_degr%C3%A9#Discriminant
     */
    const center = this.center(r.time);
    const oc = r.origin.sub(center);
    const a = r.direction.lengthSquared; // b² = b.lengthSquared
    const halfB = dot(oc, r.direction); // b · (A - C)
    const c = oc.lengthSquared - this.radiusSquared; // (A - C)² - r² = oc.lengthSquared - r²

    const discriminant = halfB * halfB - a * c; // (b/2)² - a·c = b² - 4·a·c
    if (discriminant < 0) {
      return false;
    }

    const sqrtd = Math.sqrt(discriminant);

    /* Solutions for positive discriminant
     *  x1 = (-b - sqrt(b² - 4·a·c)) · 1/(2·a)
     *  x2 = (-b + sqrt(b² - 4·a·c)) · 1/(2·a)
     * or
     *  x1 = (-b/2 - sqrt(b² - 4·a·c)) · 1/a
     *  x2 = (-b/2 + sqrt(b² - 4·a·c)) · 1/a
     *
     * Ref. https://fr.wikipedia.org/wiki/%C3%89quation_du_second_degr%C3%A9#Discriminant_strictement_positif
     */

    // Find the nearest root that lies in the acceptable range
    let root = (-halfB - sqrtd) / a;
    if (!rayT.contains(root)) {
      root = (-halfB + sqrtd) / a;
      if (!rayT.contains(root)) {
        return false;
      }
    }

    rec.t = root;
    rec.p = r.at(rec.t);
    const outwardNormal = rec.p.sub(center).$div(this.radius);
    rec.setFaceNormal(r, outwardNormal);
    [rec.u, rec.v] = this.getSphereUV(outwardNormal);
    rec.mat = this.mat;

    return true;
  }

  boundingBox() {
    return this.bbox;
  }

  getSphereUV(p) {
    const theta = Math.acos(-p.y);
    const phi = Math.atan2(-p.z, p.x) + Math.PI;

    const u = phi / PIx2;
    const v = theta / Math.PI;
    return [u, v];
  }
}
