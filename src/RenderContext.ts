import { Bitmap } from "./bitmap";
import { Edge } from "./Edge";
import { triangleAreaTimesTwo } from "./math";
import { Matrix } from "./Matrix";
import { Vertex } from "./Vertex";

export class RenderContext extends Bitmap {
  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
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
    const handedness = triangleAreaTimesTwo(minYVert, maxYVert, midYVert) >= 0;
    this.scanTriangle(minYVert, midYVert, maxYVert, handedness);
  }

  private scanTriangle(
    minYVert: Vertex,
    midYVert: Vertex,
    maxYVert: Vertex,
    handedness: boolean
  ) {
    const topToBottom = new Edge(minYVert, maxYVert);
    const topToMiddle = new Edge(minYVert, midYVert);
    const middleToBottom = new Edge(midYVert, maxYVert);

    let left = topToBottom;
    let right = topToMiddle;
    if (handedness) {
      [right, left] = [left, right];
    }
    let yStart = topToMiddle.yStart;
    let yEnd = topToMiddle.yEnd;
    for (let j = yStart; j < yEnd; j++) {
      this.drawScanLine(left, right, j);
      left.step();
      right.step();
    }

    left = topToBottom;
    right = middleToBottom;
    if (handedness) {
      [right, left] = [left, right];
    }
    yStart = middleToBottom.yStart;
    yEnd = middleToBottom.yEnd;
    for (let j = yStart; j < yEnd; j++) {
      this.drawScanLine(left, right, j);
      left.step();
      right.step();
    }
  }

  private drawScanLine(left: Edge, right: Edge, j: number) {
    const xMin = Math.ceil(left.x);
    const xMax = Math.ceil(right.x);
    for (let i = xMin; i < xMax; i++) {
      this.drawPixel(i, j, 255, 255, 255);
    }
  }
}
