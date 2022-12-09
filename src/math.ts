import { Vertex } from "./Vertex";

export function deg2rad(deg: number) {
  return (deg * Math.PI) / 180;
}

export function triangleAreaTimesTwo(a: Vertex, b: Vertex, c: Vertex) {
  const x1 = b.x - a.x;
  const y1 = b.y - a.y;
  const x2 = c.x - a.x;
  const y2 = c.y - a.y;
  return x1 * y2 - x2 * y1;
}
