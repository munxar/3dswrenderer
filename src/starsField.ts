import { Bitmap } from "./Bitmap";
import { deg2rad } from "./math";

class Star {
  constructor(public x = 0, public y = 0, public z = 0) {}
  randomize(spread: number): Star {
    this.x = 2 * (Math.random() - 0.5) * spread;
    this.y = 2 * (Math.random() - 0.5) * spread;
    this.z = (Math.random() + 0.00001) * spread;
    return this;
  }
}

export class StarField {
  private stars: Star[];

  constructor(numStars: number, private spread: number, private speed: number) {
    this.stars = new Array(numStars)
      .fill(0)
      .map(() => new Star().randomize(this.spread));
  }

  updateAndRender(target: Bitmap, delta: number) {
    const tanHalfFOV = Math.tan(deg2rad(90 / 2));
    const halfWidth = target.getWidth() / 2;
    const halfHeight = target.getHeight() / 2;

    target.clear(0);
    this.stars.forEach((star) => {
      star.z -= delta * this.speed;
      if (star.z <= 0) {
        star.randomize(this.spread);
      }
      const x = (star.x / (star.z * tanHalfFOV)) * halfWidth + halfWidth;
      const y = (star.y / (star.z * tanHalfFOV)) * halfHeight + halfHeight;
      if (x < 0 || x >= target.getWidth() || y < 0 || y >= target.getHeight()) {
        star.randomize(this.spread);
      } else {
        const shade = 255 * (1 - star.z / this.spread);
        target.drawPixel(x, y, shade, shade, shade);
      }
    });
  }
}
