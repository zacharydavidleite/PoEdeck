import { toaster } from "@decky/api";

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
