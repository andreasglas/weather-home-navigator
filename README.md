# weather-home-navigator

Persönliches, mobiloptimiertes Dashboard mit Navigation, Standort-Wetter,
Bitcoin, Heizöl, manuellem Girokontostand und Erinnerungen.
HTML5, CSS3 und Vanilla JavaScript, ohne Frameworks oder Paket-Abhängigkeiten.

## Zuerst: Öffentlichkeit und persönliche Daten

Das Repository wird durch diese Änderungen **nicht automatisch privat**.
Bevor du persönliche Daten in Dateien einträgst oder committest, stelle es unter
**Settings → General → Danger Zone → Change repository visibility → Private** um.
Noch besser: Heimatadresse, Kontostand und API-Schlüssel ausschließlich in der App
eingeben, niemals in Quelltext, Issues oder Commits. Bereits veröffentlichte Daten
bleiben möglicherweise in der Git-Historie oder in Kopien erhalten.

**Privates Repository ≠ private Website:** GitHub Pages ist üblicherweise öffentlich,
auch bei einem privaten Repository (Verfügbarkeit abhängig vom GitHub-Tarif).
Vertrauliche Websites benötigen zugriffsgeschütztes Hosting; ein privates Repository
allein ist keine Zugangskontrolle. Die lokale Nutzung ist ebenfalls möglich.

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

- Die beiden Navigationsbuttons stehen ganz oben. **Zur Arbeit navigieren** führt
  zum FIZ München, Knorrstraße 147, München.
- Öffne **Heimatadresse einrichten / ändern**, gib deine vollständige Heimatadresse
  ein und speichere sie. Aus Datenschutzgründen ist keine private Heimatadresse
  im öffentlichen Quelltext hinterlegt. Die bisher gespeicherte Adresse bleibt erhalten.
- **Nach Hause navigieren** nutzt diese lokal gespeicherte Adresse.
  Beide Links öffnen Google Maps mit angeforderter Auto-Navigation.
  Je nach Gerät öffnet sich die Maps-App oder die Webansicht; Google Maps bestimmt
  den Startpunkt und kann eine Bestätigung verlangen. Die Navigation funktioniert
  auch ohne Standortfreigabe für dieses Dashboard.
