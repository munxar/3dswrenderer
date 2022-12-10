import { Gradients } from "./Gradients";
import { Vertex } from "./Vertex";

export class Edge {
  x: number;
  xStep: number;
  yStart: number;
  yEnd: number;

  texCoordX: number;
  texCoordXStep: number;
  texCoordY: number;
  texCoordYStep: number;
  oneOverZ: number;
  oneOverZStep: number;

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

    this.texCoordX =
      gradients.texCoordX[minYVertIndex] +
      gradients.texCoordXXStep * xPrestep +
      gradients.texCoordXYStep * yPrestep;
    this.texCoordXStep =
      gradients.texCoordXYStep + gradients.texCoordXXStep * this.xStep;
    this.texCoordY =
      gradients.texCoordY[minYVertIndex] +
      gradients.texCoordYXStep * xPrestep +
      gradients.texCoordYYStep * yPrestep;
    this.texCoordYStep =
      gradients.texCoordYYStep + gradients.texCoordYXStep * this.xStep;

    this.oneOverZ =
      gradients.oneOverZ[minYVertIndex] +
      gradients.oneOverZXStep * xPrestep +
      gradients.oneOverZYStep * yPrestep;
    this.oneOverZStep =
      gradients.oneOverZYStep + gradients.oneOverZXStep * this.xStep;
  }

  step() {
    this.x += this.xStep;
    this.texCoordX += this.texCoordXStep;
    this.texCoordY += this.texCoordYStep;
    this.oneOverZ += this.oneOverZStep;
  }
}
