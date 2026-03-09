import axios from "axios"
const AUTH_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

let api: any;

if (import.meta.env.DEV) {
  console.log("Using DEV mock for Matches API (DEV)");

  // Mock que *ecoa* los datos que le pasas en POST
  api = {
    post: async (_path: string, data?: any) => {
      // data: { playMode, aiLevel, guestName, winPoints, paddle }
      const body = data || {};
      return {
        data: {
          id: Date.now(), // id único por partida
          userScore: 0,
          opponentScore: 0,
          playMode: body.playMode ?? "AI",
          aiLevel: body.aiLevel ?? "EASY",
          guestName: body.guestName ?? undefined,
          winPoints: body.winPoints ?? 5,
          paddle: body.paddle ?? "LEFT",
        },
      };
    },
    patch: async (_path: string, _data?: any) => {
      // mock patch (puedes expandir si necesitas)
      return { data: {} };
    },
  };
} else {
  api = axios.create({
    baseURL: AUTH_BASE_URL + "/matches",
    withCredentials: true,
  });
}

export default api;
