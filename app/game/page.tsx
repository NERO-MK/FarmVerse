"use client";
import { useEffect } from "react";

export default function GamePage() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/game/main.js"; // Load built game script
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Farmverse</h1>
      <canvas id="farmverse-game" width="800" height="600"></canvas>
    </div>
  );
}
