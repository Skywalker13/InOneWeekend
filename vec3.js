export class Vec3 {
  constructor(e0 = 0, e1 = 0, e2 = 0) {
    this.e = [e0, e1, e2];
  }

  static get [Symbol.species]() {
    return Vec3;
  }

  add(v) {
    this.e[0] += v.e[0];
    this.e[1] += v.e[1];
    this.e[2] += v.e[2];
    return this;
  }

  addNew(v) {
    const C = this.constructor[Symbol.species];
    return new C(this.e[0] + v.e[0], this.e[1] + v.e[1], this.e[2] + v.e[2]);
  }

  sub(v) {
    this.e[0] -= v.e[0];
    this.e[1] -= v.e[1];
    this.e[2] -= v.e[2];
    return this;
  }

  subNew(v) {
    const C = this.constructor[Symbol.species];
    return new C(this.e[0] - v.e[0], this.e[1] - v.e[1], this.e[2] - v.e[2]);
  }

  mul(t) {
    this.e[0] *= t;
    this.e[1] *= t;
    this.e[2] *= t;
    return this;
  }

  mulNew(vt) {
    const C = this.constructor[Symbol.species];
    let v = vt;

    if (typeof vt === "number") {
      v = new C(vt, vt, vt);
    }

    return new C(this.e[0] * v.e[0], this.e[1] * v.e[1], this.e[2] * v.e[2]);
  }

  div(t) {
    return this.mul(1 / t);
  }

  divNew(t) {
    return this.mulNew(1 / t);
  }

  unitVector() {
    return this.divNew(this.length);
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

export class Color extends Vec3 {
  static get [Symbol.species]() {
    return Color;
  }

  get r() {
    return this.e[0];
  }

  get g() {
    return this.e[1];
  }

  get b() {
    return this.e[2];
  }
}

export class vec3u {
  static str(out, v) {
    return out(`${v.e[0]} ${v.e[1]} ${v.e[2]}`);
  }

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
