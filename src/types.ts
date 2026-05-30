// Shared types for the Exile Guide frontend.

export interface Settings {
  guideUrl: string;
  activeProfileId: string;
  lootFilterNotes: string;
}

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
