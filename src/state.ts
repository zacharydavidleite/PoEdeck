import { useSyncExternalStore } from "react";

import * as api from "./api";
import type {
  BuildProfile,
  CampaignGuide,
  ChecklistItem,
  Settings,
} from "./types";

// A single module-level store shared across the QAM panel and the routed
// full-page view (Rollup bundles everything into one module instance, so the
// state below is the same object in both React trees). The backend remains the
// source of truth; this store just caches it and notifies subscribers.

interface StoreState {
  loaded: boolean;
  settings: Settings;
  profiles: BuildProfile[];
  checklist: ChecklistItem[];
  campaign: CampaignGuide | null;
}

const DEFAULT_SETTINGS: Settings = {
  guideUrl: "",
  activeProfileId: "",
  lootFilterNotes: "",
};

let state: StoreState = {
  loaded: false,
  settings: DEFAULT_SETTINGS,
  profiles: [],
  checklist: [],
  campaign: null,
};

const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function set(partial: Partial<StoreState>) {
  state = { ...state, ...partial };
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return state;
}

export function useStore(): StoreState {
  return useSyncExternalStore(subscribe, getSnapshot);
}

// ---- Loading --------------------------------------------------------------

let loadPromise: Promise<void> | null = null;

export async function loadAll(force = false): Promise<void> {
  if (loadPromise && !force) return loadPromise;
  loadPromise = (async () => {
    const [settings, profiles, checklist, campaign] = await Promise.all([
      api.getSettings(),
      api.getProfiles(),
      api.getChecklist(),
      api.getCampaignGuide(),
    ]);
    set({ loaded: true, settings, profiles, checklist, campaign });
  })();
  await loadPromise;
}

// ---- Derived --------------------------------------------------------------

export function getActiveProfile(): BuildProfile | null {
  const { profiles, settings } = state;
  if (!profiles.length) return null;
  return (
    profiles.find((p) => p.id === settings.activeProfileId) ?? profiles[0]
  );
}

// ---- Actions --------------------------------------------------------------

export async function updateSettings(partial: Partial<Settings>) {
  const settings = await api.setSettings(partial);
  set({ settings });
}

export async function persistProfile(profile: BuildProfile, makeActive = false) {
  const saved = await api.saveProfile(profile);
  const profiles = [...state.profiles];
  const index = profiles.findIndex((p) => p.id === saved.id);
  if (index >= 0) profiles[index] = saved;
  else profiles.push(saved);
  set({ profiles });
  if (makeActive || !state.settings.activeProfileId) {
    await updateSettings({ activeProfileId: saved.id });
  }
  return saved;
}

export async function removeProfile(profileId: string) {
  await api.deleteProfile(profileId);
  await loadAll(true);
}

export async function setActiveProfile(profileId: string) {
  await updateSettings({ activeProfileId: profileId });
}

export async function toggleCampaignStep(stepId: string) {
  if (!state.campaign) return;
  const checkedSteps = { ...state.campaign.checkedSteps };
  if (checkedSteps[stepId]) delete checkedSteps[stepId];
  else checkedSteps[stepId] = true;
  const campaign = { ...state.campaign, checkedSteps };
  set({ campaign });
  await api.saveCampaignProgress({ checkedSteps });
}

export async function setChecklist(items: ChecklistItem[]) {
  set({ checklist: items });
  await api.saveChecklist(items);
}
