import { callable } from "@decky/api";

import type {
  BuildProfile,
  CampaignGuide,
  ChecklistItem,
  Settings,
} from "./types";

export const getSettings = callable<[], Settings>("get_settings");
export const setSettings = callable<[settings: Partial<Settings>], Settings>(
  "set_settings",
);

export const getProfiles = callable<[], BuildProfile[]>("get_profiles");
export const saveProfile = callable<[profile: BuildProfile], BuildProfile>(
  "save_profile",
);
export const deleteProfile = callable<[profileId: string], boolean>(
  "delete_profile",
);

export const getCampaignGuide = callable<[], CampaignGuide>(
  "get_campaign_guide",
);
export const saveCampaignProgress = callable<
  [progress: { checkedSteps: Record<string, boolean> }],
  { checkedSteps: Record<string, boolean> }
>("save_campaign_progress");

export const getChecklist = callable<[], ChecklistItem[]>("get_checklist");
export const saveChecklist = callable<[items: ChecklistItem[]], ChecklistItem[]>(
  "save_checklist",
);
