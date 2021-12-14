import { random } from "./utils.js";

/**
 * Tridimensional vector
 *
 * @export
 * @class Vec3
 */
export class Vec3 {
  constructor(e0 = 0, e1 = 0, e2 = 0) {
    this.e = [e0, e1, e2];
  }

  static get [Symbol.species]() {
    return Vec3;
  }

  get x() {
    return this.e[0];
  }

  get y() {
    return this.e[1];
  }

  get z() {
    return this.e[2];
  }

  get length() {
    return Math.sqrt(this.lengthSquared);
  }

  get lengthSquared() {
    return (
      this.e[0] * this.e[0] + this.e[1] * this.e[1] + this.e[2] * this.e[2]
    );
  }

  copy(v) {
    this.e[0] = v.e[0];
    this.e[1] = v.e[1];
    this.e[2] = v.e[2];
    return this;
  }

  /**
   * Addition a vector to this vector and returns a new vector.
   *
   * @param {Vec3} v
   * @returns {Vec3} a new vector
   * @memberof Vec3
   */
  add(v) {
    const C = this.constructor[Symbol.species];
    return new C(this.e[0] + v.e[0], this.e[1] + v.e[1], this.e[2] + v.e[2]);
  }

  /**
   * Substract a vector to this vector and returns a new vector.
   *
   * @param {Vec3} v
   * @returns {Vec3} a new vector
   * @memberof Vec3
   */
  sub(v) {
    const C = this.constructor[Symbol.species];
    return new C(this.e[0] - v.e[0], this.e[1] - v.e[1], this.e[2] - v.e[2]);
  }

  /**
   * Multiply a vector or a scalar to this vector and returns a new vector.
   *
   * @param {Vec3|Number} vt
   * @returns {Vec3} a new vector
   * @memberof Vec3
   */
  mul(vt) {
    const C = this.constructor[Symbol.species];
    let v = vt;

    if (typeof vt === "number") {
      v = new C(vt, vt, vt);
    }

    return new C(this.e[0] * v.e[0], this.e[1] * v.e[1], this.e[2] * v.e[2]);
  }

  /**
   * Divide a scalar to this vector and returns a new vector.
   *
   * @param {Number} t
   * @returns {Vec3} a new vector
   * @memberof Vec3
   */
  div(t) {
    return this.mul(1 / t);
  }

  not() {
    const C = this.constructor[Symbol.species];
    return new C(-this.e[0], -this.e[1], -this.e[2]);
  }

  nearZero() {
    const s = 1e-8;
    return (
      Math.abs(this.e[0]) < s &&
      Math.abs(this.e[1]) < s &&
      Math.abs(this.e[2]) < s
    );
  }

  unitVector() {
    return this.div(this.length);
  }

  random(min = 0, max = 1) {
    this.e[0] = random(min, max);
    this.e[1] = random(min, max);
    this.e[2] = random(min, max);
    return this;
  }
}

/**
 * Point in a tridimensional space.
 *
 * @export
 * @class Point3
 * @extends {Vec3}
 */
export class Point3 extends Vec3 {
  static get [Symbol.species]() {
    return Point3;
  }
}

/**
 * True color 24 bit (RGB).
 *
 * @export
 * @class Color
 * @extends {Vec3}
 */
export class Color extends Vec3 {
  static get [Symbol.species]() {
    return Color;
  }

  /**
   * Red
   *
   * @readonly
   * @memberof Color
   */
  get r() {
    return this.e[0];
  }

  /**
   * Green
   *
   * @readonly
   * @memberof Color
   */
  get g() {
    return this.e[1];
  }

  /**
   * Blue
   *
   * @readonly
   * @memberof Color
   */
  get b() {
    return this.e[2];
  }
}
