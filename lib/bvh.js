import { AABB, surroundingBox } from "./aabb.js";
import { Hittable } from "./hittable.js";
import { random } from "./utils.js";

function boxCompare(a, b, axis) {
  let boxA = new AABB();
  let boxB = new AABB();

  if (!a.boundingBox(0, 0, boxA) || !b.boundingBox(0, 0, boxB)) {
    console.error("No bounding box in BVHnode constructor");
  }

  return boxA.min().e[axis] < boxB.min().e[axis];
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
  constructor(srcObjects, start, end, time0, time1) {
    super();
    if (arguments.length === 3) {
      srcObjects = srcObjects.objects;
      time0 = start;
      time1 = end;
      start = 0;
      end = srcObject.objects.length;
    }

    const objects = srcObjects.splice();

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

      const mid = start + objectSpan / 2;
      this.left = new BVHnode(objects, start, mid, time0, time1);
      this.right = new BVHnode(objects, mid, end, time0, time1);
    }

    const boxLeft = new AABB();
    const boxRight = new AABB();

    if (
      !this.left.boundingBox(time0, time1, boxLeft) ||
      !this.right.boundingBox(time0, time1, boxRight)
    ) {
      console.error("No bounding box in BVHnode constructor");
    }

    this.box = surroundingBox(boxLeft, boxRight);
  }

  hit(r, tMin, tMax, rec) {
    if (!this.box.hit(r, tMin, tMax)) {
      return false;
    }

    const hitLeft = this.left.hit(r, tMin, tMax, rec);
    const hitRight = this.rigth.hit(r, tMin, hitLeft ? rec.t : tMax, rec);

    return hitLeft || hitRight;
  }

  boundingBox(time0, time1, outputBox) {
    outputBox.copy(this.box);
    return true;
  }
}
