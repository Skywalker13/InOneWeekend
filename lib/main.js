import { Ray } from "./ray.js";
import { Color, Point3, Vec3 } from "./vec3.js";
import { random } from "./utils.js";
import { HitRecord } from "./hittable.js";
import { HittableList } from "./hittableList.js";
import { Sphere } from "./sphere.js";
import { MovingSphere } from "./moving-sphere.js";
import { Camera } from "./camera.js";
import { Dielectric, Lambertian, Material, Metal } from "./material.js";
import { CheckerTexture } from "./texture.js";
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

function randomScene() {
  const world = new HittableList();

  const checker = new CheckerTexture(
    new Color(0.2, 0.3, 0.1),
    new Color(0.9, 0.9, 0.9)
  );
  world.add(new Sphere(new Point3(0, -1000, 0), 1000, new Lambertian(checker)));

  for (let a = -11; a < 11; ++a) {
    for (let b = -11; b < 11; ++b) {
      const chooseMat = Math.random();
      const center = new Point3(
        a + 0.9 * Math.random(),
        0.2,
        b + 0.9 * Math.random()
      );

      if (center.sub(new Point3(4, 0.2, 0)).length > 0.9) {
        let sphereMaterial = new Material();

        if (chooseMat < 0.8) {
          /* diffuse */
          const albedo = new Color().random().mul(new Color().random());
          sphereMaterial = new Lambertian(albedo);
          const center2 = center.add(new Vec3(0, random(0, 0.5), 0));
          world.add(
            new MovingSphere(center, center2, 0.0, 1.0, 0.2, sphereMaterial)
          );
        } else if (chooseMat < 0.95) {
          /* metal */
          const albedo = new Color().random(0.5, 1);
          const fuzz = random(0, 0.5);
          sphereMaterial = new Metal(albedo, fuzz);
          world.add(new Sphere(center, 0.2, sphereMaterial));
        } else {
          /* glass */
          sphereMaterial = new Dielectric(1.5);
          world.add(new Sphere(center, 0.2, sphereMaterial));
        }
      }
    }
  }

  const material1 = new Dielectric(1.5);
  world.add(new Sphere(new Point3(0, 1, 0), 1.0, material1));

  const material2 = new Lambertian(new Color(0.4, 0.2, 0.1));
  world.add(new Sphere(new Point3(-4, 1, 0), 1.0, material2));

  const material3 = new Metal(new Color(0.7, 0.6, 0.5), 0.0);
  world.add(new Sphere(new Point3(4, 1, 0), 1.0, material3));

  return world;
}

function main() {
  /* Image */

  const aspectRatio = 16 / 9;
  const imageWidth = 400;
  const samplesPerPixel = 100;
  const maxDepth = 50;

  /* World */

  const world = randomScene();

  /* Camera */

  const lookfrom = new Point3(13, 2, 3);
  const lookat = new Point3(0, 0, 0);
  const vup = new Vec3(0, 1, 0);
  const distToFocus = 10;
  const aperture = 0.1;
  const imageHeight = parseInt(imageWidth / aspectRatio);

  const cam = new Camera(
    lookfrom,
    lookat,
    vup,
    20.0,
    aspectRatio,
    aperture,
    distToFocus,
    0.0,
    1.0
  );

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
