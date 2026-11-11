#!/usr/bin/env bash
# Obre l'emissora al navegador. Cal servir-la per HTTP (localhost) perquè funcionin el micròfon i el mode fora de línia.
# Prefereix Chrome/Chromium: tenen veus de síntesi i reconeixement de veu. Firefox a Linux sovint no té cap veu.
set -euo pipefail
cd -- "$(dirname -- "${BASH_SOURCE[0]}")"
port=8090
while (echo >/dev/tcp/127.0.0.1/$port) 2>/dev/null; do port=$((port+1)); done
url="http://localhost:$port/"
open_browser(){
 if flatpak info com.google.Chrome >/dev/null 2>&1; then flatpak run com.google.Chrome --new-window "$url"
 elif command -v google-chrome >/dev/null; then google-chrome --new-window "$url"
 elif flatpak info org.chromium.Chromium >/dev/null 2>&1; then flatpak run org.chromium.Chromium --new-window "$url"
 elif command -v chromium >/dev/null; then chromium --new-window "$url"
 else echo "No he trobat Chrome: s'obre el navegador per defecte (potser sense veus)."; xdg-open "$url"
 fi
}
echo "Emissora VHF a $url  (Ctrl+C per aturar)"
(sleep 1; open_browser >/dev/null 2>&1 || true) &
exec python3 -m http.server "$port" --bind 127.0.0.1
