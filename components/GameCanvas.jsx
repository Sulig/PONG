import { useRef, useEffect } from "react";
import { pong } from "../game/OBPong.js";
import { resizeCanvas } from "../game/render.js";
import "../game/pong.js";
import { startGame, stopGame } from "../game/pong.js";

function GameCanvas({ pongSet }) {
  const canvasRef = useRef(null);

  useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;

  pong.setCanvas(canvas);
  resizeCanvas();
  pong.initializeGame(pongSet);
  startGame();

  return () => {
    stopGame();
  };

}, []);


  return (
    <canvas
  ref={canvasRef}
  width={1280}
  height={960}
  style={{
    background: "black",
    width: "640px",
    height: "480px",
    display: "block"
  }}
  />
  );
}

export default GameCanvas;
