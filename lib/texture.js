class Texture {
  value(u, v, p) {
    throw new Error("Missing implementation");
  }
}

export class SolidColor extends Texture {
  constructor(c) {
    this.colorValue = c;
  }

  value(u, v, p) {
    return this.colorValue;
  }
}
