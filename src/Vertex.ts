import { Matrix } from "./Matrix";
import { Vector } from "./Vector";

export class Vertex {
  constructor(public pos: Vector, public texCoords: Vector) {}

  get x() {
    return this.pos.x;
  }

  get y() {
    return this.pos.y;
  }

  transform(matrix: Matrix): Vertex {
    return new Vertex(matrix.transform(this.pos), this.texCoords);
  }

  perspectiveDivide(): Vertex {
    return new Vertex(
      new Vector(
        this.pos.x / this.pos.w,
        this.pos.y / this.pos.w,
        this.pos.z / this.pos.w,
        this.pos.w
      ),
      this.texCoords
    );
  }
}
