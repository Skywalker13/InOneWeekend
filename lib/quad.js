import { AABB } from "./aabb.js";
import { Hittable } from "./hittable.js";
import { Point3, Vec3 } from "./vec3.js";
import { cross, dot } from "./utils.js";
import { HittableList } from "./hittableList.js";

export class Quad extends Hittable {
  constructor(_Q, _u, _v, m) {
    super();
    this.Q = new Point3().copy(_Q);
    this.u = new Vec3().copy(_u);
    this.v = new Vec3().copy(_v);
    this.mat = m;

    const n = cross(this.u, this.v);
    this.normal = n.unitVector();
    this.D = dot(this.normal, this.Q);
    this.w = n.div(dot(n, n));

    this.setBoundingBox();
  }

  setBoundingBox() {
    this.bbox = new AABB(this.Q, this.Q.add(this.u).add(this.v)).pad();
  }

  boundingBox() {
    return this.bbox;
  }

  hit(r, rayT, rec) {
    const denom = dot(this.normal, r.direction);

    if (Math.abs(denom) < 1e-8) {
      return false;
    }

    const t = (this.D - dot(this.normal, r.origin)) / denom;
    if (!rayT.contains(t)) {
      return false;
    }

    const intersection = r.at(t);
    const planarHitptVector = intersection.sub(this.Q);
    const alpha = dot(this.w, cross(planarHitptVector, this.v));
    const beta = dot(this.w, cross(this.u, planarHitptVector));

    if (!this.isInterior(alpha, beta, rec)) {
      return false;
    }

    rec.t = t;
    rec.p.copy(intersection);
    rec.mat = this.mat;
    rec.setFaceNormal(r, this.normal);

    return true;
  }

  isInterior(a, b, rec) {
    if (a < 0 || 1 < a || b < 0 || 1 < b) {
      return false;
    }

    rec.u = a;
    rec.v = b;
    return true;
  }
}

export function box(a, b, mat) {
  const sides = new HittableList();

  const min = new Point3(
    Math.min(a.x, b.x),
    Math.min(a.y, b.y),
    Math.min(a.z, b.z)
  );
  const max = new Point3(
    Math.max(a.x, b.x),
    Math.max(a.y, b.y),
    Math.max(a.z, b.z)
  );

  const dx = new Vec3(max.x - min.x, 0, 0);
  const dy = new Vec3(0, max.y - min.y, 0);
  const dz = new Vec3(0, 0, max.z - min.z);

  sides.add(new Quad(new Point3(min.x, min.y, max.z), dx, dy, mat));
  sides.add(new Quad(new Point3(max.x, min.y, max.z), dz.not(), dy, mat));
  sides.add(new Quad(new Point3(max.x, min.y, min.z), dx.not(), dy, mat));
  sides.add(new Quad(new Point3(min.x, min.y, min.z), dz, dy, mat));
  sides.add(new Quad(new Point3(min.x, max.y, max.z), dx, dz.not(), mat));
  sides.add(new Quad(new Point3(min.x, min.y, min.z), dx, dz, mat));

  return sides;
}
