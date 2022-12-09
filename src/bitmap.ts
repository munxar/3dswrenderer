export class Bitmap {
  private image: ImageData;
  private context: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.context = canvas.getContext("2d")!;
    this.image = this.context.getImageData(0, 0, canvas.width, canvas.height);
  }
  getWidth() {
    return this.image.width;
  }
  getHeight() {
    return this.image.height;
  }
  clear(shade: number) {
    const data = this.image.data;
    for (let i = 0; i < this.image.width * this.image.height * 4; i += 4) {
      data[i] = shade;
      data[i + 1] = shade;
      data[i + 2] = shade;
      data[i + 3] = 255;
    }
  }

  drawPixel(
    x: number,
    y: number,
    red: number,
    green: number,
    blue: number,
    alpha = 255
  ) {
    const index = (Math.floor(x) + Math.floor(y) * this.image.width) * 4;
    this.image.data[index] = red;
    this.image.data[index + 1] = green;
    this.image.data[index + 2] = blue;
    this.image.data[index + 3] = alpha;
  }

  swap() {
    this.context.putImageData(this.image, 0, 0);
  }
}
