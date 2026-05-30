import { Focusable, ScrollPanel } from "@decky/ui";
import { FC, useEffect, useState } from "react";

import { loadAll, useStore } from "../state";
import { TabBar, TabDef } from "./TabBar";
import { CampaignTab } from "./tabs/CampaignTab";
import { ChecklistTab } from "./tabs/ChecklistTab";
import { MyBuildTab } from "./tabs/MyBuildTab";
import { SettingsTab } from "./tabs/SettingsTab";
import { ToolsTab } from "./tabs/ToolsTab";

const TABS: TabDef[] = [
  { key: "build", label: "My Build" },
  { key: "campaign", label: "Campaign" },
  { key: "checklist", label: "Checklist" },
  { key: "tools", label: "Tools" },
  { key: "settings", label: "Settings" },
];

export const FullPage: FC = () => {
  const { loaded } = useStore();
  const [active, setActive] = useState("build");

  useEffect(() => {
    loadAll();
  }, []);

  return (
    <div
      style={{
        height: "100%",
        background: "#0c0d11",
        color: "#e6e8ec",
        padding: "24px 32px",
        boxSizing: "border-box",
      }}
    >
      <h1 style={{ margin: "0 0 16px", fontSize: "28px", fontWeight: 700 }}>
        Exile Guide
      </h1>

      <TabBar tabs={TABS} active={active} onChange={setActive} />

      {!loaded ? (
        <div style={{ fontSize: "18px", opacity: 0.8 }}>Loading…</div>
      ) : (
        <div style={{ height: "calc(100% - 110px)", paddingRight: "8px" }}>
          <ScrollPanel>
            <Focusable style={{ display: "flex", flexDirection: "column" }}>
              {active === "build" && <MyBuildTab />}
              {active === "campaign" && <CampaignTab />}
              {active === "checklist" && <ChecklistTab />}
              {active === "tools" && <ToolsTab />}
              {active === "settings" && <SettingsTab />}
            </Focusable>
          </ScrollPanel>
        </div>
      )}
    </div>
  );
};
