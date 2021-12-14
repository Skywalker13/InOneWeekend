import { Perlin } from "./perlin.js";
import { Color } from "./vec3.js";

class Texture {
  value(u, v, p) {
    throw new Error("Missing implementation");
  }
}

export class SolidColor extends Texture {
  constructor(c) {
    super();
    this.colorValue = c;
  }

  value(u, v, p) {
    return this.colorValue;
  }
}

export class CheckerTexture extends Texture {
  constructor(c1, c2) {
    super();
    this.even = c1 instanceof Color ? new SolidColor(c1) : c1;
    this.odd = c2 instanceof Color ? new SolidColor(c2) : c2;
  }

  value(u, v, p) {
    const sines = Math.sin(10 * p.x) * Math.sin(10 * p.y) * Math.sin(10 * p.z);
    if (sines < 0) {
      return this.odd.value(u, v, p);
    }
    return this.even.value(u, v, p);
  }
}

export class NoiseTexture extends Texture {
  constructor(sc) {
    super();
    this.noise = new Perlin();
    this.scale = sc || 1;
  }

  value(u, v, p) {
    return new Color(1, 1, 1).mul(this.noise.turb(p.mul(this.scale)));
  }
}
