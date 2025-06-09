// src/landSystem.js

// Base land IDs (always unlocked)
const BASE_LAND_IDS = [1, 2, 3];

// Land requirements configuration
const LAND_REQUIREMENTS = {
  4: { level: 5, cooldown: 2 * 60 * 60 * 1000 },      // 2h
  5: { level: 6, cooldown: 2 * 60 * 60 * 1000 },
  6: { level: 7, cooldown: 2 * 60 * 60 * 1000 },
  7: { level: 8, cooldown: 2 * 60 * 60 * 1000 },
  8: { level: 9, cooldown: 2 * 60 * 60 * 1000 },
  9: { level: 10, cooldown: 2 * 60 * 60 * 1000 },

  10: { level: 11, cooldown: 4 * 60 * 60 * 1000 },     // 4h
  11: { level: 12, cooldown: 4 * 60 * 60 * 1000 },
  12: { level: 13, cooldown: 4 * 60 * 60 * 1000 },
  13: { level: 14, cooldown: 4 * 60 * 60 * 1000 },
  14: { level: 15, cooldown: 4 * 60 * 60 * 1000 },
  15: { level: 16, cooldown: 4 * 60 * 60 * 1000 },
  16: { level: 17, cooldown: 4 * 60 * 60 * 1000 },

  17: { level: 18, cooldown: 8 * 60 * 60 * 1000 },     // 8h
  18: { level: 20, cooldown: 8 * 60 * 60 * 1000 },
  19: { level: 22, cooldown: 8 * 60 * 60 * 1000 },
  20: { level: 24, cooldown: 8 * 60 * 60 * 1000 },
  21: { level: 26, cooldown: 8 * 60 * 60 * 1000 },
  22: { level: 28, cooldown: 8 * 60 * 60 * 1000 },
  23: { level: 30, cooldown: 8 * 60 * 60 * 1000 },
  24: { level: 32, cooldown: 8 * 60 * 60 * 1000 },
  25: { level: 34, cooldown: 8 * 60 * 60 * 1000 },

  26: { level: 40, cooldown: 24 * 60 * 60 * 1000 },    // 24h
  27: { level: 45, cooldown: 24 * 60 * 60 * 1000 },
  28: { level: 50, cooldown: 24 * 60 * 60 * 1000 },
  29: { level: 55, cooldown: 24 * 60 * 60 * 1000 },
  30: { level: 60, cooldown: 24 * 60 * 60 * 1000 },
};

// Get unlocked land IDs from localStorage
function getUnlockedLandIds() {
  const stored = localStorage.getItem('unlockedLandIds');
  const parsed = stored ? JSON.parse(stored) : [];
  return [...new Set([...BASE_LAND_IDS, ...parsed])];
}

// Check if a land is unlocked
function isLandUnlocked(landId) {
  return getUnlockedLandIds().includes(landId);
}

// Get requirements for a land
function getLandRequirements(landId) {
  return LAND_REQUIREMENTS[landId] || null;
}

// Get remaining cooldown time for a land
function getRemainingCooldown(landId) {
  const unlockTime = localStorage.getItem(`unlockTime-${landId}`);
  const req = getLandRequirements(landId);
  if (!unlockTime || !req) return 0;

  const elapsed = Date.now() - Number(unlockTime);
  const remaining = req.cooldown - elapsed;
  return remaining > 0 ? remaining : 0;
}

// Check if a land can be unlocked
function canUnlockLand(landId, playerLevel) {
  if (isLandUnlocked(landId)) return false;
  const req = getLandRequirements(landId);
  if (!req || playerLevel < req.level) return false;
  return getRemainingCooldown(landId) <= 0;
}

// Unlock land and store in localStorage
function unlockLand(landId) {
  const unlocked = getUnlockedLandIds();
  if (!unlocked.includes(landId)) {
    unlocked.push(landId);
    localStorage.setItem('unlockedLandIds', JSON.stringify(unlocked));
  }
}

// Set the cooldown timer for a land unlock
function setLandCooldown(landId) {
  localStorage.setItem(`unlockTime-${landId}`, Date.now().toString());
}

// Export all functions
export {
  getUnlockedLandIds,
  isLandUnlocked,
  getLandRequirements,
  getRemainingCooldown,
  canUnlockLand,
  unlockLand,
  setLandCooldown,
};
