import { Focusable } from "@decky/ui";
import { FC } from "react";

export interface TabDef {
  key: string;
  label: string;
}

interface TabBarProps {
  tabs: TabDef[];
  active: string;
  onChange: (key: string) => void;
}

export const TabBar: FC<TabBarProps> = ({ tabs, active, onChange }) => {
  return (
    <Focusable
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "6px",
        marginBottom: "12px",
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.key === active;
        return (
          <Focusable
            key={tab.key}
            onActivate={() => onChange(tab.key)}
            onOKButton={() => onChange(tab.key)}
            style={{
              flex: "1 1 auto",
              minWidth: "90px",
              padding: "10px 12px",
              textAlign: "center",
              fontSize: "16px",
              fontWeight: isActive ? 700 : 500,
              borderRadius: "4px",
              color: isActive ? "#ffffff" : "#c0c4cc",
              background: isActive
                ? "rgba(26, 159, 255, 0.85)"
                : "rgba(255, 255, 255, 0.08)",
              boxShadow: isActive
                ? "0 0 0 2px rgba(26, 159, 255, 0.5)"
                : "none",
              cursor: "pointer",
            }}
          >
            {tab.label}
          </Focusable>
        );
      })}
    </Focusable>
  );
};
