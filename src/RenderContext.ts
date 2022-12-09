import { Bitmap } from "./Bitmap";
import { Edge } from "./Edge";
import { Gradients } from "./Gradients";
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
    const gradients = new Gradients(minYVert, midYVert, maxYVert);
    const topToBottom = new Edge(gradients, minYVert, maxYVert, 0);
    const topToMiddle = new Edge(gradients, minYVert, midYVert, 0);
    const middleToBottom = new Edge(gradients, midYVert, maxYVert, 1);

    this.scanEdges(gradients, topToBottom, topToMiddle, handedness);
    this.scanEdges(gradients, topToBottom, middleToBottom, handedness);
  }

  private scanEdges(
    gradients: Gradients,
    a: Edge,
    b: Edge,
    handedness: boolean
  ) {
    let left = a;
    let right = b;
    if (handedness) {
      [right, left] = [left, right];
    }
    let yStart = b.yStart;
    let yEnd = b.yEnd;
    for (let j = yStart; j < yEnd; j++) {
      this.drawScanLine(gradients, left, right, j);
      left.step();
      right.step();
    }
  }

  private drawScanLine(
    gradients: Gradients,
    left: Edge,
    right: Edge,
    j: number
  ) {
    const xMin = Math.ceil(left.x);
    const xMax = Math.ceil(right.x);
    const xPrestep = xMin - left.x;

    const minColor = left.color.add(gradients.colorXStep.mul(xPrestep));
    const maxColor = right.color.add(gradients.colorXStep.mul(xPrestep));

    let lerpAmp = 0;
    const lerpStep = 1 / (xMax - xMin);

    for (let i = xMin; i < xMax; i++) {
      const color = minColor.lerp(maxColor, lerpAmp);

      this.drawPixel(i, j, 255 * color.x, 255 * color.y, 255 * color.z);
      lerpAmp += lerpStep;
    }
  }
}
