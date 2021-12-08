import { color } from "./vec3.js";
import writeColor from "./writeColor.js";

const stdout = (text) => process.stdout.write(text);
const stderr = (text) => process.stderr.write(text);

export default function render() {
  const width = 256;
  const height = 256;

  stdout(`P3\n${width} ${height}\n255\n`);

  for (let j = height - 1; j >= 0; --j) {
    stderr(`\ncanlines remaining: ${j} `);
    for (let i = 0; i < width; ++i) {
      const pixelColor = new color(i / (width - 1), j / (height - 1), 0.25);
      writeColor(stdout, pixelColor);
    }
  }

  stderr("Done.");
}

render();
