"use client";
import { useEffect } from "react";

export default function GamePage() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/game/main.js"; // Served from /public/game/main.js
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Farmverse</h1>
      <div id="game" />
    </div>
  );
}
