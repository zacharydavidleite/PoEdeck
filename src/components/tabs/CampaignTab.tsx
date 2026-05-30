import {
  Field,
  PanelSection,
  PanelSectionRow,
  ToggleField,
} from "@decky/ui";
import { FC, useState } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

import { toggleCampaignStep, useStore } from "../../state";
import { CampaignAct } from "../../types";

const ActSection: FC<{ act: CampaignAct; checked: Record<string, boolean> }> = ({
  act,
  checked,
}) => {
  const [open, setOpen] = useState(false);
  const done = act.steps.filter((s) => checked[s.id]).length;

  return (
    <>
      <PanelSectionRow>
        <Field
          label={act.name}
          icon={open ? <FaChevronDown /> : <FaChevronRight />}
          onActivate={() => setOpen((o) => !o)}
          onClick={() => setOpen((o) => !o)}
          bottomSeparator={open ? "none" : "standard"}
        >
          {done}/{act.steps.length}
        </Field>
      </PanelSectionRow>
      {open &&
        act.steps.map((step) => (
          <PanelSectionRow key={step.id}>
            <ToggleField
              label={step.label}
              description={step.reward}
              checked={!!checked[step.id]}
              onChange={() => toggleCampaignStep(step.id)}
            />
          </PanelSectionRow>
        ))}
    </>
  );
};

export const CampaignTab: FC = () => {
  const { campaign } = useStore();

  if (!campaign) {
    return (
      <PanelSection title="Campaign">
        <PanelSectionRow>
          <Field label="Loading campaign…" focusable={false} />
        </PanelSectionRow>
      </PanelSection>
    );
  }

  const checked = campaign.checkedSteps ?? {};
  const totalSteps = campaign.acts.reduce((n, a) => n + a.steps.length, 0);
  const totalDone = campaign.acts.reduce(
    (n, a) => n + a.steps.filter((s) => checked[s.id]).length,
    0,
  );

  return (
    <PanelSection title={`Campaign — ${totalDone}/${totalSteps}`}>
      {campaign.note && (
        <PanelSectionRow>
          <Field focusable={false} bottomSeparator="standard">
            <span style={{ fontSize: "13px", opacity: 0.8 }}>{campaign.note}</span>
          </Field>
        </PanelSectionRow>
      )}
      {campaign.acts.map((act) => (
        <ActSection key={act.id} act={act} checked={checked} />
      ))}
    </PanelSection>
  );
};