- Bitcoin wird in EUR von [CoinGecko](https://docs.coingecko.com/reference/simple-price)
  beim Öffnen und über **Kurse aktualisieren** geladen. Angezeigt wird der
  Datenzeitpunkt des Anbieters; Rate-Limits oder Netzfehler werden sichtbar gemeldet.
- Heizöl: Unter **Heizöl-Datenquelle einrichten** einen eigenen kostenlosen
  [EIA API-Schlüssel](https://www.eia.gov/opendata/register.php) hinterlegen.
  Der Schlüssel ist nicht im Code enthalten und wird aus Sicherheitsgründen
  **nicht in localStorage** gespeichert. Nach jedem Neuladen erneut eingeben;
  er bleibt nur im Arbeitsspeicher der aktuellen Sitzung.
  Ein leeres Feld mit anschließendem Klick auf **Für diese Sitzung verwenden / leeren**
  entfernt ihn aus der Sitzung.
  Verwendet wird die EIA-Reihe `W_EPD2F_PRS_NUS_DPG` über
  `https://api.eia.gov/v2/petroleum/pri/wfr/data/`: **US-Durchschnitt des
  Heizöl-Haushaltspreises in USD pro US-Gallone**, wöchentlich und saisonal
  veröffentlicht. Das Dashboard ruft den neuesten verfügbaren Wert ab und zeigt
  dessen Datum. Dies ist ausdrücklich **kein deutscher Heizöl-Lieferpreis,
  kein Echtzeit-Börsenkurs und kein Rohölpreis**.
  Deutsche Angebote hängen u. a. von Lieferort und Menge ab. Eine verifizierte,
  frei zugängliche deutsche Browser-API ist hier nicht integriert.
  Der Live-Zugriff einschließlich der CORS-Freigabe konnte aus der Entwicklungsumgebung
  nicht verifiziert werden. Falls EIA den Browserzugriff blockiert, erscheint eine
  Fehlermeldung; die App verwendet keinen Drittanbieter-Proxy für deinen Schlüssel.
- Trage deinen **Girokontostand** manuell in EUR ein, z. B. `1250,50` oder `-50.25`
  (ohne Tausendertrennzeichen), und speichere ihn. Er ist jederzeit editierbar und
  bleibt nach einem Neuladen erhalten. Es gibt keine Bank-/Trade-Republic-Anbindung:
  keine Bankzugangsdaten eingeben.
- Das Wetter wird beim Öffnen automatisch geladen; **Aktualisieren** fragt es erneut ab.
- Angezeigt werden Temperatur, Wetterbeschreibung und Symbol, Luftfeuchtigkeit
  sowie Windgeschwindigkeit in km/h. Quelle: [Open-Meteo](https://open-meteo.com/).
- Bei verweigertem Standortzugriff helfen die Safari-/Website-Einstellungen.

## Erinnerungen und Safari auf dem iPhone 14

Nachricht und zukünftige lokale Uhrzeit wählen, **Erinnerung speichern** drücken.
Es gibt jeweils eine einmalige Erinnerung; erneutes Speichern ersetzt sie.
**Erinnerung löschen** entfernt sie. Beim Termin erscheint eine Meldung im Dashboard,
auch ohne Benachrichtigungserlaubnis. Eine überfällige gespeicherte Erinnerung wird
beim nächsten Öffnen bzw. Zurückkehren nachgeholt.

**Browser-Benachrichtigungen erlauben** fragt die Erlaubnis ausschließlich nach
einem Klick ab. Unterstützte Desktop-Browser können zusätzlich eine Systemmeldung
anzeigen. Das Dashboard muss geöffnet bleiben; bei geschlossener Seite, gesperrtem
Gerät oder pausierten Tabs laufen keine zuverlässigen Timer.

Safari auf dem iPhone unterstützt diese einfachen `Notification`-Meldungen nicht
wie Desktop-Browser. iOS-Hintergrund-Push benötigt eine installierte Web-App,
Service Worker und Push-Infrastruktur; dies ist bewusst nicht Teil dieser
backendfreien App. Auf dem iPhone bleiben Erinnerungen **In-App**, keine garantierten
Wecker. Für zuverlässige Hintergrundalarme die iOS-Erinnerungen-App verwenden.

Das helle Kartenlayout berücksichtigt Safe Areas, große Touch-Ziele und mindestens
16 px große Eingabefelder gegen Safari-Autozoom. Es passt in die 390 px breite
iPhone-14-Ansicht. Safari auf echter Hardware wurde nicht automatisiert getestet.

## Datenschutz

Heimatadresse, Kontostand und Erinnerung werden ausschließlich
und **unverschlüsselt** im `localStorage` dieses Browsers gespeichert. Kein Upload
dieser Daten an ein eigenes Backend, keine Synchronisation zwischen Geräten.
Andere Nutzer desselben Browserprofils sowie andere Seiten derselben Origin können
diesen Speicher einsehen. Insbesondere teilen GitHub-Pages-Projekte unter derselben
Domain eine Origin. Nutze ein vertrauenswürdiges eigenes Gerät und ggf. eine getrennte
Domain. Gelöschte Website-Daten löschen die gespeicherten Werte; bei gesperrtem Speicher
gelten Änderungen nur für die Sitzung. Private Browserfenster speichern nicht dauerhaft.

Externe Dienste erhalten technisch bedingt die IP-Adresse:

- Open-Meteo erhält für Wetter die aktuellen GPS-Koordinaten; diese werden nicht gespeichert.
- CoinGecko erhält nur die Bitcoin-Kursabfrage, keinen Kontostand.
- EIA erhält die Heizölabfrage mit dem dafür vorgesehenen persönlichen API-Schlüssel.
- Erst beim Navigieren erhält Google Maps die jeweilige Zieladresse.

Es gibt kein Tracking, keine externen Schriften und keine Bankanmeldung.
Der lokale Kontostand wird von keinem API-Aufruf verwendet. Das Teilen der URL
teilt nicht die im eigenen Browser gespeicherten Daten.
