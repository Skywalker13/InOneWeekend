import { Vec3 } from "./vec3.js";

export function degreesToRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

export function str(out, v) {
  return out(`${v.e[0]} ${v.e[1]} ${v.e[2]}`);
}

export function random(min = 0, max = 1) {
  return Math.random() * (max - min) + min;
}

/**
 * Scalar product
 *
 * @static
 * @param {Vec3} u
 * @param {Vec3} v
 * @returns {Number}
 */
export function dot(u, v) {
  return u.e[0] * v.e[0] + u.e[1] * v.e[1] + u.e[2] * v.e[2];
}

/**
 * Vectorial product
 *
 * @static
 * @param {Vec3} u
 * @param {Vec3} v
 * @returns {Vec3}
 */
export function cross(u, v) {
  return new Vec3(
    u.e[1] * v.e[2] - u.e[2] * v.e[1],
    u.e[2] * v.e[0] - u.e[0] * v.e[2],
    u.e[0] * v.e[1] - u.e[1] * v.e[0]
  );
}

export function reflect(v, n) {
  return v.sub(n.mul(2 * dot(v, n)));
}

export function refract(uv, n, etaiOverStat) {
  const cosTheta = Math.min(dot(uv.not(), n), 1.0);
  const rOutPerp = uv.add(n.mul(cosTheta)).mul(etaiOverStat);
  const rOutParallel = n.mul(
    -Math.sqrt(Math.abs(1.0 - rOutPerp.lengthSquared))
  );
  return rOutPerp.add(rOutParallel);
}
