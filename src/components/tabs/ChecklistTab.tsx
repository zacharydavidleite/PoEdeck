import {
  ButtonItem,
  Field,
  PanelSection,
  PanelSectionRow,
  TextField,
} from "@decky/ui";
import { FC, useState } from "react";
import { FaCheckCircle, FaRegCircle } from "react-icons/fa";

import { setChecklist, useStore } from "../../state";
import { ChecklistItem } from "../../types";

export const ChecklistTab: FC = () => {
  const { checklist } = useStore();
  const [text, setText] = useState("");

  const add = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const item: ChecklistItem = {
      id:
        (globalThis.crypto?.randomUUID?.() as string) ??
        `${Date.now()}-${Math.random()}`,
      text: trimmed,
      done: false,
    };
    await setChecklist([...checklist, item]);
    setText("");
  };

  const toggle = (id: string) =>
    setChecklist(
      checklist.map((i) => (i.id === id ? { ...i, done: !i.done } : i)),
    );

  const remove = (id: string) =>
    setChecklist(checklist.filter((i) => i.id !== id));

  return (
    <PanelSection title="Checklist">
      <PanelSectionRow>
        <TextField
          label="New item"
          value={text}
          onChange={(e) => setText(e.currentTarget.value)}
        />
      </PanelSectionRow>
      <PanelSectionRow>
        <ButtonItem layout="below" onClick={add} disabled={!text.trim()}>
          Add item
        </ButtonItem>
      </PanelSectionRow>

      {checklist.length === 0 && (
        <PanelSectionRow>
          <Field focusable={false}>No items yet.</Field>
        </PanelSectionRow>
      )}

      {checklist.map((item) => (
        <PanelSectionRow key={item.id}>
          <Field
            label={item.text}
            icon={item.done ? <FaCheckCircle color="#5ad15a" /> : <FaRegCircle />}
            onActivate={() => toggle(item.id)}
            onClick={() => toggle(item.id)}
            onOKActionDescription={item.done ? "Mark undone" : "Mark done"}
            onSecondaryButton={() => remove(item.id)}
            onSecondaryActionDescription="Delete"
          >
            <span
              style={{
                textDecoration: item.done ? "line-through" : "none",
                opacity: item.done ? 0.6 : 1,
              }}
            >
              {item.done ? "Done" : "Open"}
            </span>
          </Field>
        </PanelSectionRow>
      ))}
    </PanelSection>
  );
};
