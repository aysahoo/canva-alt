export type Tool = "select" | "text" | "shape" | "image" | "pan";

export interface ToolConfig {
  shape?: "rectangle" | "circle" | "line";
  text?: {
    fontSize: number;
    fontFamily: string;
    color: string;
  };
}
