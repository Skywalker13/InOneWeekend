import { random } from "./utils.js";

const POINT_COUNT = 256;

export class Perlin {
  constructor() {
    this.ranfloat = [];
    for (let i = 0; i < POINT_COUNT; ++i) {
      this.ranfloat.push(Math.random());
    }

    this.permX = Perlin._perlinGeneratePerm();
    this.permY = Perlin._perlinGeneratePerm();
    this.permZ = Perlin._perlinGeneratePerm();
  }

  noise(p) {
    const i = parseInt(4 * p.x) & 255;
    const j = parseInt(4 * p.y) & 255;
    const k = parseInt(4 * p.z) & 255;

    return this.ranfloat[this.permX[i] ^ this.permY[j] ^ this.permZ[k]];
  }

  static _perlinGeneratePerm() {
    const p = [];

    for (let i = 0; i < POINT_COUNT; ++i) {
      p.push(i);
    }

    Perlin._permute(p, POINT_COUNT);

    return p;
  }

  static _permute(p, n) {
    for (let i = n; i > 0; --i) {
      const target = Math.floor(random(0, i));
      const tmp = p[i];
      p[i] = p[target];
      p[target] = tmp;
    }
  }
}
