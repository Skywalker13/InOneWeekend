const stdout = (text) => process.stdout.write(text);
const stderr = (text) => process.stderr.write(text);

export default function draw() {
  const width = 256;
  const height = 256;

  stdout(`P3\n${width} ${height}\n255\n`);

  for (let j = height - 1; j >= 0; --j) {
    stderr(`\ncanlines remaining: ${j} `);
    for (let i = 0; i < width; ++i) {
      const r = i / (width - 1);
      const g = j / (height - 1);
      const b = 0.25;

      const ir = parseInt(255.999 * r);
      const ig = parseInt(255.999 * g);
      const ib = parseInt(255.999 * b);

      stdout(`${ir} ${ig} ${ib}\n`);
    }
  }

  stderr("Done.");
}
