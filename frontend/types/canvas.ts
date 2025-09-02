export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface BaseElement {
  id: string;
  type: string;
  position: Position;
  size: Size;
  rotation: number;
  opacity: number;
}

export interface TextElement extends BaseElement {
  type: "text";
  content: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  textAlign: "left" | "center" | "right";
  fontWeight: "normal" | "bold";
  fontStyle: "normal" | "italic";
}

export interface ShapeElement extends BaseElement {
  type: "shape";
  shapeType: "rectangle" | "circle" | "line";
  fill: string;
  stroke: string;
  strokeWidth: number;
}

export interface ImageElement extends BaseElement {
  type: "image";
  src: string;
  alt: string;
}

export type CanvasElement = TextElement | ShapeElement | ImageElement;
