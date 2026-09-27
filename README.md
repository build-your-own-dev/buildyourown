# Build Your Own – statische Website (GitHub Pages)

1. Inhalt dieses Ordners in ein GitHub-Repo pushen (Root oder /docs).
2. Settings → Pages → Source: Branch (z. B. main), Ordner / (root).
3. Fertig – die Seite läuft unter https://<user>.github.io/<repo>/

Hinweise:
- Routing läuft über Hash-URLs (…/#/preise), damit es auf jedem Pages-Pfad ohne Server funktioniert.
- 404.html und .nojekyll sind bereits enthalten.
- Für eine eigene Domain: Datei CNAME mit der Domain anlegen.


## Projekt-Konfigurator

`projekt.html` enthält den Konfigurator mit 3–30 Inhaltsseiten und optionalen Funktionen.
Die Zusammenfassung wird per HTTPS-POST an FormSubmit übermittelt und als Tabelle an
`contact.buildyourown@gmail.com` weitergeleitet. Antworten gehen über Reply-To an den Kunden.
FormSubmit übernimmt die Sicherheitsprüfung; es werden keine Mail-Zugangsdaten im Repository benötigt.

### Einmalige Aktivierung

1. Das veröffentlichte Formular einmal mit eigenen Angaben absenden und die Sicherheitsprüfung abschliessen.
2. Im Postfach `contact.buildyourown@gmail.com` die Aktivierungsnachricht von FormSubmit öffnen und bestätigen (auch Spam prüfen).
3. Anschliessend eine eigene Testanfrage absenden und den tatsächlichen Eingang prüfen.

Ohne Aktivierung ist die Zustellung noch nicht bestätigt. Der Versand hängt von FormSubmit ab.
Nach erfolgreicher Übergabe führt FormSubmit zurück auf `anfrage-erhalten.html`.
Die Datenschutzhinweise zum Dienst sind direkt am Formular verlinkt.
