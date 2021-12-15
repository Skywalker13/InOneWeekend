import { Interval } from "./interval.js";

export default function (out, pixelColor, samplesPerPixel) {
  let { r, g, b } = pixelColor;

  /* Divide the color by the number of samples (antialiasing) */
  const scale = 1 / samplesPerPixel;
  /* Gamma correction of 2.0 */
  r = Math.sqrt(scale * r);
  g = Math.sqrt(scale * g);
  b = Math.sqrt(scale * b);

  const intensity = new Interval(0.0, 0.999);
  out(
    `${parseInt(256 * intensity.clamp(r))} ` +
      `${parseInt(256 * intensity.clamp(g))} ` +
      `${parseInt(256 * intensity.clamp(b))}\n`
  );
}
