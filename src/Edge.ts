import { Vertex } from "./Vertex";

export class Edge {
  x: number;
  xStep: number;
  yStart: number;
  yEnd: number;

  constructor(minYVert: Vertex, maxYVert: Vertex) {
    this.yStart = Math.ceil(minYVert.y);
    this.yEnd = Math.ceil(maxYVert.y);
    const yDist = maxYVert.y - minYVert.y;
    const xDist = maxYVert.x - minYVert.x;
    const yPrestep = this.yStart - minYVert.y;

    this.xStep = xDist / yDist;
    this.x = minYVert.x + yPrestep * this.xStep;
  }

  step() {
    this.x += this.xStep;
  }
}
