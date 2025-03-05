export interface CardDrawParams {
    card: any;
    ctx: CanvasRenderingContext2D;
    imageData: any;
    output: "tts" | "print";
    lookupData: any;
  }