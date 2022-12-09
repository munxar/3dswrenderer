import { Matrix } from "./Matrix";
import { Vector } from "./Vector";

export class Vertex {
  pos: Vector;

  constructor(x = 0, y = 0, z = 0) {
    this.pos = new Vector(x, y, z);
  }

  get x() {
    return this.pos.x;
  }

  get y() {
    return this.pos.y;
  }

  transform(matrix: Matrix): Vertex {
    const v = new Vertex();
    v.pos = matrix.transform(this.pos);
    return v;
  }

  perspectiveDivide(): Vertex {
    const v = new Vertex();
    v.pos = new Vector(
      this.pos.x / this.pos.w,
      this.pos.y / this.pos.w,
      this.pos.z / this.pos.w,
      this.pos.w
    );
    return v;
  }
}
