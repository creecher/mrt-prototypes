/**
 * Converts Figma DTCG tokens (Light-tokens.json) into a MUI palette JS module.
 *
 * Usage:  node scripts/convertTokens.js
 * Output: src/theme/palette.js
 */

const fs = require('fs');
const path = require('path');

const tokens = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../Light-tokens.json'), 'utf-8')
);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Convert a token's $value to a CSS color string (hex or rgba). */
function toColor(value) {
  const { hex, alpha } = value;
  if (alpha != null && alpha < 1) {
    // Parse hex to RGB
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${parseFloat(alpha.toFixed(4))})`;
  }
  return `#${hex.slice(1)}`; // normalise to lowercase-ish — keep as-is
}

/** Recursively collect leaf tokens from a branch, keyed by their path. */
function collectLeaves(obj, prefix = '') {
  const results = [];
  for (const [key, val] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (val && val.$type === 'color') {
      results.push({ path, token: val });
    } else if (val && typeof val === 'object' && !key.startsWith('$')) {
      results.push(...collectLeaves(val, path));
    }
  }
  return results;
}

/** Build nested object from dot-path. */
function setNested(obj, dotPath, value) {
  const parts = dotPath.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!(parts[i] in cur)) cur[parts[i]] = {};
    cur = cur[parts[i]];
  }
  cur[parts[parts.length - 1]] = value;
}

// ---------------------------------------------------------------------------
// Build palette
// ---------------------------------------------------------------------------

const palette = {};

// --- Standard MUI groups ---
const standardGroups = [
  'primary', 'secondary', 'error', 'info', 'success', 'warning',
  'text', 'action', 'common',
];

for (const group of standardGroups) {
  if (!tokens[group]) continue;
  const leaves = collectLeaves(tokens[group]);
  const groupObj = {};
  for (const { path: leafPath, token } of leaves) {
    // Convert kebab keys to camelCase for MUI compatibility
    const muiKey = leafPath.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    setNested(groupObj, muiKey, toColor(token.$value));
  }
  palette[group] = groupObj;
}

// --- divider (single value) ---
if (tokens.divider) {
  // MUI expects palette.divider to be a single color string
  if (tokens.divider.default) {
    palette.divider = toColor(tokens.divider.default.$value);
  }
  // Extra divider tokens as custom values
  const extraDividers = {};
  for (const [key, val] of Object.entries(tokens.divider)) {
    if (key === 'default') continue;
    if (val.$type === 'color') {
      const muiKey = key.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      extraDividers[muiKey] = toColor(val.$value);
    }
  }
  if (Object.keys(extraDividers).length > 0) {
    palette.dividerExtra = extraDividers;
  }
}

// --- background ---
if (tokens.background) {
  const bg = {};
  if (tokens.background.default) {
    bg.default = toColor(tokens.background.default.$value);
  }
  if (tokens.background['default-alpha']) {
    bg.lightestWhite = toColor(tokens.background['default-alpha'].$value);
  }
  // paper — use elevation-0 as the standard paper value
  if (tokens.background.paper) {
    const paperTokens = tokens.background.paper;
    if (paperTokens['elevation-0']) {
      bg.paper = toColor(paperTokens['elevation-0'].$value);
    }
    // All elevation variants
    for (const [key, val] of Object.entries(paperTokens)) {
      if (val.$type === 'color') {
        const camel = key.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
        bg[`paper${camel.charAt(0).toUpperCase()}${camel.slice(1)}`] = toColor(val.$value);
      }
    }
  }
  // gradient stops
  if (tokens.background.gradient) {
    for (const [key, val] of Object.entries(tokens.background.gradient)) {
      if (val.$type === 'color') {
        const camel = key.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
        bg[`gradient${camel.charAt(0).toUpperCase()}${camel.slice(1)}`] = toColor(val.$value);
      }
    }
  }
  palette.background = bg;
}

// --- accent (custom — Radix color scales) ---
if (tokens.accent) {
  const accent = {};
  for (const [scaleName, scaleObj] of Object.entries(tokens.accent)) {
    if (typeof scaleObj !== 'object') continue;
    accent[scaleName] = {};
    for (const [step, token] of Object.entries(scaleObj)) {
      if (token.$type === 'color') {
        accent[scaleName][step] = toColor(token.$value);
      }
    }
  }
  palette.accent = accent;
}

// --- component (custom) ---
if (tokens.component) {
  const component = {};
  const leaves = collectLeaves(tokens.component);
  for (const { path: leafPath, token } of leaves) {
    const muiKey = leafPath.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    setNested(component, muiKey, toColor(token.$value));
  }
  palette.component = component;
}

// --- inverted (custom) ---
if (tokens.inverted) {
  const inverted = {};
  const leaves = collectLeaves(tokens.inverted);
  for (const { path: leafPath, token } of leaves) {
    const muiKey = leafPath.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    setNested(inverted, muiKey, toColor(token.$value));
  }
  palette.inverted = inverted;
}

// ---------------------------------------------------------------------------
// Write output
// ---------------------------------------------------------------------------

const outputPath = path.resolve(__dirname, '../src/theme/palette.js');

const fileContent = `/**
 * Auto-generated from Light-tokens.json by scripts/convertTokens.js
 * Do not edit manually — re-run the script when tokens change.
 */

export const palette = ${JSON.stringify(palette, null, 2)};
`;

fs.writeFileSync(outputPath, fileContent, 'utf-8');

const tokenCount = collectLeaves(tokens).filter(
  (l) => !l.path.startsWith('$extensions')
).length;
console.log(`Wrote ${tokenCount} tokens to ${outputPath}`);
