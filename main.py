import json
import os
import uuid

import decky


class Plugin:
    """Exile Guide backend.

    Persists user data as JSON files under the plugin settings directory and
    serves the bundled campaign template from the plugin's defaults folder.
    No root, no game-memory access, no injection, no automation.
    """

    # ---- File locations -------------------------------------------------

    def _settings_dir(self) -> str:
        path = decky.DECKY_PLUGIN_SETTINGS_DIR
        os.makedirs(path, exist_ok=True)
        return path

    def _file(self, name: str) -> str:
        return os.path.join(self._settings_dir(), name)

    # ---- Generic JSON helpers ------------------------------------------

    def _read_json(self, path: str, default):
        try:
            with open(path, "r", encoding="utf-8") as fh:
                return json.load(fh)
        except FileNotFoundError:
            return default
        except (json.JSONDecodeError, OSError) as exc:
            decky.logger.error(f"Failed reading {path}: {exc}")
            return default

    def _write_json(self, path: str, data) -> None:
        tmp = f"{path}.tmp"
        with open(tmp, "w", encoding="utf-8") as fh:
            json.dump(data, fh, indent=2)
        os.replace(tmp, path)

    # ---- Settings -------------------------------------------------------

    async def get_settings(self) -> dict:
        defaults = {
            "guideUrl": "",
            "activeProfileId": "",
            "lootFilterNotes": "",
            "shortcutEnabled": False,
            "shortcutCombo": "l4_r4",
        }
        stored = self._read_json(self._file("settings.json"), {})
        defaults.update(stored)
        return defaults

    async def set_settings(self, settings: dict) -> dict:
        current = await self.get_settings()
        current.update(settings or {})
        self._write_json(self._file("settings.json"), current)
        return current

    # ---- Build profiles -------------------------------------------------

    async def get_profiles(self) -> list:
        data = self._read_json(self._file("profiles.json"), {"profiles": []})
        return data.get("profiles", [])

    async def save_profile(self, profile: dict) -> dict:
        profiles = await self.get_profiles()
        if not profile.get("id"):
            profile["id"] = str(uuid.uuid4())

        replaced = False
        for index, existing in enumerate(profiles):
            if existing.get("id") == profile["id"]:
                profiles[index] = profile
                replaced = True
                break
        if not replaced:
            profiles.append(profile)

        self._write_json(self._file("profiles.json"), {"profiles": profiles})
        return profile

    async def delete_profile(self, profile_id: str) -> bool:
        profiles = await self.get_profiles()
        remaining = [p for p in profiles if p.get("id") != profile_id]
        self._write_json(self._file("profiles.json"), {"profiles": remaining})

        settings = await self.get_settings()
        if settings.get("activeProfileId") == profile_id:
            settings["activeProfileId"] = remaining[0]["id"] if remaining else ""
            self._write_json(self._file("settings.json"), settings)

        return len(remaining) != len(profiles)

    # ---- Campaign -------------------------------------------------------

    def _campaign_template_path(self) -> str:
        return os.path.join(
            decky.DECKY_PLUGIN_DIR, "defaults", "guides", "poe2-campaign-base.json"
        )

    async def get_campaign_guide(self) -> dict:
        guide = self._read_json(self._campaign_template_path(), {"acts": []})
        progress = self._read_json(
            self._file("campaign_progress.json"), {"checkedSteps": {}}
        )
        guide["checkedSteps"] = progress.get("checkedSteps", {})
        return guide

    async def save_campaign_progress(self, progress: dict) -> dict:
        payload = {"checkedSteps": (progress or {}).get("checkedSteps", {})}
        self._write_json(self._file("campaign_progress.json"), payload)
        return payload

    # ---- User checklist -------------------------------------------------

    async def get_checklist(self) -> list:
        data = self._read_json(self._file("checklist.json"), {"items": []})
        return data.get("items", [])

    async def save_checklist(self, items: list) -> list:
        self._write_json(self._file("checklist.json"), {"items": items or []})
        return items or []

    # ---- Lifecycle ------------------------------------------------------

    async def _main(self):
        self._settings_dir()
        decky.logger.info("Exile Guide loaded.")

    async def _unload(self):
        decky.logger.info("Exile Guide unloading.")

    async def _uninstall(self):
        decky.logger.info("Exile Guide uninstalling.")

    async def _migration(self):
        # Pull any settings left behind by older versions into the settings dir.
        decky.migrate_settings(
            os.path.join(decky.DECKY_HOME, "settings", "exile-guide.json")
        )
