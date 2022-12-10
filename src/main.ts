import { Bitmap } from "./Bitmap";
import { deg2rad } from "./math";
import { Matrix } from "./Matrix";
import { RenderContext } from "./RenderContext";
import "./style.css";
import { Vector } from "./Vector";
import { Vertex } from "./Vertex";

const canvas = document.createElement("canvas");
canvas.width = 600;
canvas.height = 400;
document.body.appendChild(canvas);
const bitmap = document.createElement("canvas");
bitmap.width = 32;
bitmap.height = 32;
const texture = new Bitmap(bitmap);
const target = new RenderContext(canvas);

for (let j = 0; j < texture.getHeight(); j++) {
  for (let i = 0; i < texture.getWidth(); i++) {
    texture.drawPixel(
      i,
      j,
      Math.floor(Math.random() * 255 + 0.5),
      Math.floor(Math.random() * 255 + 0.5),
      Math.floor(Math.random() * 255 + 0.5)
    );
  }
}

const minYVert = new Vertex(new Vector(-1, -1, 0), new Vector(0, 0, 0, 0));
const midYVert = new Vertex(new Vector(0, 1, 0), new Vector(0.5, 1, 0, 0));
const maxYVert = new Vertex(new Vector(1, -1, 0), new Vector(1, 0, 0, 0));

const projection = new Matrix().initPerspective(
  deg2rad(70),
  target.getWidth() / target.getHeight(),
  0.1,
  1000
);

let rotCounter = 0;
let lastTick = 0;
function update(tick: number) {
  requestAnimationFrame(update);
  const delta = (tick - lastTick) / 1000;
  lastTick = tick;

  rotCounter += delta;
  const translation = new Matrix().initTranslation(0, 0, 3);
  const rotation = new Matrix().initRotation(0, -1, 0, rotCounter);
  const transform = projection.mul(translation.mul(rotation));
  target.clear(0);
  target.fillTriangle(
    maxYVert.transform(transform),
    midYVert.transform(transform),
    minYVert.transform(transform),
    texture
  );

  target.swap();
}

requestAnimationFrame(update);
