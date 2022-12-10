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

  fillTriangle(v1: Vertex, v2: Vertex, v3: Vertex, texture: Bitmap) {
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
    this.scanTriangle(minYVert, midYVert, maxYVert, handedness, texture);
  }

  private scanTriangle(
    minYVert: Vertex,
    midYVert: Vertex,
    maxYVert: Vertex,
    handedness: boolean,
    texture: Bitmap
  ) {
    const gradients = new Gradients(minYVert, midYVert, maxYVert);
    const topToBottom = new Edge(gradients, minYVert, maxYVert, 0);
    const topToMiddle = new Edge(gradients, minYVert, midYVert, 0);
    const middleToBottom = new Edge(gradients, midYVert, maxYVert, 1);

    this.scanEdges(gradients, topToBottom, topToMiddle, handedness, texture);
    this.scanEdges(gradients, topToBottom, middleToBottom, handedness, texture);
  }

  private scanEdges(
    gradients: Gradients,
    a: Edge,
    b: Edge,
    handedness: boolean,
    texture: Bitmap
  ) {
    let left = a;
    let right = b;
    if (handedness) {
      [right, left] = [left, right];
    }
    let yStart = b.yStart;
    let yEnd = b.yEnd;
    for (let j = yStart; j < yEnd; j++) {
      this.drawScanLine(gradients, left, right, j, texture);
      left.step();
      right.step();
    }
  }

  private drawScanLine(
    gradients: Gradients,
    left: Edge,
    right: Edge,
    j: number,
    texture: Bitmap
  ) {
    const xMin = Math.ceil(left.x);
    const xMax = Math.ceil(right.x);
    const xPrestep = xMin - left.x;

    let texCoordX = left.texCoordX + gradients.texCoordXXStep * xPrestep;
    let texCoordY = left.texCoordY + gradients.texCoordYXStep * xPrestep;

    for (let i = xMin; i < xMax; i++) {
      const srcX = Math.floor(texCoordX * (texture.getWidth() - 1) + 0.5);
      const srcY = Math.floor(texCoordY * (texture.getWidth() - 1) + 0.5);

      this.copyPixel(i, j, srcX, srcY, texture);
      texCoordX += gradients.texCoordXXStep;
      texCoordY += gradients.texCoordYXStep;
    }
  }
}
