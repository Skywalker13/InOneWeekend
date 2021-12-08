export default function (out, pixelColor) {
  out(
    `${parseInt(255.999 * pixelColor.r)} ` +
      `${parseInt(255.999 * pixelColor.g)} ` +
      `${parseInt(255.999 * pixelColor.b)}\n`
  );
}
