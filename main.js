import { Ray } from "./ray.js";
import { Color, Point3, Vec3, Matrix } from "./vec3.js";
import writeColor from "./writeColor.js";

const stdout = (text) => process.stdout.write(text);
const stderr = (text) => process.stderr.write(text);

/**
 * Hit sphere
 *
 * x² + y² + z² = R²
 *
 * When a point is on the sphere
 *   x² + y² + z² = R²
 * When a point is inside the sphere
 *   x² + y² + z² < R²
 * When a point is outside the sphere
 *   x² + y² + z² > R²
 *
 * Formulas with origin C = (Cx, Cy, Cz)
 *   (x - Cx)² + (y - Cy)² + (z - Cz)² = r²
 * Same formulas with vectors P = (x, y, z)
 *   (P - C) · (P - C) = r²
 *
 * Any point P that satisfies this equation is on the sphere.
 *
 * We can replace P by P(t): (P(t) - C) · (P(t) - C) = r²
 * Our ray: P(t) = A + t·b
 *
 * The equation can be changed to:
 *   (A + t·b - C) · (A + t·b - C) = r²
 * We search the 0:
 *   t²·b² + 2·t·b · (A - C) + (A - C)² - r² = 0
 *
 * Ref. https://fr.wikipedia.org/wiki/Sph%C3%A8re#%C3%89quations
 *
 * @param {Point3} center
 * @param {Number} radius
 * @param {Ray} r
 * @returns
 */
function hitSphere(center, radius, r) {
  /* Legend
   * (A - C) : is the sphere origin (r.origin - center)
   * r       : is the radius
   * b       : is the direction (r.direction)
   *
   * Ref. https://fr.wikipedia.org/wiki/%C3%89quation_du_second_degr%C3%A9#Discriminant
   */
  const oc = r.origin.sub(center);
  const a = Matrix.dot(r.direction, r.direction); // b²
  const b = Matrix.dot(oc, r.direction) * 2; // 2·b · (A - C)
  const c = Matrix.dot(oc, oc) - radius * radius; // (A - C)² - r²
  const discriminant = b * b - a * c * 4; // b² - 4·a·c
  if (discriminant < 0) {
    return -1;
  }
  /* Solutions for positive discriminant
   *  x1 = (-b - sqrt(b² - 4·a·c)) * 1/(2·a)
   *  x2 = (-b + sqrt(b² - 4·a·c)) * 1/(2·a)
   *
   * Ref. https://fr.wikipedia.org/wiki/%C3%89quation_du_second_degr%C3%A9#Discriminant_strictement_positif
   */
  return (-b - Math.sqrt(discriminant)) / (2 * a);
}

/**
 * @param {Ray} r
 */
function rayColor(r) {
  let t = hitSphere(new Point3(0, 0, -1), 0.5, r);
  if (t > 0) {
    const N = r.at(t).sub(new Vec3(0, 0, -1)).unitVector(); // retrieve the normal
    return new Color(N.x + 1, N.y + 1, N.z + 1).mul(0.5); // colormap for the normals
  }
  const unitDirection = r.direction.unitVector();
  t = 0.5 * (unitDirection.y + 1);
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
      const pixelColor = rayColor(r);
      writeColor(stdout, pixelColor);
    }
  }

  stderr("Done.");
}

main();
