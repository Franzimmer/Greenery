import React, { useRef, useEffect } from "react";
import styled from "styled-components";
import { fabric } from "fabric";

const CanvasContainer = styled.div`
  .upper-canvas,
  .lower-canvas {
    background: none;
  }
`;

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
    <CanvasContainer>
      <canvas ref={canvasRef} style={{ border: "1px solid #DDD" }}></canvas>
    </CanvasContainer>
  );
}

export default Canvas;
