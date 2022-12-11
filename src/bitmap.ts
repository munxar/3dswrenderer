export class Bitmap {
  private image: ImageData;
  private context: CanvasRenderingContext2D;

  constructor(private canvas: HTMLCanvasElement) {
    this.context = canvas.getContext("2d", { willReadFrequently: true })!;
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

  copyPixel(
    destX: number,
    destY: number,
    srcX: number,
    srcY: number,
    src: Bitmap
  ) {
    const destIndex =
      (Math.floor(destX) + Math.floor(destY) * this.getWidth()) * 4;
    const srcIndex = (Math.floor(srcX) + Math.floor(srcY) * src.getWidth()) * 4;

    this.image.data[destIndex] = src.image.data[srcIndex];
    this.image.data[destIndex + 1] = src.image.data[srcIndex + 1];
    this.image.data[destIndex + 2] = src.image.data[srcIndex + 2];
    this.image.data[destIndex + 3] = src.image.data[srcIndex + 3];
  }

  swap() {
    this.context.putImageData(this.image, 0, 0);
  }

  async load(src: string) {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.addEventListener(
        "load",
        () => {
          this.canvas.width = img.width;
          this.canvas.height = img.height;
          this.context.drawImage(img, 0, 0);
          this.image = this.context.getImageData(
            0,
            0,
            this.canvas.width,
            this.canvas.height
          );
          resolve();
        },
        false
      );
      img.src = src;
    });
  }
}
