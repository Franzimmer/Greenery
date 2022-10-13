import React, { useRef, useEffect } from "react";
import styled from "styled-components";
import { fabric } from "fabric";

const CanvasContainer = styled.div`
  .upper-canvas,
  .lower-canvas {
    background: none;
  }

  @media screen and (max-width: 500px) {
    width: 340px;
    height: 340px;
    .upper-canvas,
    .lower-canvas {
      transform: scale(0.85);
      transform-origin: 0 0;
    }
    .canvas-container {
      width: 340px !important;
      height: 340px !important;
    }
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
      <canvas ref={canvasRef} id="canvas"></canvas>
    </CanvasContainer>
  );
}

export default Canvas;
