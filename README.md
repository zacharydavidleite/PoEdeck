# Exile Guide

A [Decky Loader](https://decky.xyz/) plugin that turns the Steam Deck Quick
Access Menu into a **Path of Exile 2** companion. Track the build guide you're
following, work through a campaign permanent-rewards checklist, keep a personal
to-do checklist, and glance at quick in-game reminders — all without leaving the
game.

> **v0.1 scope.** Exile Guide does not scrape Mobalytics, read game memory,
> inject into Path of Exile 2, or automate gameplay, and it never requests root.
> You paste your guide URL and enter build notes manually; everything is stored
> locally as JSON in the plugin's data folder.

## Features

- **Open your guide in Steam's browser** — one button (and an optional
  controller shortcut) opens your saved Mobalytics URL in Steam's built-in
  browser overlay, so it works even while Path of Exile 2 is running. This uses
  Steam's real, controller-navigable browser (`NavigateToExternalWeb`), not an
  embedded iframe.
- **Controller shortcut** — bind a button or back-paddle combo (default
  **L4 + R4**) to pop the guide open in the browser from anywhere, including
  in-game.
- **Hybrid UI** — a compact panel lives in the Quick Access Menu (active build
  summary, quick reminders, open/copy guide URL) plus an **Open Exile Guide**
  button for the full-screen, 5-tab page.
- **My Build** — the active build profile with editable sections for skill gems,
  passive priorities, gear priorities, boss notes, and custom notes, plus
  open-in-browser and copy buttons for the guide URL.
- **Campaign** — an act-by-act collapsible checklist of PoE 2's permanent
  campaign rewards (passive points, spirit, resistances, life/mana, choice
  nodes). Check off rewards as you collect them; progress is saved.
- **Checklist** — your own list of items you can add, complete, and delete.
- **Tools** — resistance and attribute reminders, free-text loot filter notes,
  and open/copy links for your saved guide URL.
- **Settings** — guide URL, build name, class dropdown, ascendancy, the
  controller shortcut, and save.
- Controller-focusable controls, large readable text, and dark Deck-native
  styling throughout.

## Project layout

```
plugin.json          Decky plugin manifest
main.py              Python backend (settings + local JSON storage)
defaults/guides/     Bundled PoE 2 campaign template (poe2-campaign-base.json)
src/                 TypeScript React frontend
  index.tsx          definePlugin entry; registers the full-page route
  api.ts             Typed callable() wrappers for backend methods
  state.ts           Shared module-level store (QAM panel + full page)
  types.ts           Shared types
  components/        QAM panel, full page, tab bar, and the five tabs
```

### Backend methods (`main.py`)

`get_settings`, `set_settings`, `get_profiles`, `save_profile`,
`delete_profile`, `get_campaign_guide`, `save_campaign_progress`, plus
`get_checklist` / `save_checklist` for the Checklist tab. All user data is
written under `DECKY_PLUGIN_SETTINGS_DIR`:

| File                     | Contents                                   |
| ------------------------ | ------------------------------------------ |
| `settings.json`          | guide URL, active profile id, loot notes   |
| `profiles.json`          | saved build profiles                       |
| `campaign_progress.json` | checked campaign reward step ids           |
| `checklist.json`         | user checklist items                       |

## Requirements

- [Node.js](https://nodejs.org/) 18+ and [pnpm](https://pnpm.io/)
  (`npm i -g pnpm`).
- A Steam Deck (or dev VM) with [Decky Loader](https://decky.xyz/) installed for
  testing.

## Build

```bash
pnpm install
pnpm run build      # outputs dist/index.js
```

## Development

```bash
pnpm run watch      # rebuild on change
```

The build produces `dist/index.js`. A deployable plugin folder consists of:

```
plugin.json
package.json
main.py
dist/index.js
defaults/
LICENSE
README.md
```

### Installing on a Steam Deck

1. Build the plugin (`pnpm run build`).
2. Copy the project folder to the Deck at
   `~/homebrew/plugins/Exile Guide` (the folder name should match the plugin
   `name`). For example, over SSH:
   ```bash
   rsync -av --exclude node_modules --exclude .git ./ deck@<deck-ip>:~/homebrew/plugins/Exile\ Guide/
   ```
3. In Decky's developer settings you can also use **Remote CEF debugging** to
   load it. Restart Decky Loader (or reboot) so it picks up the plugin.
4. Open the Quick Access Menu (••• button) → Decky → **Exile Guide**
   (the book icon).

## User flow

1. Open **Exile Guide** in the Quick Access Menu, then press **Open Exile
   Guide** to bring up the full page.
2. Go to **Settings**, paste your Mobalytics guide URL, name your build, pick a
   class, type your ascendancy, and **Save build**. Optionally enable the
   **controller shortcut** and pick a button/combo.
3. Press **Open guide in browser** (in the QAM panel, My Build, or Tools) — or
   your controller shortcut — to open the guide in Steam's browser overlay,
   even while in-game.
4. In **My Build**, fill in skill gems, passive/gear priorities, boss notes, and
   custom notes from your guide; **Save notes**.
5. While leveling, open the **Campaign** tab and check off each permanent reward
   as you collect it.
6. Use **Checklist** for personal reminders and **Tools** for resistance and
   attribute checks. The QAM panel keeps your build summary and reminders one
   button-press away.

## Notes on data accuracy

The bundled campaign rewards reflect Path of Exile 2 patch **0.5**. If Grinding
Gear Games changes campaign rewards in a later patch, edit
`defaults/guides/poe2-campaign-base.json` — the structure is plain JSON
(`acts[].steps[]` with `label`, `reward`, and `type`).

## License

BSD-3-Clause. See [LICENSE](./LICENSE).
