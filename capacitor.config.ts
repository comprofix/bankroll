import type { CapacitorConfig } from "@capacitor/cli";

// This app is server-rendered (Server Actions, auth cookies, live DB access),
// so there's nothing to statically bundle — the native shell just navigates
// to the live URL below. webDir is required by the CapacitorConfig type but
// unused in this mode.
//
// Points at the real production deployment over HTTPS. No cleartext flag —
// that was only needed for local emulator testing against 10.0.2.2 (plain
// HTTP), and Android's default cleartext block is exactly what we want here.
const config: CapacitorConfig = {
  appId: "com.mmckinnon.bankroll",
  appName: "Bankroll",
  webDir: "public",
  server: {
    url: "https://bankroll.comprofix.com",
  },
};

export default config;
