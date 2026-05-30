import { toaster } from "@decky/api";
import { Navigation } from "@decky/ui";

export async function copyToClipboard(text: string, label = "Copied") {
  if (!text) {
    toaster.toast({ title: "Exile Guide", body: "Nothing to copy" });
    return;
  }
  try {
    await navigator.clipboard.writeText(text);
    toaster.toast({ title: "Exile Guide", body: `${label} to clipboard` });
  } catch {
    toaster.toast({ title: "Exile Guide", body: "Clipboard unavailable" });
  }
}

// Opens the guide URL in Steam's built-in browser overlay (works in-game).
// Not an iframe — this is Steam's real, controller-navigable browser.
export function openGuideInBrowser(url: string) {
  if (!url) {
    toaster.toast({
      title: "Exile Guide",
      body: "Set your Mobalytics guide URL in Settings first",
    });
    return;
  }
  try {
    Navigation.NavigateToExternalWeb(url);
    Navigation.CloseSideMenus();
  } catch (err) {
    console.error("[Exile Guide] failed to open browser", err);
    toaster.toast({ title: "Exile Guide", body: "Could not open the browser" });
  }
}

