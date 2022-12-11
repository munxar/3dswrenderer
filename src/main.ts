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
const texture = new Bitmap(bitmap);
await texture.load("/bricks.jpg");
const target = new RenderContext(canvas);

const minYVert = new Vertex(new Vector(-1, -1, 0), new Vector(0, 0, 0, 0));
const midYVert = new Vertex(new Vector(0, 1, 0), new Vector(0, 1, 0, 0));
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
