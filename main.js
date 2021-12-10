import { Ray } from "./ray.js";
import { Color, Matrix, Point3, Vec3 } from "./vec3.js";
import { HitRecord } from "./hittable.js";
import { HittableList } from "./hittableList.js";
import { Sphere } from "./sphere.js";
import { Camera } from "./camera.js";
import writeColor from "./writeColor.js";

const stdout = (text) => process.stdout.write(text);
const stderr = (text) => process.stderr.write(text);

function randomInUnitSphere() {
  while (true) {
    const p = Vec3.random(-1, 1);
    if (p.lengthSquared >= 1) {
      continue;
    }
    return p;
  }
}

function randomUnitVector() {
  return randomInUnitSphere().unitVector();
}

function randomInHemisphere(normal) {
  const inUnitSphere = randomInUnitSphere();
  return Matrix.dot(inUnitSphere, normal) > 0
    ? inUnitSphere
    : inUnitSphere.not();
}

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
    /* Diffuse renderers
     * 1. Rejection method
     * 2. True Lambertian reflection
     * 3. Alternative diffuse formulation
     */
    //const target = rec.p.add(rec.normal).add(randomInUnitSphere()); /* [1] */
    //const target = rec.p.add(rec.normal).add(); /* [2] */
    const target = rec.p.add(randomInHemisphere(rec.normal)); /* [3] */
    return rayColor(new Ray(rec.p, target.sub(rec.p)), world, depth - 1).mul(
      0.5
    );
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
  world.add(new Sphere(new Point3(0, 0, -1), 0.5));
  world.add(new Sphere(new Point3(0, -100.5, -1), 100));

  /* Camera */

  const cam = new Camera();

  /* Render */

  stdout(`P3\n${imageWidth} ${imageHeight}\n255\n`);

  for (let j = imageHeight - 1; j >= 0; --j) {
    stderr(`\ncanlines remaining: ${j} `);
    for (let i = 0; i < imageWidth; ++i) {
      const pixelColor = new Color(0, 0, 0);
      /* Antialiasing */
      for (let s = 0; s < samplesPerPixel; ++s) {
        const u = (i + Math.random()) / (imageWidth - 1);
        const v = (j + Math.random()) / (imageHeight - 1);
        const r = cam.getRay(u, v);
        pixelColor._add(rayColor(r, world, maxDepth));
      }
      writeColor(stdout, pixelColor, samplesPerPixel);
    }
  }

  stderr("Done.");
}

main();
