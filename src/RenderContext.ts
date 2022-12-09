import { Bitmap } from "./bitmap";
import { triangleAreaTimesTwo } from "./math";
import { Matrix } from "./Matrix";
import { Vertex } from "./Vertex";

export class RenderContext extends Bitmap {
  private scanBuffer: number[];
  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
    this.scanBuffer = new Array(canvas.height * 2);
  }

  drawScanBuffer(y: number, xMin: number, xMax: number) {
    const index = Math.floor(y) * 2;
    this.scanBuffer[index] = Math.floor(xMin);
    this.scanBuffer[index + 1] = Math.floor(xMax);
  }

  fillShape(yMin: number, yMax: number) {
    for (let j = Math.floor(yMin); j < Math.floor(yMax); j++) {
      const xMin = this.scanBuffer[j * 2];
      const xMax = this.scanBuffer[j * 2 + 1];
      for (let i = xMin; i < xMax; i++) {
        this.drawPixel(i, j, 255, 255, 255);
      }
    }
  }

  fillTriangle(v1: Vertex, v2: Vertex, v3: Vertex) {
    const screenSpaceTransform = new Matrix().screenSpaceTransform(
      this.getWidth() / 2,
      this.getHeight() / 2
    );

    let minYVert = v1.transform(screenSpaceTransform).perspectiveDivide();
    let midYVert = v2.transform(screenSpaceTransform).perspectiveDivide();
    let maxYVert = v3.transform(screenSpaceTransform).perspectiveDivide();

    if (maxYVert.y < midYVert.y) {
      [midYVert, maxYVert] = [maxYVert, midYVert];
    }
    if (midYVert.y < minYVert.y) {
      [minYVert, midYVert] = [midYVert, minYVert];
    }
    if (maxYVert.y < midYVert.y) {
      [midYVert, maxYVert] = [maxYVert, midYVert];
    }
    const area = triangleAreaTimesTwo(minYVert, maxYVert, midYVert);
    const handedness = area >= 0 ? 1 : 0;
    this.scanConvertTriangle(minYVert, midYVert, maxYVert, handedness);
    this.fillShape(Math.floor(minYVert.y), Math.floor(maxYVert.y));
  }

  private scanConvertTriangle(
    minYVert: Vertex,
    midYVert: Vertex,
    maxYVert: Vertex,
    handedness: number
  ) {
    this.scanConvertLine(minYVert, maxYVert, handedness);
    this.scanConvertLine(minYVert, midYVert, 1 - handedness);
    this.scanConvertLine(midYVert, maxYVert, 1 - handedness);
  }

  private scanConvertLine(
    minYVert: Vertex,
    maxYVert: Vertex,
    whichSide: number
  ) {
    const yStart = Math.floor(minYVert.y);
    const yEnd = Math.floor(maxYVert.y);
    const xStart = Math.floor(minYVert.x);
    const xEnd = Math.floor(maxYVert.x);
    const yDist = yEnd - yStart;
    const xDist = xEnd - xStart;
    if (yDist <= 0) {
      return;
    }
    const xStep = xDist / yDist;
    let curX = xStart;
    for (let j = yStart; j < yEnd; j++) {
      this.scanBuffer[j * 2 + whichSide] = Math.floor(curX);
      curX += xStep;
    }
  }
}
