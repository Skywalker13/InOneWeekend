import { AABB } from "./aabb.js";
import { Hittable } from "./hittable.js";
import { HittableList } from "./hittableList.js";
import { Interval } from "./interval.js";
import { random } from "./utils.js";

function boxCompare(a, b, axisIndex) {
  return (
    a.boundingBox().axis(axisIndex).min < b.boundingBox().axis(axisIndex).min
  );
}

function boxXcompare(a, b) {
  return boxCompare(a, b, 0);
}

function boxYcompare(a, b) {
  return boxCompare(a, b, 1);
}

function boxZcompare(a, b) {
  return boxCompare(a, b, 2);
}

export class BVHnode extends Hittable {
  constructor(srcObjects, start, end) {
    super();

    if (srcObjects instanceof HittableList) {
      return new BVHnode(srcObjects.objects, 0, srcObjects.objects.length);
    }

    if (start === undefined) {
      start = 0;
      end = srcObjects.length;
    }

    const objects = srcObjects.slice();

    const axis = Math.floor(random(0, 2));
    const comparator =
      axis === 0 ? boxXcompare : axis === 1 ? boxYcompare : boxZcompare;

    const objectSpan = end - start;

    if (objectSpan === 1) {
      this.left = this.right = objects[start];
    } else if (objectSpan === 2) {
      if (comparator(objects[start], objects[start + 1])) {
        this.left = objects[start];
        this.right = objects[start + 1];
      } else {
        this.left = objects[start + 1];
        this.right = objects[start];
      }
    } else {
      objects.slice(start, end).sort(comparator);

      const mid = start + parseInt(objectSpan / 2);
      this.left = new BVHnode(objects, start, mid);
      this.right = new BVHnode(objects, mid, end);
    }

    this.bbox = new AABB(this.left.boundingBox(), this.right.boundingBox());
  }

  hit(r, rayT, rec) {
    if (!this.bbox.hit(r, rayT)) {
      return false;
    }

    const hitLeft = this.left.hit(r, rayT, rec);
    const hitRight = this.right.hit(
      r,
      new Interval(rayT.min, hitLeft ? rec.t : rayT.max),
      rec
    );

    return hitLeft || hitRight;
  }

  boundingBox() {
    return this.bbox;
  }
}
