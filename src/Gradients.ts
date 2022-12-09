import { Vector } from "./Vector";
import { Vertex } from "./Vertex";

export class Gradients {
  color: Vector[];
  colorXStep: Vector;
  colorYStep: Vector;

  constructor(minYVert: Vertex, midYVert: Vertex, maxYVert: Vertex) {
    const oneOverdx =
      1 /
      ((midYVert.x - maxYVert.x) * (minYVert.y - maxYVert.y) -
        (minYVert.x - maxYVert.x) * (midYVert.y - maxYVert.y));

    const oneOverdy = -oneOverdx;
    this.color = [minYVert.color, midYVert.color, maxYVert.color];

    this.colorXStep = this.color[1]
      .sub(this.color[2])
      .mul(minYVert.y - maxYVert.y)
      .sub(this.color[0].sub(this.color[2]).mul(midYVert.y - maxYVert.y))
      .mul(oneOverdx);

    this.colorYStep = this.color[1]
      .sub(this.color[2])
      .mul(minYVert.x - maxYVert.x)
      .sub(this.color[0].sub(this.color[2]).mul(midYVert.x - maxYVert.x))
      .mul(oneOverdy);
  }
}
