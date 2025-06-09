// app/game/page.tsx

'use client';

export default function GamePage() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <iframe
        src="/phaser/index.html"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
        }}
        title="FarmVerse Game"
      />
    </div>
  );
}
