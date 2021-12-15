import { Camera } from "./camera.js";
import { HittableList } from "./hittableList.js";
import { Color } from "./vec3.js";
import { HitRecord } from "./hittable.js";
import { Interval } from "./interval.js";
import { Ray } from "./ray.js";
import writeColor from "./writeColor.js";

const stdout = (text) => process.stdout.write(text);
const stderr = (text) => process.stderr.write(text);

export class Scene {
  constructor() {
    this.world = new HittableList();
    this.cam = new Camera();

    this.aspectRatio = 1.0;
    this.imageWidth = 100;
    this.samplesPerPixel = 10;
    this.maxDepth = 50;
    this.background = new Color(0, 0, 0);
  }

  render() {
    const imageHeight = parseInt(this.imageWidth / this.aspectRatio);

    this.cam.initialize(this.aspectRatio);

    stdout(`P3\n${this.imageWidth} ${imageHeight}\n255\n`);

    for (let j = imageHeight - 1; j >= 0; --j) {
      stderr(`\nScanlines remaining: ${j} `);
      for (let i = 0; i < this.imageWidth; ++i) {
        let pixelColor = new Color(0, 0, 0);
        /* Antialiasing */
        for (let s = 0; s < this.samplesPerPixel; ++s) {
          const u = (i + Math.random()) / (this.imageWidth - 1);
          const v = (j + Math.random()) / (imageHeight - 1);
          const r = this.cam.getRay(u, v);
          pixelColor = pixelColor.add(this._rayColor(r, this.maxDepth));
        }
        writeColor(stdout, pixelColor, this.samplesPerPixel);
      }
    }

    stderr("Done.");
  }

  _rayColor(r, depth) {
    const rec = new HitRecord();

    /* Ray bounce limit, no more light (it's the night) */
    if (depth <= 0) {
      return new Color(0, 0, 0);
    }

    if (!this.world.hit(r, new Interval(0.001, Infinity), rec)) {
      return this.background;
    }

    const scattered = new Ray();
    const attenutation = new Color();
    const emitted = rec.mat.emitted(rec.u, rec.v, rec.p);

    if (!rec.mat.scatter(r, rec, attenutation, scattered)) {
      return emitted;
    }

    return emitted.add(attenutation.mul(this._rayColor(scattered, depth - 1)));
  }
}
