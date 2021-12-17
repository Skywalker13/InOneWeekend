import { default as PixmapFromFile } from "xpixmap";
import { Interval } from "./interval.js";

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
  constructor(_scale, c1, c2) {
    super();
    this.invScale = 1.0 / _scale;
    this.even = c1 instanceof Color ? new SolidColor(c1) : c1;
    this.odd = c2 instanceof Color ? new SolidColor(c2) : c2;
  }

  value(u, v, p) {
    const xInteger = parseInt(Math.floor(this.invScale * p.x));
    const yInteger = parseInt(Math.floor(this.invScale * p.y));
    const zInteger = parseInt(Math.floor(this.invScale * p.z));

    const isEven = (xInteger + yInteger + zInteger) % 2 === 0;

    return isEven ? this.even.value(u, v, p) : this.odd.value(u, v, p);
  }
}

export class NoiseTexture extends Texture {
  constructor(sc) {
    super();
    this.noise = new Perlin();
    this.scale = sc || 1;
  }

  value(u, v, p) {
    return new Color(1, 1, 1)
      .$mul(0.5)
      .$mul(1 + Math.sin(this.scale * p.z + 10 * this.noise.turb(p)));
  }
}

export class ImageTexture extends Texture {
  constructor(filename) {
    super();

    const pixmap = new PixmapFromFile(filename);
    const { width, height, length, data } = pixmap;

    this.bytesPerPixel = 4; /* it's always BGRA */
    this.bytesPerScanline = this.bytesPerPixel * width;
    this.data = data;
    this.width = width;
    this.height = height;
  }

  value(u, v, p) {
    if (this.height <= 0) {
      return new Color(0, 1, 1);
    }

    u = new Interval(0, 1).clamp(u);
    v = 1 - new Interval(0, 1).clamp(v);

    let i = parseInt(u * this.width);
    let j = parseInt(v * this.height);

    const colorScale = 1.0 / 255.0;
    return new Color(
      this.data[j * this.bytesPerScanline + i * this.bytesPerPixel + 2],
      this.data[j * this.bytesPerScanline + i * this.bytesPerPixel + 1],
      this.data[j * this.bytesPerScanline + i * this.bytesPerPixel + 0]
    ).mul(colorScale);
  }
}
