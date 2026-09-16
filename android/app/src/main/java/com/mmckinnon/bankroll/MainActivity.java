package com.mmckinnon.bankroll;

import android.content.SharedPreferences;
import android.os.Bundle;
import android.webkit.WebView;

import androidx.appcompat.app.AlertDialog;
import androidx.webkit.WebSettingsCompat;
import androidx.webkit.WebViewFeature;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.CapConfig;
import com.getcapacitor.WebViewListener;

public class MainActivity extends BridgeActivity {
    public static final String PREFS_NAME = "BankrollServerConfig";
    public static final String SERVER_URL_PREF_KEY = "server_url";

    // Tracks the current navigation attempt, so a sub-resource hiccup on an
    // already-loaded page doesn't pop the "can't reach server" dialog — only
    // a genuine failure of the main navigation does. Reset per attempt via
    // onPageStarted/onPageLoaded below.
    private boolean pageLoadedSuccessfully = false;
    private boolean errorDialogShown = false;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(ServerConfigPlugin.class);

        // If a server URL was saved (via the onboarding page in
        // capacitor-www/), rebuild the config to point the bridge there
        // instead of the bundled local content. Falls back to bundled
        // content (the onboarding page) when nothing is saved yet — see
        // Bridge.Builder.setConfig(): a null config loads CapConfig.loadDefault().
        SharedPreferences prefs = getSharedPreferences(PREFS_NAME, MODE_PRIVATE);
        String savedUrl = prefs.getString(SERVER_URL_PREF_KEY, null);
        if (savedUrl != null) {
            config = new CapConfig.Builder(this).setServerUrl(savedUrl).create();
        }

        super.onCreate(savedInstanceState);

        // The app theme (styles.xml) follows the system day/night setting, but
        // Android's WebView does not automatically darken page content based on
        // prefers-color-scheme unless explicitly enabled here.
        WebView webView = getBridge().getWebView();
        if (WebViewFeature.isFeatureSupported(WebViewFeature.ALGORITHMIC_DARKENING)) {
            WebSettingsCompat.setAlgorithmicDarkeningAllowed(webView.getSettings(), true);
        }

        // Only relevant once a real server URL is configured — the bundled
        // onboarding page can't itself fail to load. Native dialog rather
        // than Capacitor's errorPath: verified live that Capacitor plugins
        // (and so our ServerConfig calls) are NOT available on an errorPath
        // page, despite the local-server code path looking identical to any
        // other bundled page — so a JS-driven "change server" button there
        // would silently do nothing.
        if (savedUrl != null) {
            getBridge()
                .addWebViewListener(
                    new WebViewListener() {
                        @Override
                        public void onPageStarted(WebView webView) {
                            pageLoadedSuccessfully = false;
                        }

                        @Override
                        public void onPageLoaded(WebView webView) {
                            pageLoadedSuccessfully = true;
                        }

                        @Override
                        public void onReceivedError(WebView webView) {
                            maybeShowConnectionError();
                        }

                        @Override
                        public void onReceivedHttpError(WebView webView) {
                            maybeShowConnectionError();
                        }
                    }
                );
        }
    }

    private void maybeShowConnectionError() {
        if (pageLoadedSuccessfully || errorDialogShown) return;
        errorDialogShown = true;

        runOnUiThread(() -> {
            new AlertDialog.Builder(MainActivity.this)
                .setTitle("Can't reach your server")
                .setMessage("The Bankroll server you connected to isn't responding right now.")
                .setCancelable(false)
                .setPositiveButton("Try Again", (dialog, which) -> recreate())
                .setNegativeButton("Change Server", (dialog, which) -> {
                    getSharedPreferences(PREFS_NAME, MODE_PRIVATE).edit().remove(SERVER_URL_PREF_KEY).apply();
                    recreate();
                })
                .show();
        });
    }
}
