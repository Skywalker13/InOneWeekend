import { XYrect, XZrect, YZrect } from "./aarect.js";
import { Hittable } from "./hittable.js";
import { HittableList } from "./hittableList.js";
import { Point3 } from "./vec3.js";

export class Box extends Hittable {
  constructor(p0, p1, mat) {
    super();
    this.boxMin = new Point3().copy(p0);
    this.boxMax = new Point3().copy(p1);
    this.sides = new HittableList();

    this.sides.add(new XYrect(p0.x, p1.x, p0.y, p1.y, p1.z, mat));
    this.sides.add(new XYrect(p0.x, p1.x, p0.y, p1.y, p0.z, mat));

    this.sides.add(new XZrect(p0.x, p1.x, p0.z, p1.z, p1.y, mat));
    this.sides.add(new XZrect(p0.x, p1.x, p0.z, p1.z, p0.y, mat));

    this.sides.add(new YZrect(p0.y, p1.y, p0.z, p1.z, p1.x, mat));
    this.sides.add(new YZrect(p0.y, p1.y, p0.z, p1.z, p0.x, mat));
  }

  hit(r, tMin, tMax, rec) {
    return this.sides.hit(r, tMin, tMax, rec);
  }

  boundingBox(time0, time1, outputBox) {
    outputBox.copy(new AABB(this.boxMin, this.boxMax));
    return true;
  }
}
