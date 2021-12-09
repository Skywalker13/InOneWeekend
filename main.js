import { Ray } from "./ray.js";
import { Color, Point3, Vec3 } from "./vec3.js";
import { HitRecord } from "./hittable.js";
import { HittableList } from "./hittableList.js";
import { Sphere } from "./sphere.js";
import writeColor from "./writeColor.js";

const stdout = (text) => process.stdout.write(text);
const stderr = (text) => process.stderr.write(text);

/**
 * @param {Ray} r
 */
function rayColor(r, world) {
  const rec = new HitRecord();
  if (world.hit(r, 0, Infinity, rec)) {
    return new Color(1, 1, 1).add(rec.normal).mul(0.5);
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

  /* World */

  const world = new HittableList();
  world.add(new Sphere(new Point3(0, 0, -1), 0.5));
  world.add(new Sphere(new Point3(0, -100.5, -1), 100));

  /* Camera */

  const viewportHeight = 2;
  const viewportWidth = aspectRatio * viewportHeight;
  const focalLength = 1;

  const origin = new Point3(0, 0, 0);
  const horizontal = new Vec3(viewportWidth, 0, 0);
  const vertical = new Vec3(0, viewportHeight, 0);
  const lowerLeftCorner = origin
    .sub(horizontal.div(2))
    .sub(vertical.div(2))
    .sub(new Vec3(0, 0, focalLength));

  /* Render */

  stdout(`P3\n${imageWidth} ${imageHeight}\n255\n`);

  for (let j = imageHeight - 1; j >= 0; --j) {
    stderr(`\ncanlines remaining: ${j} `);
    for (let i = 0; i < imageWidth; ++i) {
      const u = i / (imageWidth - 1);
      const v = j / (imageHeight - 1);
      const r = new Ray(
        origin,
        lowerLeftCorner.add(horizontal.mul(u)).add(vertical.mul(v)).sub(origin)
      );
      const pixelColor = rayColor(r, world);
      writeColor(stdout, pixelColor);
    }
  }

  stderr("Done.");
}

main();
