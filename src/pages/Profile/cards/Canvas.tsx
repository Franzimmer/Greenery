import React, { useRef, useEffect } from "react";
import { fabric } from "fabric";

interface CanvasProps {
  setCanvas: (canvas: fabric.Canvas) => void;
}
function Canvas({ setCanvas }: CanvasProps): JSX.Element {
  const canvasRef = useRef(null);

  useEffect(() => {
    setCanvas(
      new fabric.Canvas(canvasRef.current, {
        renderOnAddRemove: true,
        height: 400,
        width: 400,
      })
    );
  }, [setCanvas]);

  return (
    <>
      <canvas ref={canvasRef} style={{ border: "1px solid #DDD" }}></canvas>
    </>
  );
}

export default Canvas;
