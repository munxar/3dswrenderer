import { Vector } from "./Vector";

export class Matrix {
  m: number[][];
  constructor() {
    this.m = [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ];
  }
  initPerspective(
    fov: number,
    aspectRatio: number,
    zNear: number,
    zFar: number
  ): Matrix {
    const tanHalfFOV = Math.tan(fov / 2);
    const zRange = zNear - zFar;
    this.m = [
      [1 / (tanHalfFOV * aspectRatio), 0, 0, 0],
      [0, 1 / tanHalfFOV, 0, 0],
      [0, 0, (-zNear - zFar) / zRange, (2 * zFar * zNear) / zRange],
      [0, 0, 1, 0],
    ];
    return this;
  }
  initTranslation(x: number, y: number, z: number): Matrix {
    this.m = [
      [1, 0, 0, x],
      [0, 1, 0, y],
      [0, 0, 1, z],
      [0, 0, 0, 1],
    ];
    return this;
  }
  initRotation(x: number, y: number, z: number, angle: number): Matrix {
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);
    const oneSubCos = 1 - cos;
    const xy = x * y;
    const xz = x * z;
    const yz = y * z;
    const xsin = x * sin;
    const ysin = y * sin;
    const zsin = z * sin;

    this.m = [
      [
        cos + x * x * oneSubCos,
        xy * oneSubCos - zsin,
        xz * oneSubCos + ysin,
        0,
      ],
      [
        xy * oneSubCos + zsin,
        cos + y * y * oneSubCos,
        yz * oneSubCos - xsin,
        0,
      ],
      [
        xz * oneSubCos - ysin,
        yz * oneSubCos + xsin,
        cos + z * z * oneSubCos,
        0,
      ],
      [0, 0, 0, 1],
    ];
    return this;
  }

  mul(r: Matrix): Matrix {
    const res = new Matrix();
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        res.m[i][j] =
          this.m[i][0] * r.m[0][j] +
          this.m[i][1] * r.m[1][j] +
          this.m[i][2] * r.m[2][j] +
          this.m[i][3] * r.m[3][j];
      }
    }
    return res;
  }

  transform(r: Vector): Vector {
    return new Vector(
      this.m[0][0] * r.x +
        this.m[0][1] * r.y +
        this.m[0][2] * r.z +
        this.m[0][3] * r.w,
      this.m[1][0] * r.x +
        this.m[1][1] * r.y +
        this.m[1][2] * r.z +
        this.m[1][3] * r.w,
      this.m[2][0] * r.x +
        this.m[2][1] * r.y +
        this.m[2][2] * r.z +
        this.m[2][3] * r.w,
      this.m[3][0] * r.x +
        this.m[3][1] * r.y +
        this.m[3][2] * r.z +
        this.m[3][3] * r.w
    );
  }

  screenSpaceTransform(halfWidth: number, halfHeight: number): Matrix {
    this.m = [
      [halfWidth, 0, 0, halfWidth],
      [0, -halfHeight, 0, halfHeight],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ];
    return this;
  }
}
