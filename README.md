# Ray Tracing in One Weekend / The Next Week

Node.js port

See https://raytracing.github.io/

[_Ray Tracing in One Weekend_](https://raytracing.github.io/books/RayTracingInOneWeekend.html)  
[_Ray Tracing: The Next Week_](https://raytracing.github.io/books/RayTracingTheNextWeek.html)

![](./outputs/13.1.png)

## Javascript is slow

Of course, Javascript doesn't fit very well with pure computing like for ray tracing.
The final scene (not the image above) is very eavy to compute. I've done a simple
benchmark with Bun and Node.js; it's very interesting:

| Engine | Version | Command | Real time |
| --- | --- | --- | --- |
| [Bun][1]     | v0.6.9   | `time bun lib/main.js > image.bun.ppm`   | 243m33.764s (~4h00) |
| [Node.js][2] | v18.13.0 | `time node lib/main.js > image.node.ppm` | 377m16.842s (~6h15) |
|              |          |                                          |                   |
| [Bun][1]     | v1.2.22  | `time bun lib/main.js > image.bun.ppm`   | 162m30.991s (~2h40) |
| [Node.js][2] | v24.8.0  | `time node lib/main.js > image.node.ppm` | 360m53.033s (~6h00) |

Here, Bun v1.2 is 2.2× faster that Node.js.

[1]: https://bun.sh/
[2]: https://nodejs.org/en
