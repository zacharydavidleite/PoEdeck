import { definePlugin, routerHook } from "@decky/api";
import { staticClasses } from "@decky/ui";
import { FaBook } from "react-icons/fa";

import { FullPage } from "./components/FullPage";
import { QamPanel } from "./components/QamPanel";
import { setupHotkey, teardownHotkey } from "./hotkey";
import { EXILE_GUIDE_ROUTE } from "./routes";
import { loadAll } from "./state";

export default definePlugin(() => {
  // Warm the cache so the QAM panel renders instantly, then arm the
  // controller shortcut once settings have loaded.
  loadAll().then(setupHotkey);

  routerHook.addRoute(EXILE_GUIDE_ROUTE, () => <FullPage />, {
    exact: true,
  });

  return {
    name: "Exile Guide",
    titleView: <div className={staticClasses.Title}>Exile Guide</div>,
    content: <QamPanel />,
    icon: <FaBook />,
    onDismount() {
      teardownHotkey();
      routerHook.removeRoute(EXILE_GUIDE_ROUTE);
    },
  };
});
