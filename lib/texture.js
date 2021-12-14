import { default as PixmapFromFile } from "xpixmap";

import { Perlin } from "./perlin.js";
import { Color, Vec3 } from "./vec3.js";
import { clamp } from "./utils.js";

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
    return new Color(1, 1, 1)
      .mul(0.5)
      .mul(1 + Math.sin(this.scale * p.z + 10 * this.noise.turb(p)));
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
    if (!this.data) {
      return new Color(0, 1, 1);
    }

    u = clamp(u, 0.0, 1.0);
    v = 1.0 - clamp(v, 0.0, 1.0);

    let i = parseInt(u * this.width);
    let j = parseInt(v * this.height);

    if (i >= this.width) {
      i = this.width - 1;
    }
    if (j >= this.height) {
      j = this.height - 1;
    }

    const colorScale = 1.0 / 255.0;
    return new Color(
      this.data[j * this.bytesPerScanline + i * this.bytesPerPixel + 2],
      this.data[j * this.bytesPerScanline + i * this.bytesPerPixel + 1],
      this.data[j * this.bytesPerScanline + i * this.bytesPerPixel + 0]
    ).mul(colorScale);
  }
}
