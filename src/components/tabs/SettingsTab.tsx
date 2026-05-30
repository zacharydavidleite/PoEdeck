import {
  ButtonItem,
  DropdownItem,
  PanelSection,
  PanelSectionRow,
  TextField,
  ToggleField,
} from "@decky/ui";
import { toaster } from "@decky/api";
import { FC, useEffect, useState } from "react";

import {
  getActiveProfile,
  persistProfile,
  setActiveProfile,
  updateSettings,
  useStore,
} from "../../state";
import {
  BuildProfile,
  POE2_CLASSES,
  SHORTCUT_OPTIONS,
  emptyProfile,
} from "../../types";

export const SettingsTab: FC = () => {
  const { profiles, settings } = useStore();
  const [draft, setDraft] = useState<BuildProfile>(emptyProfile());

  // Sync the editable draft with whichever profile is active.
  useEffect(() => {
    const active = getActiveProfile();
    setDraft(active ? { ...active } : { ...emptyProfile(), guideUrl: settings.guideUrl });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.activeProfileId, profiles.length]);

  const update = (patch: Partial<BuildProfile>) =>
    setDraft((d) => ({ ...d, ...patch }));

  const onSave = async () => {
    const saved = await persistProfile(draft, true);
    await updateSettings({ guideUrl: draft.guideUrl });
    setDraft({ ...saved });
    toaster.toast({ title: "Exile Guide", body: "Build saved" });
  };

  const onNew = () => setDraft({ ...emptyProfile(), guideUrl: settings.guideUrl });

  return (
    <>
    <PanelSection title="Settings">
      {profiles.length > 0 && (
        <PanelSectionRow>
          <DropdownItem
            label="Active build"
            rgOptions={profiles.map((p) => ({
              label: p.name || "(unnamed)",
              data: p.id,
            }))}
            selectedOption={settings.activeProfileId || profiles[0]?.id}
            onChange={(opt) => setActiveProfile(opt.data as string)}
          />
        </PanelSectionRow>
      )}

      <PanelSectionRow>
        <TextField
          label="Mobalytics guide URL"
          value={draft.guideUrl}
          onChange={(e) => update({ guideUrl: e.currentTarget.value })}
        />
      </PanelSectionRow>

      <PanelSectionRow>
        <TextField
          label="Build name"
          value={draft.name}
          onChange={(e) => update({ name: e.currentTarget.value })}
        />
      </PanelSectionRow>

      <PanelSectionRow>
        <DropdownItem
          label="Class"
          rgOptions={POE2_CLASSES.map((c) => ({ label: c, data: c }))}
          selectedOption={draft.characterClass}
          onChange={(opt) => update({ characterClass: opt.data as string })}
        />
      </PanelSectionRow>

      <PanelSectionRow>
        <TextField
          label="Ascendancy"
          value={draft.ascendancy}
          onChange={(e) => update({ ascendancy: e.currentTarget.value })}
        />
      </PanelSectionRow>

      <PanelSectionRow>
        <ButtonItem layout="below" onClick={onSave}>
          Save build
        </ButtonItem>
      </PanelSectionRow>
      <PanelSectionRow>
        <ButtonItem layout="below" onClick={onNew}>
          New build
        </ButtonItem>
      </PanelSectionRow>
    </PanelSection>

    <PanelSection title="Controller shortcut">
      <PanelSectionRow>
        <ToggleField
          label="Open guide in browser with a button"
          description="Opens your guide URL in Steam's browser, even in-game. Uses back paddles by default to avoid conflicts."
          checked={settings.shortcutEnabled}
          onChange={(checked) => updateSettings({ shortcutEnabled: checked })}
        />
      </PanelSectionRow>
      {settings.shortcutEnabled && (
        <PanelSectionRow>
          <DropdownItem
            label="Button"
            rgOptions={SHORTCUT_OPTIONS.map((o) => ({
              label: o.label,
              data: o.key,
            }))}
            selectedOption={settings.shortcutCombo}
            onChange={(opt) => updateSettings({ shortcutCombo: opt.data as string })}
          />
        </PanelSectionRow>
      )}
    </PanelSection>
    </>
  );
};
