// Shared types for the Exile Guide frontend.

export interface Settings {
  guideUrl: string;
  activeProfileId: string;
  lootFilterNotes: string;
  shortcutEnabled: boolean;
  shortcutCombo: string;
}

// Controller shortcut presets. Button codes come from
// ControllerInputGamepadButton in decky-frontend-lib's Input.ts.
// A=0, L4=32, R4=33, L5=44, R5=45.
export interface ShortcutOption {
  key: string;
  label: string;
  buttons: number[];
}

export const SHORTCUT_OPTIONS: ShortcutOption[] = [
  { key: "l4_r4", label: "L4 + R4 (back paddles)", buttons: [32, 33] },
  { key: "l5_r5", label: "L5 + R5 (upper back)", buttons: [44, 45] },
  { key: "l4_r5", label: "L4 + R5", buttons: [32, 45] },
  { key: "l4", label: "L4 only", buttons: [32] },
  { key: "r4", label: "R4 only", buttons: [33] },
  { key: "l5", label: "L5 only", buttons: [44] },
  { key: "r5", label: "R5 only", buttons: [45] },
];

export const DEFAULT_SHORTCUT_COMBO = "l4_r4";

export interface BuildProfile {
  id: string;
  name: string;
  characterClass: string;
  ascendancy: string;
  guideUrl: string;
  skillGems: string;
  passivePriorities: string;
  gearPriorities: string;
  bossNotes: string;
  customNotes: string;
}

export interface CampaignStep {
  id: string;
  label: string;
  reward: string;
  type: string;
}

export interface CampaignAct {
  id: string;
  name: string;
  steps: CampaignStep[];
}

export interface CampaignGuide {
  version: string;
  game: string;
  note?: string;
  acts: CampaignAct[];
  checkedSteps: Record<string, boolean>;
  totals?: Record<string, unknown>;
}

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export const POE2_CLASSES = [
  "Warrior",
  "Witch",
  "Ranger",
  "Mercenary",
  "Monk",
  "Sorceress",
  "Druid",
  "Huntress",
] as const;

export function emptyProfile(): BuildProfile {
  return {
    id: "",
    name: "",
    characterClass: POE2_CLASSES[0],
    ascendancy: "",
    guideUrl: "",
    skillGems: "",
    passivePriorities: "",
    gearPriorities: "",
    bossNotes: "",
    customNotes: "",
  };
}
