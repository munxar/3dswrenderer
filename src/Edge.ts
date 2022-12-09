import { Gradients } from "./Gradients";
import { Vector } from "./Vector";
import { Vertex } from "./Vertex";

export class Edge {
  x: number;
  xStep: number;
  yStart: number;
  yEnd: number;
  color: Vector;
  colorStep: Vector;

  constructor(
    gradients: Gradients,
    minYVert: Vertex,
    maxYVert: Vertex,
    minYVertIndex: number
  ) {
    this.yStart = Math.ceil(minYVert.y);
    this.yEnd = Math.ceil(maxYVert.y);
    const yDist = maxYVert.y - minYVert.y;
    const xDist = maxYVert.x - minYVert.x;
    const yPrestep = this.yStart - minYVert.y;

    this.xStep = xDist / yDist;
    this.x = minYVert.x + yPrestep * this.xStep;

    const xPrestep = this.x - minYVert.x;
    this.color = gradients.color[minYVertIndex]
      .add(gradients.colorYStep.mul(yPrestep))
      .add(gradients.colorXStep.mul(xPrestep));
    this.colorStep = gradients.colorYStep.add(
      gradients.colorXStep.mul(this.xStep)
    );
  }

  step() {
    this.x += this.xStep;
    this.color = this.color.add(this.colorStep);
  }
}
