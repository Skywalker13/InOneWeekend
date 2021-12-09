import { clamp } from "./utils.js";

export default function (out, pixelColor, samplesPerPixel) {
  let { r, g, b } = pixelColor;

  /* Divide the color by the number of samples (antialiasing) */
  const scale = 1 / samplesPerPixel;
  r *= scale;
  g *= scale;
  b *= scale;

  out(
    `${parseInt(256 * clamp(r, 0, 0.999))} ` +
      `${parseInt(256 * clamp(g, 0, 0.999))} ` +
      `${parseInt(256 * clamp(b, 0, 0.999))}\n`
  );
}
