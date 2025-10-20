Guide d'enregistrement et rendu — créer une vidéo pédagogique

Objectif: expliquer et montrer le fonctionnement de l'API (database, auth, models, routes) avec support visuel (slides + diagrammes)

Outils recommandés

- Enregistrement: OBS Studio
- Montage: DaVinci Resolve / Shotcut
- Génération diagrammes: mermaid-cli (Node.js) ou VSCode Mermaid Preview

Installer mermaid-cli (PowerShell):

```powershell
# installer Node.js si nécessaire (https://nodejs.org)
npm install -g @mermaid-js/mermaid-cli
```

Générer PNG à partir du fichier `architecture_diagrams.mmd`:

```powershell
mmdc -i "docs\architecture_diagrams.mmd" -o "docs\architecture_diagrams.png" -w 1280 -H 720
```

Commandes utiles pour lancer le backend localement (PowerShell):

```powershell
# depuis le dossier backend
python -m venv .venv; .\.venv\Scripts\Activate.ps1; pip install -r requirements.txt
# lancer uvicorn
uvicorn ai_companion.interfaces.api.main:app --reload --host 0.0.0.0 --port 8000
```

Conseils d'enregistrement

- Préparez les slides et le code à l'avance
- Faites des prises courtes (2-3 minutes)
- Utilisez un micro externe si possible
- Ajoutez sous-titres ou timecodes pour les étudiants

Montage rapide

- Coupez les silences et hésitations
- Ajoutez overlays: nom du fichier, endpoint, extraits de code
- Export recommandé: 1080p H.264

Ressources pour étudiants

- Lien vers le repo et fichiers importants (`backend/src/...`)
- Exercice pratique: ajouter un endpoint protégé qui retourne le profil utilisateur
