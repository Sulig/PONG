//- Principal page / Settings page

import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Home() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("1vsAI");

  function startGame() {
    navigate("/game", {
      state: {
        pongSet: {
          mode,
          maxPoints: 5,
          your_pad: "left",
          ai_level: 1,
          plL_name: "Player",
          plR_name: "CPU",
          plL_mvu: "w",
          plL_mvd: "s",
          plR_mvu: "ArrowUp",
          plR_mvd: "ArrowDown"
        }
      }
    });
  }

  return (
    <div>
      <h1>PONG</h1>

      <select value={mode} onChange={e => setMode(e.target.value)}>
        <option value="1vsAI">1 vs AI</option>
        <option value="1vs1">1 vs 1</option>
      </select>

      <button onClick={startGame}>Play</button>
    </div>
  );
}

export default Home;

