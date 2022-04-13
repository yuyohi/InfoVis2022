class Vec3 {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  add = (v) => {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;

    return this;
  };

  min = () => Math.min(this.x, this.y, this.z);

  max = () => Math.min(this.x, this.y, this.z);

  mid = () => {
    if (
      (this.x <= this.y && this.y <= this.z) ||
      (this.x >= this.y && this.y >= this.z)
    ) {
      return y;
    } else if (
      (this.x <= this.z && this.z <= this.y) ||
      (this.x >= this.z && this.z >= this.y)
    ) {
      return z;
    } else {
      return x;
    }
  };
}
