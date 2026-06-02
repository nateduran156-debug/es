/**
 * In-memory store for per-group ping settings.
 * Defaults to pings ON for every group.
 * Resets when the bot restarts — persist to a JSON file or DB if you want it to survive restarts.
 */

import { vanityGroups } from "./config.js";

const pingEnabled = {};

// Start every group with pings enabled
for (const group of Object.keys(vanityGroups)) {
  pingEnabled[group] = true;
}

export function isPingEnabled(group) {
  return pingEnabled[group] ?? true;
}

export function setPingEnabled(group, enabled) {
  pingEnabled[group] = enabled;
}

export function getAllPingSettings() {
  return { ...pingEnabled };
}
