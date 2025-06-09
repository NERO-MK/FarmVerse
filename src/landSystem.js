// File: src/LandSystem.js

const BASE_LAND_ID = 1;
const MAX_LAND_ID = 30;

// Default unlocked lands
const defaultUnlocked = [1, 2, 3];

// Dummy character and resource data (replace with real game state later)
const playerData = {
  level: parseInt(localStorage.getItem("characterLevel")) || 1,
  resources: {
    crop: 100,
    wood: 50,
    stone: 30,
    iron: 20,
    coin: 1000,
    TOKEN: 10
  }
};

// Land unlock requirements
function getLandRequirements(landId) {
  return {
    level: Math.max(1, landId + 5), // e.g. Land 4 needs level 9
    cost: {
      crop: landId * 5,
      wood: landId * 3,
      stone: landId * 2,
      iron: landId,
      coin: landId * 100,
      TOKEN: Math.floor(landId / 2)
    },
    cooldownHours: 2 + landId * 4 // e.g. land 4 = 18 hrs, land 10 = 42 hrs
  };
}

// Unlocked land from localStorage
export function getUnlockedLandIds() {
  return JSON.parse(localStorage.getItem("unlockedLands")) || defaultUnlocked;
}

export function isLandUnlocked(id) {
  return getUnlockedLandIds().includes(id);
}

// Cooldown
export function getRemainingCooldown(id) {
  const unlockTime = parseInt(localStorage.getItem(`cooldown_${id}`)) || 0;
  const now = Date.now();
  const remaining = unlockTime - now;

  if (remaining <= 0) return 0;

  const hours = Math.floor(remaining / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);

  return `${hours}h ${minutes}m ${seconds}s`;
}

export function setLandCooldown(id, hours) {
  const unlockTime = Date.now() + hours * 60 * 60 * 1000;
  localStorage.setItem(`cooldown_${id}`, unlockTime.toString());
}

// Check if user can unlock
export function canUnlockLand(id) {
  const requirements = getLandRequirements(id);
  if (playerData.level < requirements.level) return false;

  for (const key in requirements.cost) {
    if ((playerData.resources[key] || 0) < requirements.cost[key]) return false;
  }

  return true;
}

// Unlock land
export function unlockLand(id) {
  const unlocked = getUnlockedLandIds();
  if (!unlocked.includes(id)) {
    unlocked.push(id);
    localStorage.setItem("unlockedLands", JSON.stringify(unlocked));
  }

  const requirements = getLandRequirements(id);
  setLandCooldown(id, requirements.cooldownHours);

  // Deduct resources
  for (const key in requirements.cost) {
    playerData.resources[key] -= requirements.cost[key];
  }

  // Optional: Save deducted values
  console.log(`Land ${id} unlocked. Remaining resources:`, playerData.resources);
}
