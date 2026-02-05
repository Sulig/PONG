import { useRef, useEffect } from "react";
import { pong } from "../game/OBPong.js";
import "../game/pong.js";

function GameCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;

  pong.setCanvas(canvas);

  const pongSet = {
    mode: "1vsAI",
    maxPoints: 5,
    your_pad: "left",
    ai_level: 1,
    plL_name: "Player",
    plR_name: "CPU",
    plL_mvu: "w",
    plL_mvd: "s",
    plR_mvu: "ArrowUp",
    plR_mvd: "ArrowDown"
  };

  pong.initializeGame(pongSet);

}, []);


  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      style={{ border: "1px solid white" }}
    />
  );
}

export default GameCanvas;
