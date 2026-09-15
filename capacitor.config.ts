import type { CapacitorConfig } from "@capacitor/cli";

// This app is server-rendered (Server Actions, auth cookies, live DB access),
// so there's nothing to statically bundle — the native shell just navigates
// to the live URL below. webDir is required by the CapacitorConfig type but
// unused in this mode.
//
// 10.0.2.2 is the Android emulator's fixed alias for the host machine's
// localhost. cleartext:true is required because Android blocks plain HTTP
// by default — this is fine for local emulator testing against Docker, but
// must NOT ship in a real release build pointed at a deployed HTTPS site.
const config: CapacitorConfig = {
  appId: "com.mmckinnon.bankroll",
  appName: "Bankroll",
  webDir: "public",
  server: {
    url: "http://10.0.2.2:3000",
    cleartext: true,
  },
};

export default config;
