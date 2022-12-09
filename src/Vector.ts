export class Vector {
  constructor(public x = 0, public y = 0, public z = 0, public w = 1) {}
  sub(r: Vector): Vector {
    return new Vector(this.x - r.x, this.y - r.y, this.z - r.z, this.w - r.w);
  }
  mul(r: number): Vector {
    return new Vector(this.x * r, this.y * r, this.z * r, this.w * r);
  }
  add(r: Vector): Vector {
    return new Vector(this.x + r.x, this.y + r.y, this.z + r.z, this.w + r.w);
  }
  lerp(r: Vector, t: number): Vector {
    return this.add(r.sub(this).mul(t));
  }
}
