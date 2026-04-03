// js/data.js — barrel re-exports for widely-shared data constants
// Import from here for constants used across 4+ modules.
// Import directly from source for niche/single-consumer constants.

export { TREE, HOMININS, MAX_BRAIN, ERA_GROUPS, HOMININ_ID_ALIASES, lightenColor } from './treeData.js';
export { PHOTO_MAP, ENRICHMENT, WIKI_TITLES, GREAT_APE_IDS, HOMININ_IDS } from './speciesData.js';
export { TRANSLATIONS } from './uiData.js';
export { FACTS } from './factLibrary.js';
export { ImageLoader } from './imageLoader.js';
export { NODE_ICONS, getIconGroup } from './nodeIcons.js';
