import { Hittable, HitRecord } from "./hittable.js";
import { AABB } from "./aabb.js";
import { Interval } from "./interval.js";

export class HittableList extends Hittable {
  constructor(object) {
    super();
    this.objects = [];
    this.bbox = new AABB();
    if (object) {
      this.add(object);
    }
  }

  clear() {
    this.objects.length = 0;
  }

  /**
   * Add a new object to the hittable list.
   *
   * @param {Hittable} object
   * @memberof HittableList
   */
  add(object) {
    this.objects.push(object);
    this.bbox = new AABB(this.bbox, object.boundingBox());
  }

  hit(r, rayT, rec) {
    const tempRec = new HitRecord();
    let hitAnything = false;
    let closestSoFar = rayT.max;

    for (const object of this.objects) {
      if (object.hit(r, new Interval(rayT.min, closestSoFar), tempRec)) {
        hitAnything = true;
        closestSoFar = tempRec.t;
        rec.copy(tempRec);
      }
    }

    return hitAnything;
  }

  boundingBox() {
    return this.bbox;
  }
}
