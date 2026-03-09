import { useEffect, useRef } from "react";
import { pong } from "./pong/OBPong.js";
import { resizeCanvas } from "./pong/render.js";
import { startGame, stopGame } from "./pong/pong.js"
import "./pong/pong.js";
import "./pong/pongstyle.css";

function PongGame({ pongSet, onScoreChange, onGameEnd }) {

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sliderLRef = useRef<HTMLInputElement>(null);
  const sliderRRef = useRef<HTMLInputElement>(null);  

  const gameRef = useRef(null); 

  useEffect(() => {
    if (gameRef.current) return ;
    if (!pongSet) return ;
    if (!canvasRef.current || !sliderLRef.current || !sliderRRef.current) return;

    pong.setScoreCallback((leftScore, rightScore) => {
      if (onScoreChange) 
        onScoreChange(leftScore, rightScore);
    });

	  pong.setCanvas(canvasRef.current); 
	  resizeCanvas(pong);
	  pong.setSliders(pongSet, sliderLRef.current, sliderRRef.current);
	  pong.initializeGame(pongSet);

    gameRef.current = pong;

    pong.setGameEndCallback((leftScore, rightScore) => {
      stopGame();            // cancel loop immediately
      gameRef.current = null;
      if (onGameEnd)
        onGameEnd(leftScore, rightScore);
    });

	  startGame();

	  return () => {
      stopGame();
      gameRef.current = null;

      pong.setGameEndCallback(null);
      pong.setScoreCallback(null);
      if (pong._sliderLHandler && pong.sliderL)
	      pong.sliderL.removeEventListener("input", pong._sliderLHandler);
      if (pong._sliderRHandler && pong.sliderR)
	      pong.sliderR.removeEventListener("input", pong._sliderRHandler);
    };
  }, []);

  return (
  <div className="flex justify-center w-full">
    <div className="relative w-full max-w-4xl max-h-[70vh] aspect-[4/3] bg-black">
      <canvas
        ref={canvasRef}
        width={1280}
        height={960}
        className="w-full h-full block"
      />

      <input
        type="range"
        ref={sliderLRef}
        className="gmSlider absolute left-0 top-1/2 -translate-y-1/2"
      />
      <input
        type="range"
        ref={sliderRRef}
        className="gmSlider absolute right-0 top-1/2 -translate-y-1/2"
      />
    </div>
  </div>
);
}

export default PongGame;
