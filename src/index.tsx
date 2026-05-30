import { definePlugin, routerHook } from "@decky/api";
import { staticClasses } from "@decky/ui";
import { FaBook } from "react-icons/fa";

import { FullPage } from "./components/FullPage";
import { QamPanel } from "./components/QamPanel";
import { EXILE_GUIDE_ROUTE } from "./routes";
import { loadAll } from "./state";

export default definePlugin(() => {
  // Warm the cache so the QAM panel renders instantly.
  loadAll();

  routerHook.addRoute(EXILE_GUIDE_ROUTE, () => <FullPage />, {
    exact: true,
  });

  return {
    name: "Exile Guide",
    titleView: <div className={staticClasses.Title}>Exile Guide</div>,
    content: <QamPanel />,
    icon: <FaBook />,
    onDismount() {
      routerHook.removeRoute(EXILE_GUIDE_ROUTE);
    },
  };
});
