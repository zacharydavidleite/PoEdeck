import {
  ButtonItem,
  Field,
  PanelSection,
  PanelSectionRow,
  TextField,
} from "@decky/ui";
import { toaster } from "@decky/api";
import { FC, useEffect, useState } from "react";

import { getActiveProfile, persistProfile, useStore } from "../../state";
import { BuildProfile } from "../../types";
import { copyToClipboard } from "../../util";

const SECTIONS: { key: keyof BuildProfile; label: string }[] = [
  { key: "skillGems", label: "Skill gems" },
  { key: "passivePriorities", label: "Passive priorities" },
  { key: "gearPriorities", label: "Gear priorities" },
  { key: "bossNotes", label: "Boss notes" },
  { key: "customNotes", label: "Custom notes" },
];

export const MyBuildTab: FC = () => {
  const { profiles, settings } = useStore();
  const [draft, setDraft] = useState<BuildProfile | null>(null);

  useEffect(() => {
    const active = getActiveProfile();
    setDraft(active ? { ...active } : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.activeProfileId, profiles.length]);

  if (!draft) {
    return (
      <PanelSection title="My Build">
        <PanelSectionRow>
          <Field label="No build yet">
            Create one in the Settings tab to start tracking your guide.
          </Field>
        </PanelSectionRow>
      </PanelSection>
    );
  }

  const update = (patch: Partial<BuildProfile>) =>
    setDraft((d) => (d ? { ...d, ...patch } : d));

  const onSave = async () => {
    await persistProfile(draft, false);
    toaster.toast({ title: "Exile Guide", body: "Notes saved" });
  };

  return (
    <PanelSection title={draft.name || "My Build"}>
      <PanelSectionRow>
        <Field
          label="Class"
          focusable={false}
          bottomSeparator="none"
        >
          {draft.characterClass}
          {draft.ascendancy ? ` — ${draft.ascendancy}` : ""}
        </Field>
      </PanelSectionRow>

      {draft.guideUrl ? (
        <PanelSectionRow>
          <ButtonItem
            layout="below"
            description={draft.guideUrl}
            onClick={() => copyToClipboard(draft.guideUrl, "Guide URL")}
          >
            Copy guide URL
          </ButtonItem>
        </PanelSectionRow>
      ) : null}

      {SECTIONS.map((section) => (
        <PanelSectionRow key={section.key as string}>
          <TextField
            label={section.label}
            value={(draft[section.key] as string) ?? ""}
            onChange={(e) =>
              update({ [section.key]: e.currentTarget.value } as Partial<BuildProfile>)
            }
          />
        </PanelSectionRow>
      ))}

      <PanelSectionRow>
        <ButtonItem layout="below" onClick={onSave}>
          Save notes
        </ButtonItem>
      </PanelSectionRow>
    </PanelSection>
  );
};
