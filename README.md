# weather-home-navigator

Responsive Web-App mit aktuellem Standort-Wetter und Google-Maps-Navigation nach Hause.
HTML5, CSS3 und Vanilla JavaScript, ohne Frameworks, API-Schlüssel oder Paket-Abhängigkeiten.

## Lokal starten

Im Projektverzeichnis mit Python 3:

```sh
python3 -m http.server 8000
```

Öffne anschließend <http://localhost:8000> und erlaube den Standortzugriff.
Optional mit installiertem Node.js/npm: `npm start` startet denselben Server,
`npm run check` prüft die JavaScript-Syntax. Ein Build oder `npm install` ist nicht nötig.

## Auf dem iPhone verwenden

Für dieses Repository muss GitHub Pages einmalig in den Repository-Einstellungen
aktiviert werden; ein Merge allein aktiviert Pages nicht:

1. Öffne <https://github.com/andreasglas/weather-home-navigator/settings/pages>
   in Safari (nicht in der GitHub-App) und melde dich mit einem Konto mit
   Administratorrechten für das Repository an.
2. Wähle unter **Build and deployment → Source** die Option **Deploy from a branch**.
3. Wähle den Branch **main** und den Ordner **/ (root)** und klicke auf **Save**.

Nach dem Merge dieser Änderungen in `main` und erfolgreicher Pages-Veröffentlichung
ist die App unter <https://andreasglas.github.io/weather-home-navigator/> erreichbar.
Die Veröffentlichung kann einige Minuten dauern; ihren Status siehst du unter
**Actions** im Repository. Die Datei `.nojekyll` im Repository-Stamm deaktiviert
die Jekyll-Verarbeitung, sodass die statischen Dateien direkt veröffentlicht werden.

Öffne die Pages-Adresse in Safari und erlaube den Standortzugriff.
Die Raw-Dateiansicht auf GitHub zeigt nur Quelltext und startet die App nicht.
Über **Teilen → Zum Home-Bildschirm** kannst du einen Schnellzugriff hinzufügen.

Die Standortabfrage funktioniert nur über **HTTPS** oder auf **localhost**.
Eine unverschlüsselte LAN-Adresse wie `http://192.168.…:8000` genügt auf dem
iPhone nicht. Die App benötigt Internetzugriff und ist keine native iOS-/Offline-App.

## Bedienung

- Das Wetter wird beim Öffnen automatisch geladen; **Aktualisieren** fragt es erneut ab.
- Angezeigt werden Temperatur, Wetterbeschreibung und Symbol, Luftfeuchtigkeit
  sowie Windgeschwindigkeit in km/h. Quelle: [Open-Meteo](https://open-meteo.com/).
- Gib die vollständige Heimatadresse ein und tippe auf **Adresse speichern**.
  Die Adresse kann jederzeit im selben Feld geändert und erneut gespeichert werden.
- **Nach Hause navigieren** öffnet Google Maps mit der gespeicherten Zieladresse
  und angeforderter Auto-Navigation. Je nach Gerät öffnet sich die Maps-App oder
  die Webansicht; Google Maps bestimmt den Startpunkt und kann eine Bestätigung verlangen.
- Bei verweigertem Standortzugriff helfen die Safari-/Website-Einstellungen.
  Die Navigation funktioniert auch ohne Standortfreigabe für diese App.

## Datenschutz

Die Heimatadresse wird ausschließlich und **unverschlüsselt** im `localStorage`
dieses Browsers gespeichert und erst beim Navigieren an Google Maps übergeben.
Andere Nutzer desselben Browserprofils können die Adresse einsehen; verwende die
Speicherfunktion daher nur auf deinem eigenen Gerät. Gelöschte Website-Daten löschen
auch die Adresse. Ist der Speicher gesperrt, kann die Adresse für die aktuelle Sitzung
verwendet werden, bleibt aber nach dem Neuladen nicht erhalten.

Für die Wetterabfrage werden die Standortkoordinaten an Open-Meteo gesendet.
Es gibt kein eigenes Backend und kein Tracking.
