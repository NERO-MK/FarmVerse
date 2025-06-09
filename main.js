import Phaser from 'phaser';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#c2f0c2',
  parent: 'app',
  scene: {
    preload,
    create,
    update
  }
};

const TILE_SIZE = 64;
const PLOT_COOLDOWN = 5000;

let plots = [];

const game = new Phaser.Game(config);

function preload() {}

function create() {
  this.add.text(20, 20, '🌾 FarmVerse: Basic Land', {
    font: '20px Arial',
    fill: '#000'
  });

  // === Basic Land Layout ===
  const startX = 150;
  const startY = 100;

  // 3x3 Farm Plots (9)
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const x = startX + col * TILE_SIZE;
      const y = startY + row * TILE_SIZE;

      const tile = this.add.rectangle(x, y, TILE_SIZE - 4, TILE_SIZE - 4, 0x8B4513)
        .setOrigin(0)
        .setInteractive();

      tile.isPlanted = false;
      tile.plantedAt = 0;
      tile.cooldown = PLOT_COOLDOWN;

      tile.on('pointerdown', () => {
        const now = this.time.now;
        if (!tile.isPlanted || now - tile.plantedAt >= tile.cooldown) {
          tile.setFillStyle(0x228B22); // planted
          tile.isPlanted = true;
          tile.plantedAt = now;
        }
      });

      plots.push(tile);
    }
  }

  // Add 5 Trees
  const treePositions = [
    [500, 120],
    [600, 150],
    [550, 220],
    [480, 280],
    [620, 300],
  ];

  for (let [x, y] of treePositions) {
    const tree = this.add.circle(x, y, 20, 0x006400);
    this.add.text(x - 10, y - 10, '🌳', { font: '16px Arial' });
  }

  // Add 3 Stones
  const stonePositions = [
    [120, 400],
    [180, 420],
    [240, 410],
  ];

  for (let [x, y] of stonePositions) {
    const stone = this.add.circle(x, y, 16, 0x555555);
    this.add.text(x - 10, y - 10, '🪨', { font: '16px Arial' });
  }

  // Add 1 Iron
  this.add.circle(320, 400, 16, 0xC0C0C0);
  this.add.text(310, 390, '⛓️', { font: '16px Arial' });

  // Instructions
  this.add.text(100, 550, '🧑‍🌾 Tap brown tiles to plant. More lands can be unlocked later.', {
    font: '16px Arial',
    fill: '#333'
  });
}

function update() {
  const now = this.time.now;
  for (let tile of plots) {
    if (tile.isPlanted && now - tile.plantedAt >= tile.cooldown) {
      tile.setFillStyle(0x8B4513);
      tile.isPlanted = false;
    }
  }
}
