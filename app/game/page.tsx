"use client";
import { useEffect } from "react";

export default function GamePage() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/game/main.js"; // This points to your built game file
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Farmverse</h1>
      <canvas id="farmverse-game" width="800" height="600" />
    </div>
  );
}
