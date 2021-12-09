import { Ray } from "./ray.js";
import { Color, Point3, Vec3 } from "./vec3.js";
import writeColor from "./writeColor.js";

const stdout = (text) => process.stdout.write(text);
const stderr = (text) => process.stderr.write(text);

/**
 * @param {Ray} r
 */
function rayColor(r) {
  const unitDirection = r.direction.unitVector();
  const t = 0.5 * (unitDirection.y + 1);
  return new Color(1, 1, 1).mul(1 - t).add(new Color(0.5, 0.7, 1.0).mul(t));
}

function main() {
  /* Image */

  const aspectRatio = 16 / 9;
  const imageWidth = 400;
  const imageHeight = parseInt(imageWidth / aspectRatio);

  /* Camera */

  const viewportHeight = 2;
  const viewportWidth = aspectRatio * viewportHeight;
  const focalLength = 1;

  const origin = new Point3(0, 0, 0);
  const horizontal = new Vec3(viewportWidth, 0, 0);
  const vertical = new Vec3(0, viewportHeight, 0);
  const lowerLeftCorner = origin
    .subNew(horizontal.divNew(2))
    .subNew(vertical.divNew(2))
    .subNew(new Vec3(0, 0, focalLength));

  /* Render */

  stdout(`P3\n${imageWidth} ${imageHeight}\n255\n`);

  for (let j = imageHeight - 1; j >= 0; --j) {
    stderr(`\ncanlines remaining: ${j} `);
    for (let i = 0; i < imageWidth; ++i) {
      const u = i / (imageWidth - 1);
      const v = j / (imageHeight - 1);
      const r = new Ray(
        origin,
        lowerLeftCorner
          .addNew(horizontal.mulNew(u))
          .addNew(vertical.mulNew(v))
          .subNew(origin)
      );
      const pixelColor = rayColor(r);
      writeColor(stdout, pixelColor);
    }
  }

  stderr("Done.");
}

main();
