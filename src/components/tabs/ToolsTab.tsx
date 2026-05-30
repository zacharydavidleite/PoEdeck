import {
  ButtonItem,
  Field,
  PanelSection,
  PanelSectionRow,
  TextField,
} from "@decky/ui";
import { toaster } from "@decky/api";
import { FC, useEffect, useState } from "react";

import { updateSettings, useStore } from "../../state";
import { copyToClipboard, openGuideInBrowser } from "../../util";

export const ToolsTab: FC = () => {
  const { settings } = useStore();
  const [notes, setNotes] = useState(settings.lootFilterNotes);

  useEffect(() => {
    setNotes(settings.lootFilterNotes);
  }, [settings.lootFilterNotes]);

  const saveNotes = async () => {
    await updateSettings({ lootFilterNotes: notes });
    toaster.toast({ title: "Exile Guide", body: "Loot filter notes saved" });
  };

  return (
    <>
      <PanelSection title="Resistance reminder">
        <PanelSectionRow>
          <Field focusable={false}>
            Cap each elemental resistance at <b>75%</b>. You lose <b>-30%</b> to
            all elemental resistances when entering Cruel difficulty, and again
            on entering the endgame — re-cap Fire, Cold and Lightning each time.
          </Field>
        </PanelSectionRow>
      </PanelSection>

      <PanelSection title="Attribute reminder">
        <PanelSectionRow>
          <Field focusable={false}>
            Keep enough <b>Strength</b> (armour/life gear), <b>Dexterity</b>
            {" "}(evasion/accuracy gear) and <b>Intelligence</b> (ES/spell gear)
            to meet your gear and skill-gem requirements. Missing attributes
            disable the item or gem.
          </Field>
        </PanelSectionRow>
      </PanelSection>

      <PanelSection title="Loot filter notes">
        <PanelSectionRow>
          <TextField
            label="Notes"
            value={notes}
            onChange={(e) => setNotes(e.currentTarget.value)}
          />
        </PanelSectionRow>
        <PanelSectionRow>
          <ButtonItem layout="below" onClick={saveNotes}>
            Save notes
          </ButtonItem>
        </PanelSectionRow>
      </PanelSection>

      <PanelSection title="Quick links">
        {settings.guideUrl ? (
          <>
            <PanelSectionRow>
              <ButtonItem
                layout="below"
                description={settings.guideUrl}
                onClick={() => openGuideInBrowser(settings.guideUrl)}
              >
                Open guide in browser
              </ButtonItem>
            </PanelSectionRow>
            <PanelSectionRow>
              <ButtonItem
                layout="below"
                onClick={() => copyToClipboard(settings.guideUrl, "Guide URL")}
              >
                Copy guide URL
              </ButtonItem>
            </PanelSectionRow>
          </>
        ) : (
          <PanelSectionRow>
            <Field focusable={false}>
              Save a Mobalytics guide URL in Settings to open it in the browser
              from here.
            </Field>
          </PanelSectionRow>
        )}
      </PanelSection>
    </>
  );
};
