import { clamp } from "./utils.js";

export default function (out, pixelColor, samplesPerPixel) {
  let { r, g, b } = pixelColor;

  /* Divide the color by the number of samples (antialiasing) */
  const scale = 1 / samplesPerPixel;
  /* Gamma correction of 2.0 */
  r = Math.sqrt(scale * r);
  g = Math.sqrt(scale * g);
  b = Math.sqrt(scale * b);

  out(
    `${parseInt(256 * clamp(r, 0, 0.999))} ` +
      `${parseInt(256 * clamp(g, 0, 0.999))} ` +
      `${parseInt(256 * clamp(b, 0, 0.999))}\n`
  );
}
