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

areaOfTriangle = (coordA, coordB , coordC) => {
  const edgeA = Math.sqrt((coordB.x - coordC.x) ** 2 + (coordB.y - coordC.y) ** 2 + (coordB.z - coordC.z) ** 2);
  const edgeB = Math.sqrt((coordA.x - coordC.x) ** 2 + (coordA.y - coordC.y) ** 2 + (coordA.z - coordC.z) ** 2);
  const edgeC = Math.sqrt((coordB.x - coordA.x) ** 2 + (coordB.y - coordA.y) ** 2 + (coordB.z - coordA.z) ** 2);

  const s = (edgeA + edgeB + edgeC) /2;

  const area = Math.sqrt(s * (s - edgeA) * (s - edgeB) * (s - edgeC));

  return area;
}

