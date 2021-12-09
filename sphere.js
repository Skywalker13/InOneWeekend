import { Hittable } from "./hittable.js";
import { Matrix } from "./vec3.js";

export class Sphere extends Hittable {
  constructor(cen, r) {
    super();
    this.center = cen;
    this.radius = r;
  }

  hit(r, tMin, tMax, rec) {
    /* Legend
     * (A - C) : is the sphere origin, oc = (r.origin - center)
     * r       : is the radius
     * b       : is the direction (r.direction)
     *
     * Ref. https://fr.wikipedia.org/wiki/%C3%89quation_du_second_degr%C3%A9#Discriminant
     */
    const oc = r.origin.sub(this.center);
    const a = r.direction.lengthSquared; // b² = b.lengthSquared
    const halfB = Matrix.dot(oc, r.direction); // b · (A - C)
    const c = oc.lengthSquared - this.radius * this.radius; // (A - C)² - r² = oc.lengthSquared - r²

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
    if (root < tMin || tMax < root) {
      root = (-halfB + sqrtd) / a;
      if (root < tMin || tMax < root) {
        return false;
      }
    }

    rec.t = root;
    rec.p = r.at(rec.t);
    const outwardNormal = rec.p.sub(this.center).div(this.radius);
    rec.setFaceNormal(r, outwardNormal);

    return true;
  }
}
