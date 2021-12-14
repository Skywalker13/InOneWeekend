import { Ray } from "./ray.js";
import { Color, Point3, Vec3 } from "./vec3.js";
import { random } from "./utils.js";
import { HitRecord } from "./hittable.js";
import { HittableList } from "./hittableList.js";
import { Sphere } from "./sphere.js";
import { MovingSphere } from "./moving-sphere.js";
import { Camera } from "./camera.js";
import {
  Dielectric,
  DiffuseLight,
  Lambertian,
  Material,
  Metal,
} from "./material.js";
import { CheckerTexture, ImageTexture, NoiseTexture } from "./texture.js";
import writeColor from "./writeColor.js";
import { XYrect, XZrect, YZrect } from "./aarect.js";
import { Box } from "./box.js";

const stdout = (text) => process.stdout.write(text);
const stderr = (text) => process.stderr.write(text);

/**
 * @param {Ray} r
 */
function rayColor(r, background, world, depth) {
  const rec = new HitRecord();

  /* Ray bounce limit, no more light (it's the night) */
  if (depth <= 0) {
    return new Color(0, 0, 0);
  }

  if (!world.hit(r, 0.000001, Infinity, rec)) {
    return background;
  }

  const scattered = new Ray();
  const attenutation = new Color();
  const emitted = rec.mat.emitted(rec.u, rec.v, rec.p);

  if (!rec.mat.scatter(r, rec, attenutation, scattered)) {
    return emitted;
  }

  return emitted.add(
    attenutation.mul(rayColor(scattered, background, world, depth - 1))
  );
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

function twoSpheres() {
  const objects = new HittableList();

  const checker = new CheckerTexture(
    new Color(0.2, 0.3, 0.1),
    new Color(0.9, 0.9, 0.9)
  );

  objects.add(new Sphere(new Point3(0, -10, 0), 10, new Lambertian(checker)));
  objects.add(new Sphere(new Point3(0, 10, 0), 10, new Lambertian(checker)));

  return objects;
}

function twoPerlinSpheres() {
  const objects = new HittableList();

  const pertext = new NoiseTexture(4);
  objects.add(
    new Sphere(new Point3(0, -1000, 0), 1000, new Lambertian(pertext))
  );
  objects.add(new Sphere(new Point3(0, 2, 0), 2, new Lambertian(pertext)));

  return objects;
}

function earth() {
  const earthTexture = new ImageTexture("./assets/earthmap.xpm");
  const earthSurface = new Lambertian(earthTexture);
  const globe = new Sphere(new Point3(0, 0, 0), 2, earthSurface);

  return new HittableList(globe);
}

function simpleLight() {
  const objects = new HittableList();

  const pertext = new NoiseTexture(4);
  objects.add(
    new Sphere(new Point3(0, -1000, 0), 1000, new Lambertian(pertext))
  );
  objects.add(new Sphere(new Point3(0, 2, 0), 2, new Lambertian(pertext)));

  const difflight = new DiffuseLight(new Color(4, 4, 4));
  objects.add(new XYrect(3, 5, 1, 3, -2, difflight));

  return objects;
}

function cornellBox() {
  const objects = new HittableList();

  const red = new Lambertian(new Color(0.65, 0.05, 0.05));
  const white = new Lambertian(new Color(0.73, 0.73, 0.73));
  const green = new Lambertian(new Color(0.12, 0.45, 0.15));
  const light = new DiffuseLight(new Color(15, 15, 15));

  objects.add(new YZrect(0, 555, 0, 555, 555, green));
  objects.add(new YZrect(0, 555, 0, 555, 0, red));
  objects.add(new XZrect(213, 343, 227, 332, 554, light));
  objects.add(new XZrect(0, 555, 0, 555, 0, white));
  objects.add(new XZrect(0, 555, 0, 555, 555, white));
  objects.add(new XYrect(0, 555, 0, 555, 555, white));

  objects.add(
    new Box(new Point3(130, 0, 65), new Point3(295, 165, 230), white)
  );
  objects.add(
    new Box(new Point3(265, 0, 295), new Point3(430, 330, 460), white)
  );

  return objects;
}

function main() {
  /* Image */

  let aspectRatio = 16 / 9;
  let imageWidth = 400;
  let samplesPerPixel = 100;
  const maxDepth = 50;

  /* World */

  let world;

  let lookfrom;
  let lookat;
  let vfov = 40.0;
  let aperture = 0.0;
  let background = new Color(0, 0, 0);

  switch (0) {
    case 1: {
      world = randomScene();
      background = new Color(0.7, 0.8, 1.0);
      lookfrom = new Point3(13, 2, 3);
      lookat = new Point3(0, 0, 0);
      vfov = 20.0;
      aperture = 0.1;
      break;
    }

    case 2: {
      world = twoSpheres();
      background = new Color(0.7, 0.8, 1.0);
      lookfrom = new Point3(13, 2, 3);
      lookat = new Point3(0, 0, 0);
      vfov = 20.0;
      break;
    }

    case 3: {
      world = twoPerlinSpheres();
      background = new Color(0.7, 0.8, 1.0);
      lookfrom = new Point3(13, 2, 3);
      lookat = new Point3(0, 0, 0);
      vfov = 20.0;
      break;
    }

    case 4: {
      world = earth();
      background = new Color(0.7, 0.8, 1.0);
      lookfrom = new Point3(13, 2, 3);
      lookat = new Point3(0, 0, 0);
      vfov = 20.0;
      break;
    }

    case 5: {
      world = simpleLight();
      samplesPerPixel = 400;
      background = new Color(0, 0, 0);
      lookfrom = new Point3(26, 3, 6);
      lookat = new Point3(0, 2, 0);
      vfov = 20.0;
      break;
    }

    default:
    case 6: {
      world = cornellBox();
      aspectRatio = 1.0;
      imageWidth = 600;
      samplesPerPixel = 200;
      background = new Color(0, 0, 0);
      lookfrom = new Point3(278, 278, -800);
      lookat = new Point3(278, 278, 0);
      vfov = 40.0;
      break;
    }
  }

  /* Camera */

  const vup = new Vec3(0, 1, 0);
  const distToFocus = 10.0;
  const imageHeight = parseInt(imageWidth / aspectRatio);

  const cam = new Camera(
    lookfrom,
    lookat,
    vup,
    vfov,
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
        pixelColor = pixelColor.add(rayColor(r, background, world, maxDepth));
      }
      writeColor(stdout, pixelColor, samplesPerPixel);
    }
  }

  stderr("Done.");
}

main();
