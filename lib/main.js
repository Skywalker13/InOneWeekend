import { Color, Point3, Vec3 } from "./vec3.js";
import { random } from "./utils.js";
import { HittableList } from "./hittableList.js";
import { RotateY, Translate } from "./hittable.js";
import { Sphere } from "./sphere.js";
import { MovingSphere } from "./movingSphere.js";
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
import { ConstantMedium } from "./constantMedium.js";

function backgroundSky(r) {
  const unitDirection = r.direction.unitVector();
  const t = 0.5 * (unitDirection.y + 1);
  return new Color(1, 1, 1).mul(1 - t).add(new Color(0.5, 0.7, 1.0).mul(t));
}

function randomSpheresZero(sceneDesc) {
  sceneDesc.aspectRatio = 3.0 / 2.0;
  sceneDesc.imageWidth = 1200;
  sceneDesc.samplesPerPixel = 500;
  sceneDesc.background = backgroundSky;

  sceneDesc.cam.lookfrom = new Vec3(13, 2, 3);
  sceneDesc.cam.lookat = new Vec3(0, 0, 0);
  sceneDesc.cam.vup = new Vec3(0, 1, 0);
  sceneDesc.cam.vfov = 20.0;
  sceneDesc.cam.aperture = 0.1;
  sceneDesc.cam.focusDist = 10.0;

  const { world } = sceneDesc;

  const groundMaterial = new Lambertian(new Color(0.5, 0.5, 0.5));
  world.add(new Sphere(new Point3(0, -1000, 0), 1000, groundMaterial));

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
          world.add(new Sphere(center, 0.2, sphereMaterial));
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

  sceneDesc.world = new HittableList(new BVHnode(world));
}

function randomSpheres(sceneDesc) {
  sceneDesc.aspectRatio = 16.0 / 9.0;
  sceneDesc.imageWidth = 400;
  sceneDesc.samplesPerPixel = 100;
  sceneDesc.background = backgroundSky;

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

  sceneDesc.world = new HittableList(new BVHnode(world));
}

function twoSpheres(sceneDesc) {
  sceneDesc.imageWidth = 400;
  sceneDesc.aspectRatio = 16.0 / 9.0;
  sceneDesc.samplesPerPixel = 100;
  sceneDesc.background = backgroundSky;

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
  sceneDesc.background = backgroundSky;

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
  sceneDesc.background = backgroundSky;

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
  sceneDesc.background = backgroundSky;

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

  let box2 = box(new Point3(0, 0, 0), new Point3(165, 165, 165), white);
  box2 = new RotateY(box2, -18);
  box2 = new Translate(box2, new Vec3(130, 0, 65));

  world.add(new ConstantMedium(box1, 0.01, new Color(0, 0, 0)));
  world.add(new ConstantMedium(box2, 0.01, new Color(1, 1, 1)));
}

function finalScene(sceneDesc) {
  sceneDesc.imageWidth = 800;
  sceneDesc.aspectRatio = 1.0;
  sceneDesc.samplesPerPixel = 10000;
  sceneDesc.background = new Color(0.0, 0.0, 0.0);

  sceneDesc.cam.aperture = 0.0;
  sceneDesc.cam.vfov = 40.0;
  sceneDesc.cam.lookfrom = new Vec3(478, 278, -600);
  sceneDesc.cam.lookat = new Vec3(278, 278, 0);

  const boxes1 = new HittableList();
  const ground = new Lambertian(new Color(0.48, 0.83, 0.53));

  const boxesPerSide = 20;
  for (let i = 0; i < boxesPerSide; ++i) {
    for (let j = 0; j < boxesPerSide; ++j) {
      const w = 100;
      const x0 = -1000 + i * w;
      const z0 = -1000 + j * w;
      const y0 = 0.0;
      const x1 = x0 + w;
      const y1 = random(1, 101);
      const z1 = z0 + w;

      boxes1.add(box(new Point3(x0, y0, z0), new Point3(x1, y1, z1), ground));
    }
  }

  const { world } = sceneDesc;

  world.add(new BVHnode(boxes1));

  const light = new DiffuseLight(new Color(7, 7, 7));
  world.add(
    new Quad(
      new Point3(123, 554, 147),
      new Vec3(300, 0, 0),
      new Vec3(0, 0, 265),
      light
    )
  );

  const center1 = new Point3(400, 400, 200);
  const center2 = center1.add(new Vec3(30, 0, 0));
  const movingSphereMaterial = new Lambertian(new Color(0.7, 0.3, 0.1));
  world.add(new MovingSphere(center1, center2, 50, movingSphereMaterial));

  world.add(new Sphere(new Point3(260, 150, 45), 50, new Dielectric(1.5)));
  world.add(
    new Sphere(
      new Point3(0, 150, 145),
      50,
      new Metal(new Color(0.8, 0.8, 0.9), 1.0)
    )
  );

  let boundary = new Sphere(new Point3(360, 150, 145), 70, new Dielectric(1.5));
  world.add(boundary);
  world.add(new ConstantMedium(boundary, 0.2, new Color(0.2, 0.4, 0.9)));
  boundary = new Sphere(new Point3(0, 0, 0), 5000, new Dielectric(1.5));
  world.add(new ConstantMedium(boundary, 0.0001, new Color(1, 1, 1)));

  const emat = new Lambertian(new ImageTexture("./assets/earthmap.xpm"));
  world.add(new Sphere(new Point3(400, 200, 400), 100, emat));
  const pertext = new NoiseTexture(0.1);
  world.add(new Sphere(new Point3(220, 280, 300), 80, new Lambertian(pertext)));

  const boxes2 = new HittableList();
  const white = new Lambertian(new Color(0.73, 0.73, 0.73));
  const ns = 1000;
  for (let j = 0; j < ns; ++j) {
    boxes2.add(new Sphere(new Point3().random(0, 165), 10, white));
  }

  world.add(
    new Translate(
      new RotateY(new BVHnode(boxes2), 15),
      new Vec3(-100, 270, 395)
    )
  );
}

function defaultScene(sceneDesc) {
  finalScene(sceneDesc);
  sceneDesc.imageWidth = 400;
  sceneDesc.samplesPerPixel = 250;
  sceneDesc.maxDepth = 4;
}

function main() {
  const sceneDesc = new Scene();

  sceneDesc.background = new Color(0.7, 0.8, 1.0);

  sceneDesc.cam.vup = new Vec3(0, 1, 0);
  sceneDesc.cam.focusDist = 10;

  switch (0) {
    case -1:
      randomSpheresZero(sceneDesc);
      break;

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

    case 8:
      cornellSmoke(sceneDesc);
      break;

    case 9:
      finalScene(sceneDesc);
      break;

    default:
      defaultScene(sceneDesc);
      break;
  }

  sceneDesc.render();
}

main();
