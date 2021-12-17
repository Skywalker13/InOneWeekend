import { random, dot } from "./utils.js";
import { Vec3 } from "./vec3.js";

const POINT_COUNT = 256;

export class Perlin {
  constructor() {
    this.ranvec = new Array();
    for (let i = 0; i < POINT_COUNT; ++i) {
      this.ranvec.push(new Vec3().random(-1, 1));
    }

    this.permX = Perlin._perlinGeneratePerm();
    this.permY = Perlin._perlinGeneratePerm();
    this.permZ = Perlin._perlinGeneratePerm();
  }

  noise(p) {
    const xFloor = Math.floor(p.x);
    const yFloor = Math.floor(p.y);
    const zFloor = Math.floor(p.z);
    let u = p.x - xFloor;
    let v = p.y - yFloor;
    let w = p.z - zFloor;
    const i = parseInt(xFloor);
    const j = parseInt(yFloor);
    const k = parseInt(zFloor);
    const c = new Array(
      new Array(new Array(), new Array()),
      new Array(new Array(), new Array())
    );

    for (let di = 0; di < 2; ++di) {
      for (let dj = 0; dj < 2; ++dj) {
        for (let dk = 0; dk < 2; ++dk) {
          c[di][dj][dk] = this.ranvec[
            this.permX[(i + di) & 255] ^
              this.permY[(j + dj) & 255] ^
              this.permZ[(k + dk) & 255]
          ];
        }
      }
    }

    return Perlin._perlinInterp(c, u, v, w);
  }

  turb(p, depth = 7) {
    let accum = 0.0;
    let tempP = new Vec3();
    let weight = 1.0;
    tempP.copy(p);

    for (let i = 0; i < depth; ++i) {
      accum += weight * this.noise(tempP);
      weight *= 0.5;
      tempP.$mul(2);
    }

    return Math.abs(accum);
  }

  static _perlinGeneratePerm() {
    const p = new Array();

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

  static _perlinInterp(c, u, v, w) {
    const uu = u * u * (3 - 2 * u);
    const vv = v * v * (3 - 2 * v);
    const ww = w * w * (3 - 2 * w);
    let accum = 0.0;

    for (let i = 0; i < 2; ++i) {
      for (let j = 0; j < 2; ++j) {
        for (let k = 0; k < 2; ++k) {
          const weightV = new Vec3(u - i, v - j, w - k);
          accum +=
            (i * uu + (1 - i) * (1 - uu)) *
            (j * vv + (1 - j) * (1 - vv)) *
            (k * ww + (1 - k) * (1 - ww)) *
            dot(c[i][j][k], weightV);
        }
      }
    }

    return accum;
  }
}
