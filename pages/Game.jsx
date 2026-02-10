//-- Game Page
import { useLocation } from "react-router-dom";
import GameCanvas from "../components/GameCanvas";


function Game() {
  const { state } = useLocation();

  if (!state?.pongSet) {
    return <p>No game configuration</p>;
  }

  return <GameCanvas pongSet={state.pongSet} />;
}

export default Game;
