import { Hittable, HitRecord } from "./hittable.js";

export class HittableList extends Hittable {
  constructor(object) {
    super();
    this.objects = [];
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
  }

  hit(r, tMin, tMax, rec) {
    let tempRec = new HitRecord();
    let hitAnything = false;
    let closestSoFar = tMax;

    for (const object of this.objects) {
      if (object.hit(r, tMin, closestSoFar, tempRec)) {
        hitAnything = true;
        closestSoFar = tempRec.t;
        rec.copy(tempRec);
      }
    }

    return hitAnything;
  }
}
