// File: src/main.js
import Phaser from "phaser";
import {
  getUnlockedLandIds,
  isLandUnlocked,
  getLandRequirements,
  getRemainingCooldown,
  canUnlockLand,
  unlockLand,
  setLandCooldown
} from "./landSystem";

const TILE_SIZE = 64;
const GRID_ROWS = 5;
const GRID_COLS = 6;

let unlockedLand = getUnlockedLandIds();
let objectPositions = JSON.parse(localStorage.getItem("objectPositions")) || {};

class FarmScene extends Phaser.Scene {
  constructor() {
    super("FarmScene");
  }

  preload() {
    this.load.image("land", "public/land.png");
    this.load.image("locked", "public/locked.png");
    this.load.image("tree", "public/tree.png");
    this.load.image("stone", "public/stone.png");
    this.load.image("plot", "public/plot.png");
  }

  create() {
    this.createLandGrid();
    this.createDraggableObjects();

    // Tooltip text
    this.tooltip = this.add.text(0, 0, "", {
      fontSize: "14px",
      fill: "#ffffff",
      backgroundColor: "#000000aa",
      padding: { x: 6, y: 3 }
    })
    .setDepth(10)
    .setVisible(false);
  }

  createLandGrid() {
    this.landTiles = {};
    this.lockedTiles = {};
    let id = 1;

    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        const x = col * TILE_SIZE + TILE_SIZE / 2;
        const y = row * TILE_SIZE + TILE_SIZE / 2;

        if (isLandUnlocked(id)) {
          const tile = this.add.image(x, y, "land").setData("id", id);
          this.landTiles[id] = tile;
        } else {
          const locked = this.add.image(x, y, "locked")
            .setInteractive()
            .setData("id", id);

          locked.on("pointerdown", () => this.showUnlockPopup(id));
          this.lockedTiles[id] = locked;
        }
        id++;
      }
    }
  }

  showUnlockPopup(landId) {
    const requirements = getLandRequirements(landId);
    const cooldown = getRemainingCooldown(landId);
    const confirmText = cooldown > 0
      ? `Land ${landId} is cooling down (${cooldown})`
      : `Unlock Land ${landId}?\nRequires:\n${JSON.stringify(requirements, null, 2)}`;

    if (cooldown > 0) {
      alert(confirmText);
      return;
    }

    const confirm = window.confirm(confirmText);
    if (confirm && canUnlockLand(landId)) {
      unlockLand(landId);
      this.scene.restart();
    } else if (!canUnlockLand(landId)) {
      alert("Not enough resources or level!");
    }
  }

  createDraggableObjects() {
    this.input.setDraggable(this.addObjects());

    this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });

    this.input.on("dragend", (pointer, gameObject) => {
      const { id } = gameObject.getData("meta");
      objectPositions[id] = { x: gameObject.x, y: gameObject.y };
      localStorage.setItem("objectPositions", JSON.stringify(objectPositions));
    });
  }

  addObjects() {
    const objects = [];
    const items = [
      { id: "tree1", key: "tree", default: { x: 100, y: 100 }, tooltip: "Tree: can be chopped" },
      { id: "stone1", key: "stone", default: { x: 200, y: 150 }, tooltip: "Stone: collectable" },
      { id: "plot1", key: "plot", default: { x: 160, y: 220 }, tooltip: "Plot: plant seeds" }
    ];

    for (const item of items) {
      const pos = objectPositions[item.id] || item.default;
      const obj = this.add.image(pos.x, pos.y, item.key)
        .setInteractive({ draggable: true })
        .setData("meta", { id: item.id, tooltip: item.tooltip });

      obj.on("pointerover", (pointer) => this.showTooltip(pointer, item.tooltip));
      obj.on("pointerout", () => this.hideTooltip());

      objects.push(obj);
    }

    return objects;
  }

  showTooltip(pointer, text) {
    this.tooltip.setText(text);
    this.tooltip.setPosition(pointer.worldX + 10, pointer.worldY + 10);
    this.tooltip.setVisible(true);
  }

  hideTooltip() {
    this.tooltip.setVisible(false);
  }
}

const config = {
  type: Phaser.AUTO,
  width: TILE_SIZE * GRID_COLS,
  height: TILE_SIZE * GRID_ROWS,
  scene: [FarmScene],
};

new Phaser.Game(config);
