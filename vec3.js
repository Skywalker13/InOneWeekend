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

  /**
   * Addition a vector to this vector.
   *
   * @param {Vec3} v
   * @returns {Vec3} this
   * @memberof Vec3
   */
  _add(v) {
    this.e[0] += v.e[0];
    this.e[1] += v.e[1];
    this.e[2] += v.e[2];
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
   * Substract a vector to this vector.
   *
   * @param {Vec3} v
   * @returns {Vec3} this
   * @memberof Vec3
   */
  _sub(v) {
    this.e[0] -= v.e[0];
    this.e[1] -= v.e[1];
    this.e[2] -= v.e[2];
    return this;
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
   * Multiply a scalar to this vector.
   *
   * @param {Number} t
   * @returns {Vec3} this
   * @memberof Vec3
   */
  _mul(t) {
    this.e[0] *= t;
    this.e[1] *= t;
    this.e[2] *= t;
    return this;
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
   * Divide a scalar to this vector.
   *
   * @param {Number} t
   * @returns {Vec3} this
   * @memberof Vec3
   */
  _div(t) {
    return this._mul(1 / t);
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

  unitVector() {
    return this.div(this.length);
  }

  get length() {
    return Math.sqrt(this.lengthSquared);
  }

  get lengthSquared() {
    return (
      this.e[0] * this.e[0] + this.e[1] * this.e[1] + this.e[2] * this.e[2]
    );
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

  get x() {
    return this.e[0];
  }

  get y() {
    return this.e[1];
  }

  get z() {
    return this.e[2];
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

export class Matrix {
  static str(out, v) {
    return out(`${v.e[0]} ${v.e[1]} ${v.e[2]}`);
  }

  /**
   * Scalar product
   *
   * @static
   * @param {Vec3} u
   * @param {Vec3} v
   * @returns {Number}
   * @memberof Matrix
   */
  static dot(u, v) {
    return u.e[0] * v.e[0] + u.e[1] * v.e[1] + u.e[2] * v.e[2];
  }

  static cross(u, v) {
    return new Vec3(
      u.e[1] * v.e[2] - u.e[2] * v.e[1],
      u.e[2] * v.e[0] - u.e[0] * v.e[2],
      u.e[0] * v.e[1] - u.e[1] * v.e[0]
    );
  }
}
