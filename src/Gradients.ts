import { Vertex } from "./Vertex";

export class Gradients {
  texCoordX: number[];
  texCoordY: number[];
  oneOverZ: number[];

  texCoordXXStep: number;
  texCoordXYStep: number;
  texCoordYXStep: number;
  texCoordYYStep: number;
  oneOverZXStep: number;
  oneOverZYStep: number;

  calcXStep(
    values: number[],
    minYVert: Vertex,
    midYVert: Vertex,
    maxYVert: Vertex,
    oneOverdX: number
  ) {
    return (
      ((values[1] - values[2]) * (minYVert.y - maxYVert.y) -
        (values[0] - values[2]) * (midYVert.y - maxYVert.y)) *
      oneOverdX
    );
  }

  calcYStep(
    values: number[],
    minYVert: Vertex,
    midYVert: Vertex,
    maxYVert: Vertex,
    oneOverdY: number
  ) {
    return (
      ((values[1] - values[2]) * (minYVert.x - maxYVert.x) -
        (values[0] - values[2]) * (midYVert.x - maxYVert.x)) *
      oneOverdY
    );
  }
  constructor(minYVert: Vertex, midYVert: Vertex, maxYVert: Vertex) {
    const oneOverdx =
      1 /
      ((midYVert.x - maxYVert.x) * (minYVert.y - maxYVert.y) -
        (minYVert.x - maxYVert.x) * (midYVert.y - maxYVert.y));

    const oneOverdy = -oneOverdx;

    this.oneOverZ = [
      1 / minYVert.pos.w,
      1 / midYVert.pos.w,
      1 / maxYVert.pos.w,
    ];
    this.texCoordX = [
      minYVert.texCoords.x * this.oneOverZ[0],
      midYVert.texCoords.x * this.oneOverZ[1],
      maxYVert.texCoords.x * this.oneOverZ[2],
    ];
    this.texCoordY = [
      minYVert.texCoords.y * this.oneOverZ[0],
      midYVert.texCoords.y * this.oneOverZ[1],
      maxYVert.texCoords.y * this.oneOverZ[2],
    ];

    this.texCoordXXStep = this.calcXStep(
      this.texCoordX,
      minYVert,
      midYVert,
      maxYVert,
      oneOverdx
    );
    this.texCoordXYStep = this.calcYStep(
      this.texCoordX,
      minYVert,
      midYVert,
      maxYVert,
      oneOverdy
    );
    this.texCoordYXStep = this.calcXStep(
      this.texCoordY,
      minYVert,
      midYVert,
      maxYVert,
      oneOverdx
    );
    this.texCoordYYStep = this.calcYStep(
      this.texCoordY,
      minYVert,
      midYVert,
      maxYVert,
      oneOverdy
    );
    this.oneOverZXStep = this.calcXStep(
      this.oneOverZ,
      minYVert,
      midYVert,
      maxYVert,
      oneOverdx
    );
    this.oneOverZYStep = this.calcYStep(
      this.oneOverZ,
      minYVert,
      midYVert,
      maxYVert,
      oneOverdy
    );
  }
}
