# BuildYourOwn – statische Website (GitHub Pages)

1. Inhalt dieses Ordners in ein GitHub-Repo pushen (Root oder /docs).
2. Settings → Pages → Source: Branch (z. B. main), Ordner / (root).
3. Fertig – die Seite läuft unter https://<user>.github.io/<repo>/

Hinweise:
- Routing läuft über Hash-URLs (…/#/preise), damit es auf jedem Pages-Pfad ohne Server funktioniert.
- 404.html und .nojekyll sind bereits enthalten.
- Für eine eigene Domain: Datei CNAME mit der Domain anlegen.
