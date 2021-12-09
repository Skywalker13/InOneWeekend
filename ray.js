export class Ray {
  /**
   * @param {Point3} origin
   * @param {number} direction
   * @memberof ray
   */
  constructor(origin, direction) {
    this.orig = origin;
    this.dir = direction;
  }

  get origin() {
    return this.orig;
  }

  get direction() {
    return this.dir;
  }

  /**
   * @param {number} t
   * @returns {Point3}
   */
  at(t) {
    return this.orig.addNew(this.dir.mulNew(t));
  }
}
