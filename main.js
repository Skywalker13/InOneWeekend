import { Ray } from "./ray.js";
import { Color, Matrix, Point3, Vec3 } from "./vec3.js";
import { HitRecord } from "./hittable.js";
import { HittableList } from "./hittableList.js";
import { Sphere } from "./sphere.js";
import { Camera } from "./camera.js";
import { Dielectric, Lambertian, Metal } from "./material.js";
import writeColor from "./writeColor.js";

const stdout = (text) => process.stdout.write(text);
const stderr = (text) => process.stderr.write(text);

/**
 * @param {Ray} r
 */
function rayColor(r, world, depth) {
  const rec = new HitRecord();

  /* Ray bounce limit, no more light (it's the night) */
  if (depth <= 0) {
    return new Color(0, 0, 0);
  }

  if (world.hit(r, 0.000001, Infinity, rec)) {
    const scattered = new Ray();
    const attenutation = new Color();
    if (rec.mat.scatter(r, rec, attenutation, scattered)) {
      return rayColor(scattered, world, depth - 1).mul(attenutation);
    }
    return new Color(0, 0, 0);
  }
  const unitDirection = r.direction.unitVector();
  const t = 0.5 * (unitDirection.y + 1);
  return new Color(1, 1, 1).mul(1 - t).add(new Color(0.5, 0.7, 1.0).mul(t));
}

function main() {
  /* Image */

  const aspectRatio = 16 / 9;
  const imageWidth = 400;
  const imageHeight = parseInt(imageWidth / aspectRatio);
  const samplesPerPixel = 100;
  const maxDepth = 50;

  /* World */

  const world = new HittableList();

  const materialGround = new Lambertian(new Color(0.8, 0.8, 0.0));
  const materialCenter = new Lambertian(new Color(0.1, 0.2, 0.5));
  const materialLeft = new Dielectric(1.5);
  const materialRight = new Metal(new Color(0.8, 0.6, 0.2), 0.0);

  world.add(new Sphere(new Point3(0.0, -100.5, -1.0), 100.0, materialGround));
  world.add(new Sphere(new Point3(0.0, 0.0, -1.0), 0.5, materialCenter));
  world.add(new Sphere(new Point3(-1.0, 0.0, -1.0), 0.5, materialLeft));
  world.add(new Sphere(new Point3(-1.0, 0.0, -1.0), -0.4, materialLeft));
  world.add(new Sphere(new Point3(1.0, 0.0, -1.0), 0.5, materialRight));

  /* Camera */

  const cam = new Camera();

  /* Render */

  stdout(`P3\n${imageWidth} ${imageHeight}\n255\n`);

  for (let j = imageHeight - 1; j >= 0; --j) {
    stderr(`\nScanlines remaining: ${j} `);
    for (let i = 0; i < imageWidth; ++i) {
      let pixelColor = new Color(0, 0, 0);
      /* Antialiasing */
      for (let s = 0; s < samplesPerPixel; ++s) {
        const u = (i + Math.random()) / (imageWidth - 1);
        const v = (j + Math.random()) / (imageHeight - 1);
        const r = cam.getRay(u, v);
        pixelColor = pixelColor.add(rayColor(r, world, maxDepth));
      }
      writeColor(stdout, pixelColor, samplesPerPixel);
    }
  }

  stderr("Done.");
}

main();
