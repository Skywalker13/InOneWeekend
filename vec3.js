class vec3 {
  constructor(e0 = 0, e1 = 0, e2 = 0) {
    this.e = [e0, e1, e2];
  }

  add(v) {
    this.e[0] += v.e[0];
    this.e[1] += v.e[1];
    this.e[2] += v.e[2];
    return this;
  }

  mul(t) {
    this.e[0] *= t;
    this.e[1] *= t;
    this.e[2] *= t;
    return this;
  }

  div(t) {
    return this.mul(1 / t);
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

export class point3 extends vec3 {
  get x() {
    return this.e[0];
  }

  get y() {
    return this.e[0];
  }

  get z() {
    return this.e[0];
  }
}

export class color extends vec3 {
  get r() {
    return this.e[0];
  }

  get g() {
    return this.e[0];
  }

  get b() {
    return this.e[0];
  }
}
