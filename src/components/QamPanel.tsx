import {
  ButtonItem,
  Field,
  PanelSection,
  PanelSectionRow,
} from "@decky/ui";
import { Navigation } from "@decky/ui";
import { FC, useEffect } from "react";
import { FaBook } from "react-icons/fa";

import { EXILE_GUIDE_ROUTE } from "../routes";
import { getActiveProfile, loadAll, useStore } from "../state";
import { copyToClipboard } from "../util";

export const QamPanel: FC = () => {
  const { loaded, campaign, settings } = useStore();

  useEffect(() => {
    loadAll();
  }, []);

  const active = getActiveProfile();

  const campaignProgress = (() => {
    if (!campaign) return null;
    const total = campaign.acts.reduce((n, a) => n + a.steps.length, 0);
    const done = campaign.acts.reduce(
      (n, a) =>
        n + a.steps.filter((s) => campaign.checkedSteps?.[s.id]).length,
      0,
    );
    return `${done}/${total}`;
  })();

  const openFullPage = () => {
    Navigation.Navigate(EXILE_GUIDE_ROUTE);
    Navigation.CloseSideMenus();
  };

  return (
    <>
      <PanelSection title="Active build">
        {active ? (
          <PanelSectionRow>
            <Field
              label={active.name || "(unnamed build)"}
              focusable={false}
              bottomSeparator="none"
            >
              {active.characterClass}
              {active.ascendancy ? ` — ${active.ascendancy}` : ""}
            </Field>
          </PanelSectionRow>
        ) : (
          <PanelSectionRow>
            <Field focusable={false}>
              {loaded ? "No build yet — open Exile Guide to create one." : "Loading…"}
            </Field>
          </PanelSectionRow>
        )}

        {settings.guideUrl && (
          <PanelSectionRow>
            <ButtonItem
              layout="below"
              onClick={() => copyToClipboard(settings.guideUrl, "Guide URL")}
            >
              Copy guide URL
            </ButtonItem>
          </PanelSectionRow>
        )}
      </PanelSection>

      <PanelSection title="Quick reminders">
        <PanelSectionRow>
          <Field label="Resistances" focusable={false} bottomSeparator="none">
            Cap Fire/Cold/Lightning at 75%. -30% on Cruel & endgame.
          </Field>
        </PanelSectionRow>
        <PanelSectionRow>
          <Field label="Attributes" focusable={false} bottomSeparator="none">
            Meet Str / Dex / Int for your gear & gems.
          </Field>
        </PanelSectionRow>
        {campaignProgress && (
          <PanelSectionRow>
            <Field label="Campaign rewards" focusable={false} bottomSeparator="none">
              {campaignProgress} collected
            </Field>
          </PanelSectionRow>
        )}
      </PanelSection>

      <PanelSection>
        <PanelSectionRow>
          <ButtonItem layout="below" icon={<FaBook />} onClick={openFullPage}>
            Open Exile Guide
          </ButtonItem>
        </PanelSectionRow>
      </PanelSection>
    </>
  );
};
