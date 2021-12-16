import { Color, Point3, Vec3 } from "./vec3.js";
import { random } from "./utils.js";
import { HittableList } from "./hittableList.js";
import { RotateY, Translate } from "./hittable.js";
import { Sphere } from "./sphere.js";
import { MovingSphere } from "./moving-sphere.js";
import {
  Dielectric,
  DiffuseLight,
  Lambertian,
  Material,
  Metal,
} from "./material.js";
import { CheckerTexture, ImageTexture, NoiseTexture } from "./texture.js";
import { Scene } from "./scene.js";
import { BVHnode } from "./bvh.js";
import { Quad, box } from "./quad.js";
import { ConstantMedium } from "./constant-medium.js";

function initWorld(world) {
  return new HittableList(new BVHnode(world));
}

function randomSpheres(sceneDesc) {
  sceneDesc.aspectRatio = 16.0 / 9.0;
  sceneDesc.imageWidth = 400;
  sceneDesc.samplesPerPixel = 100;

  sceneDesc.cam.lookfrom = new Vec3(13, 2, 3);
  sceneDesc.cam.lookat = new Vec3(0, 0, 0);
  sceneDesc.cam.vup = new Vec3(0, 1, 0);
  sceneDesc.cam.vfov = 20.0;
  sceneDesc.cam.aperture = 0.1;
  sceneDesc.cam.focusDist = 10.0;

  const { world } = sceneDesc;

  const checker = new CheckerTexture(
    0.32,
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

      if (center.sub(new Vec3(4, 0.2, 0)).length > 0.9) {
        let sphereMaterial = new Material();

        if (chooseMat < 0.8) {
          /* diffuse */
          const albedo = new Color().random().mul(new Color().random());
          sphereMaterial = new Lambertian(albedo);
          const center2 = center.add(new Vec3(0, random(0, 0.5), 0));
          world.add(new MovingSphere(center, center2, 0.2, sphereMaterial));
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

  sceneDesc.world = initWorld(world);
}

function twoSpheres(sceneDesc) {
  sceneDesc.imageWidth = 400;
  sceneDesc.aspectRatio = 16.0 / 9.0;
  sceneDesc.samplesPerPixel = 100;

  sceneDesc.cam.aperture = 0.0;
  sceneDesc.cam.vfov = 20.0;
  sceneDesc.cam.lookfrom = new Vec3(13, 2, 3);
  sceneDesc.cam.lookat = new Vec3(0, 0, 0);

  const { world } = sceneDesc;

  const checker = new CheckerTexture(
    0.8,
    new Color(0.2, 0.3, 0.1),
    new Color(0.9, 0.9, 0.9)
  );

  world.add(new Sphere(new Point3(0, -10, 0), 10, new Lambertian(checker)));
  world.add(new Sphere(new Point3(0, 10, 0), 10, new Lambertian(checker)));
}

function twoPerlinSpheres(sceneDesc) {
  sceneDesc.imageWidth = 400;
  sceneDesc.aspectRatio = 16.0 / 9.0;
  sceneDesc.samplesPerPixel = 100;

  sceneDesc.cam.aperture = 0.0;
  sceneDesc.cam.vfov = 20.0;
  sceneDesc.cam.lookfrom = new Vec3(13, 2, 3);
  sceneDesc.cam.lookat = new Vec3(0, 0, 0);

  const { world } = sceneDesc;

  const pertext = new NoiseTexture(4);
  world.add(new Sphere(new Point3(0, -1000, 0), 1000, new Lambertian(pertext)));
  world.add(new Sphere(new Point3(0, 2, 0), 2, new Lambertian(pertext)));
}

function earth(sceneDesc) {
  sceneDesc.imageWidth = 400;
  sceneDesc.aspectRatio = 16.0 / 9.0;
  sceneDesc.samplesPerPixel = 100;

  sceneDesc.cam.aperture = 0.0;
  sceneDesc.cam.vfov = 20.0;
  sceneDesc.cam.lookfrom = new Vec3(13, 2, 3);
  sceneDesc.cam.lookat = new Vec3(0, 0, 0);

  const earthTexture = new ImageTexture("./assets/earthmap.xpm");
  const earthSurface = new Lambertian(earthTexture);
  const globe = new Sphere(new Point3(0, 0, 0), 2, earthSurface);

  sceneDesc.world = new HittableList(globe);
}

function quads(sceneDesc) {
  sceneDesc.imageWidth = 400;
  sceneDesc.aspectRatio = 1.0;
  sceneDesc.samplesPerPixel = 100;

  sceneDesc.cam.aperture = 0.0;
  sceneDesc.cam.vfov = 80.0;
  sceneDesc.cam.lookfrom = new Vec3(0, 0, 9);
  sceneDesc.cam.lookat = new Vec3(0, 0, 0);

  const { world } = sceneDesc;

  const leftRed = new Lambertian(new Color(1, 0.2, 0.2));
  const backGreen = new Lambertian(new Color(0.2, 1, 0.2));
  const rightBlue = new Lambertian(new Color(0.2, 0.2, 1));
  const upperOrange = new Lambertian(new Color(1, 0.5, 0.0));
  const lowerTeal = new Lambertian(new Color(0.2, 0.8, 0.8));

  world.add(
    new Quad(
      new Point3(-3, -2, 5),
      new Vec3(0, 0, -4),
      new Vec3(0, 4, 0),
      leftRed
    )
  );
  world.add(
    new Quad(
      new Point3(-2, -2, 0),
      new Vec3(4, 0, 0),
      new Vec3(0, 4, 0),
      backGreen
    )
  );
  world.add(
    new Quad(
      new Point3(3, -2, 1),
      new Vec3(0, 0, 4),
      new Vec3(0, 4, 0),
      rightBlue
    )
  );
  world.add(
    new Quad(
      new Point3(-2, 3, 1),
      new Vec3(4, 0, 0),
      new Vec3(0, 0, 4),
      upperOrange
    )
  );
  world.add(
    new Quad(
      new Point3(-2, -3, 5),
      new Vec3(4, 0, 0),
      new Vec3(0, 0, -4),
      lowerTeal
    )
  );

  sceneDesc.world = initWorld(world);
}

function simpleLight(sceneDesc) {
  sceneDesc.imageWidth = 400;
  sceneDesc.aspectRatio = 16.0 / 9.0;
  sceneDesc.samplesPerPixel = 100;
  sceneDesc.background = new Color(0, 0, 0);

  sceneDesc.cam.aperture = 0.0;
  sceneDesc.cam.vfov = 20.0;
  sceneDesc.cam.lookfrom = new Vec3(26, 3, 6);
  sceneDesc.cam.lookat = new Vec3(0, 2, 0);

  const { world } = sceneDesc;

  const pertext = new NoiseTexture(4);
  world.add(new Sphere(new Point3(0, -1000, 0), 1000, new Lambertian(pertext)));
  world.add(new Sphere(new Point3(0, 2, 0), 2, new Lambertian(pertext)));

  const difflight = new DiffuseLight(new Color(4, 4, 4));
  world.add(new Sphere(new Point3(0, 7, 0), 2, difflight));
  world.add(
    new Quad(
      new Point3(3, 1, -2),
      new Vec3(2, 0, 0),
      new Vec3(0, 2, 0),
      difflight
    )
  );
}

function cornellBox(sceneDesc) {
  sceneDesc.imageWidth = 600;
  sceneDesc.aspectRatio = 1.0;
  sceneDesc.samplesPerPixel = 200;
  sceneDesc.background = new Color(0.0, 0.0, 0.0);

  sceneDesc.cam.lookfrom = new Vec3(278, 278, -800);
  sceneDesc.cam.lookat = new Vec3(278, 278, 0);
  sceneDesc.cam.vfov = 40.0;
  sceneDesc.cam.aperture = 0.0;

  const { world } = sceneDesc;

  const red = new Lambertian(new Color(0.65, 0.05, 0.05));
  const white = new Lambertian(new Color(0.73, 0.73, 0.73));
  const green = new Lambertian(new Color(0.12, 0.45, 0.15));
  const light = new DiffuseLight(new Color(15, 15, 15));

  world.add(
    new Quad(
      new Point3(555, 0, 0),
      new Vec3(0, 555, 0),
      new Vec3(0, 0, 555),
      green
    )
  );
  world.add(
    new Quad(
      new Point3(0, 0, 0), //
      new Vec3(0, 555, 0),
      new Vec3(0, 0, 555),
      red
    )
  );
  world.add(
    new Quad(
      new Point3(343, 554, 332),
      new Vec3(-130, 0, 0),
      new Vec3(0, 0, -105),
      light
    )
  );
  world.add(
    new Quad(
      new Point3(0, 0, 0),
      new Vec3(555, 0, 0),
      new Vec3(0, 0, 555),
      white
    )
  );
  world.add(
    new Quad(
      new Point3(555, 555, 555),
      new Vec3(-555, 0, 0),
      new Vec3(0, 0, -555),
      white
    )
  );
  world.add(
    new Quad(
      new Point3(0, 0, 555),
      new Vec3(555, 0, 0),
      new Vec3(0, 555, 0),
      white
    )
  );

  let box1 = box(new Point3(0, 0, 0), new Point3(165, 330, 165), white);
  box1 = new RotateY(box1, 15);
  box1 = new Translate(box1, new Vec3(265, 0, 295));
  world.add(box1);

  let box2 = box(new Point3(0, 0, 0), new Point3(165, 165, 165), white);
  box2 = new RotateY(box2, -18);
  box2 = new Translate(box2, new Vec3(130, 0, 65));
  world.add(box2);

  sceneDesc.world = initWorld(world);
}

function cornellSmoke(sceneDesc) {
  sceneDesc.imageWidth = 600;
  sceneDesc.aspectRatio = 1.0;
  sceneDesc.samplesPerPixel = 200;
  sceneDesc.background = new Color(0.0, 0.0, 0.0);

  sceneDesc.cam.lookfrom = new Vec3(278, 278, -800);
  sceneDesc.cam.lookat = new Vec3(278, 278, 0);
  sceneDesc.cam.vfov = 40.0;
  sceneDesc.cam.aperture = 0.0;

  const { world } = sceneDesc;

  const red = new Lambertian(new Color(0.65, 0.05, 0.05));
  const white = new Lambertian(new Color(0.73, 0.73, 0.73));
  const green = new Lambertian(new Color(0.12, 0.45, 0.15));
  const light = new DiffuseLight(new Color(7, 7, 7));

  world.add(
    new Quad(
      new Point3(555, 0, 0),
      new Vec3(0, 555, 0),
      new Vec3(0, 0, 555),
      green
    )
  );
  world.add(
    new Quad(
      new Point3(0, 0, 0), //
      new Vec3(0, 555, 0),
      new Vec3(0, 0, 555),
      red
    )
  );
  world.add(
    new Quad(
      new Point3(113, 554, 127),
      new Vec3(330, 0, 0),
      new Vec3(0, 0, 305),
      light
    )
  );
  world.add(
    new Quad(
      new Point3(0, 0, 0),
      new Vec3(555, 0, 0),
      new Vec3(0, 0, 555),
      white
    )
  );
  world.add(
    new Quad(
      new Point3(555, 555, 555),
      new Vec3(-555, 0, 0),
      new Vec3(0, 0, -555),
      white
    )
  );
  world.add(
    new Quad(
      new Point3(0, 0, 555),
      new Vec3(555, 0, 0),
      new Vec3(0, 555, 0),
      white
    )
  );

  let box1 = box(new Point3(0, 0, 0), new Point3(165, 330, 165), white);
  box1 = new RotateY(box1, 15);
  box1 = new Translate(box1, new Vec3(265, 0, 295));
  box1 = new ConstantMedium(box1, 0.01, new Color(0, 0, 0));
  world.add(box1);

  let box2 = box(new Point3(0, 0, 0), new Point3(165, 165, 165), white);
  box2 = new RotateY(box2, -18);
  box2 = new Translate(box2, new Vec3(130, 0, 65));
  box2 = new ConstantMedium(box2, 0.01, new Color(1, 1, 1));
  world.add(box2);

  sceneDesc.world = initWorld(world);
}

function main() {
  const sceneDesc = new Scene();

  sceneDesc.background = new Color(0.7, 0.8, 1.0);

  sceneDesc.cam.vup = new Vec3(0, 1, 0);
  sceneDesc.cam.focusDist = 10;

  switch (0) {
    case 1:
      randomSpheres(sceneDesc);
      break;

    case 2:
      twoSpheres(sceneDesc);
      break;

    case 3:
      twoPerlinSpheres(sceneDesc);
      break;

    case 4:
      earth(sceneDesc);
      break;

    case 5:
      quads(sceneDesc);
      break;

    case 6:
      simpleLight(sceneDesc);
      break;

    case 7:
      cornellBox(sceneDesc);
      break;

    default:
    case 8:
      cornellSmoke(sceneDesc);
      break;
  }

  sceneDesc.render();
}

main();
