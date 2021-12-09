export class Ray {
  /**
   * A ray has an origin and a direction.
   *
   * @param {Point3} origin
   * @param {Number} direction
   * @memberof ray
   */
  constructor(origin, direction) {
    this.orig = origin;
    this.dir = direction;
  }

  /**
   * Retrieve the origin of the ray.
   *
   * @readonly
   * @memberof Ray
   */
  get origin() {
    return this.orig;
  }

  /**
   * Retrieve the direction of the ray.
   *
   * @readonly
   * @memberof Ray
   */
  get direction() {
    return this.dir;
  }

  /**
   * Retrieve a vector at a point along the ray.
   *
   *  P(t) = A + t·b
   *
   * A: is the ray origin
   * b: is the ray direction
   * t: is used to move along the ray
   *
   *     t=-1 t=0  t=1  t=2
   * <----|----¦----|----|---->
   *           ×--->
   *
   * @param {Point3} t The position along the ray.
   * @returns {Point3} the vector
   */
  at(t) {
    return this.orig.add(this.dir.mul(t));
  }
}
