"use client";

import { useSyncExternalStore } from "react";

// Thin, optional integration with the native Android shell. The web app
// never imports @capacitor/core — it works standalone in any browser, and
// this just detects the bridge when the native shell happens to inject it,
// so native-only UI (like changing the connected server) can be hidden
// everywhere else.
type CapacitorGlobal = {
  isNativePlatform?: () => boolean;
  Plugins?: {
    ServerConfig?: {
      clear: () => Promise<void>;
    };
  };
};

// window isn't available during the server-rendered pass of a "use client"
// component, so these are read via useSyncExternalStore rather than
// setState-in-an-effect — the correct way to bridge a browser-only value
// into a component that's also rendered once on the server.
function noopSubscribe() {
  return () => {};
}

export function getCapacitor(): CapacitorGlobal | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as unknown as { Capacitor?: CapacitorGlobal }).Capacitor;
}

function getIsNativeSnapshot(): boolean {
  return !!getCapacitor()?.isNativePlatform?.();
}

function getIsNativeServerSnapshot(): boolean {
  return false;
}

export function useIsNativeApp(): boolean {
  return useSyncExternalStore(noopSubscribe, getIsNativeSnapshot, getIsNativeServerSnapshot);
}

function getOriginSnapshot(): string {
  return window.location.origin;
}

function getOriginServerSnapshot(): string {
  return "";
}

export function useOrigin(): string {
  return useSyncExternalStore(noopSubscribe, getOriginSnapshot, getOriginServerSnapshot);
}
