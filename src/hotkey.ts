import { Navigation } from "@decky/ui";

import { EXILE_GUIDE_ROUTE } from "./routes";
import { getSettingsSnapshot } from "./state";
import { SHORTCUT_OPTIONS } from "./types";

// Global controller-button shortcut.
//
// Decky has no keybinding API, so we listen to the Steam client's raw
// controller input (fires even while a game is focused) via
// SteamClient.Input.RegisterForControllerInputMessages. The callback fires
// continuously while a button is held, so we track pressed buttons and only
// act on the rising edge of the configured combo.

interface Unregisterable {
  unregister: () => void;
}

let registration: Unregisterable | null = null;
const pressed = new Set<number>();
let triggered = false;

function activeCombo(): number[] {
  const { shortcutEnabled, shortcutCombo } = getSettingsSnapshot();
  if (!shortcutEnabled) return [];
  return SHORTCUT_OPTIONS.find((o) => o.key === shortcutCombo)?.buttons ?? [];
}

function openGuide() {
  try {
    Navigation.Navigate(EXILE_GUIDE_ROUTE);
    Navigation.CloseSideMenus?.();
  } catch (err) {
    console.error("[Exile Guide] failed to open via shortcut", err);
  }
}

export function setupHotkey(): void {
  const input = (window as unknown as { SteamClient?: any }).SteamClient?.Input;
  if (!input?.RegisterForControllerInputMessages) {
    console.warn("[Exile Guide] SteamClient.Input unavailable; shortcut disabled");
    return;
  }

  registration = input.RegisterForControllerInputMessages(
    (_controllerIndex: number, button: number, isPressed: boolean) => {
      if (isPressed) pressed.add(button);
      else pressed.delete(button);

      const combo = activeCombo();
      if (combo.length === 0) {
        triggered = false;
        return;
      }

      const allDown = combo.every((b) => pressed.has(b));
      if (allDown && !triggered) {
        triggered = true;
        openGuide();
      } else if (!allDown) {
        triggered = false;
      }
    },
  );
}

export function teardownHotkey(): void {
  try {
    registration?.unregister();
  } catch {
    /* ignore */
  }
  registration = null;
  pressed.clear();
  triggered = false;
}
