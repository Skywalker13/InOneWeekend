import { vec3u } from "./vec3";

export class ray {
  constructor(origin, direction) {
    this.orig = origin;
    this.dir = direction;
  }

  get origin() {
    return this.orig;
  }

  get direction() {
    return this.dir;
  }

  at(t) {
    return vec3u.add(this.orig, vec3u.mul(t, this.dir));
  }
}
