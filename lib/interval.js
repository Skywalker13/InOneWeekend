export class Interval {
  constructor(a, b) {
    if (a instanceof Interval) {
      this.min = Math.min(a.min, b.min);
      this.max = Math.max(a.max, b.max);
    } else {
      this.min = a ?? Infinity;
      this.max = b ?? -Infinity;
    }
  }

  copy(int) {
    this.min = int.min;
    this.max = int.max;
    return this;
  }

  add(a) {
    if (a instanceof Interval) {
      return new Interval(this.min + a.min, this.max + a.max);
    }
    return new Interval(this.min + a, this.max + a);
  }

  size() {
    return this.max - this.min;
  }

  expand(delta) {
    const padding = delta / 2;
    return new Interval(this.min - padding, this.max + padding);
  }

  contains(x) {
    return this.min <= x && x <= this.max;
  }

  clamp(x) {
    return x < this.min ? this.min : x > this.max ? this.max : x;
  }

  static empty() {
    return new Interval(Infinity, -Infinity);
  }

  static universe() {
    return new Interval(-Infinity, Infinity);
  }
}
