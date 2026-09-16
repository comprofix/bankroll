import type { CapacitorConfig } from "@capacitor/cli";

// No fixed server.url — this is a generic client, not tied to one
// deployment. On first launch it loads the bundled onboarding page
// (capacitor-www/index.html), which asks for a server URL, hands it to the
// native ServerConfigPlugin, and MainActivity rebuilds the bridge's
// CapConfig around it before the WebView initializes (see MainActivity.java
// and ServerConfigPlugin.java). On later launches, the saved URL is read
// the same way and the bundled page is skipped entirely.
const config: CapacitorConfig = {
  appId: "com.mmckinnon.bankroll",
  appName: "Bankroll",
  webDir: "capacitor-www",
};

export default config;
