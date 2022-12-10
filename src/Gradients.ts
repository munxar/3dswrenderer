import { Vertex } from "./Vertex";

export class Gradients {
  texCoordX: number[];
  texCoordY: number[];

  texCoordXXStep: number;
  texCoordXYStep: number;
  texCoordYXStep: number;
  texCoordYYStep: number;

  constructor(minYVert: Vertex, midYVert: Vertex, maxYVert: Vertex) {
    const oneOverdx =
      1 /
      ((midYVert.x - maxYVert.x) * (minYVert.y - maxYVert.y) -
        (minYVert.x - maxYVert.x) * (midYVert.y - maxYVert.y));

    const oneOverdy = -oneOverdx;

    this.texCoordX = [
      minYVert.texCoords.x,
      midYVert.texCoords.x,
      maxYVert.texCoords.x,
    ];
    this.texCoordY = [
      minYVert.texCoords.y,
      midYVert.texCoords.y,
      maxYVert.texCoords.y,
    ];

    this.texCoordXXStep =
      ((this.texCoordX[1] - this.texCoordX[2]) * (minYVert.y - maxYVert.y) -
        (this.texCoordX[0] - this.texCoordX[2]) * (midYVert.y - maxYVert.y)) *
      oneOverdx;
    this.texCoordXYStep =
      ((this.texCoordX[1] - this.texCoordX[2]) * (minYVert.x - maxYVert.x) -
        (this.texCoordX[0] - this.texCoordX[2]) * (midYVert.x - maxYVert.x)) *
      oneOverdy;
    this.texCoordYXStep =
      ((this.texCoordY[1] - this.texCoordY[2]) * (minYVert.y - maxYVert.y) -
        (this.texCoordY[0] - this.texCoordY[2]) * (midYVert.y - maxYVert.y)) *
      oneOverdx;
    this.texCoordYYStep =
      ((this.texCoordY[1] - this.texCoordY[2]) * (minYVert.x - maxYVert.x) -
        (this.texCoordY[0] - this.texCoordY[2]) * (midYVert.x - maxYVert.x)) *
      oneOverdy;
  }
}
