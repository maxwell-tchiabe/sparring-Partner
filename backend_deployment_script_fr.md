# Script Vidéo : Déployer une API FastAPI Comme un Pro !

**Titre de la vidéo** : Déployez Votre API FastAPI sur le Cloud ! (Docker, Google Cloud Run & CI/CD)
**Durée estimée** : 15 minutes
**Public Cible** : Étudiants développeurs, Développeurs Backend, Juniors en DevOps.

---

### Scène 1 : Introduction (0:00 - 1:30)

**[MUSIQUE TECHNO-OPTIMISTE EN FOND]**

**[VISUEL : Le présentateur face caméra. Incrustation du titre et des logos FastAPI, Docker, GCP, GitHub Actions.]**

**PRÉSENTATEUR** :
"Salut les codeurs ! Vous avez créé une API ultra-rapide avec FastAPI, elle fonctionne à merveille sur votre machine, mais maintenant, comment la rendre accessible au monde entier, de manière fiable et scalable ?"

"Aujourd'hui, on s'attaque au déploiement backend ! C'est une compétence essentielle qui fait le pont entre le développement et la production. On va transformer notre API locale en un service cloud robuste que des millions d'utilisateurs pourraient consommer."

**[VISUEL : Schéma simple : `Code FastAPI` -> `Docker` -> `Google Cloud Run` -> `Utilisateurs`.]**

**PRÉSENTATEUR** :
"Notre mission : prendre une application FastAPI, la 'mettre en boîte' avec Docker, et automatiser son déploiement sur Google Cloud Run à chaque `git push` grâce à la magie de la CI/CD avec GitHub Actions. Ça vous paraît complexe ? Promis, à la fin de cette vidéo, tout sera limpide. C'est parti !"

---

### Scène 2 : Mettre notre API en Boîte avec Docker (1:30 - 4:00)

**[TRANSITION : Animation d'un conteneur Docker qui se ferme autour du logo FastAPI.]**

**PRÉSENTATEUR** :
"La première étape, c'est de rendre notre application portable. Imaginez que vous voulez partager votre recette de cuisine parfaite. Au lieu d'envoyer juste la liste des ingrédients, vous envoyez une boîte complète avec les ingrédients pré-dosés, les bons ustensiles et les instructions. C'est exactement ce que fait Docker !"

"Docker nous permet de créer un **conteneur** : un environnement isolé et standardisé qui contient notre code, nos dépendances, et tout ce qu'il faut pour que l'application tourne, peu importe la machine."

**[SCREEN : VS Code ouvert sur le fichier `backend/Dockerfile`.]**

**PRÉSENTATEUR** :
"Le plan de construction de cette 'boîte', c'est le `Dockerfile`. Analysons le nôtre :"

**(Le présentateur survole chaque ligne du Dockerfile en expliquant.)**

1.  `FROM ghcr.io/astral-sh/uv:python3.13-bookworm-slim` : "On part d'une image de base officielle et optimisée qui contient Python et `uv`, notre gestionnaire de paquets ultra-rapide."
2.  `WORKDIR /app` : "On définit notre dossier de travail à l'intérieur du conteneur."
3.  `COPY uv.lock pyproject.toml /app/` & `RUN uv sync` : "On copie d'abord les fichiers de dépendances et on les installe. C'est une astuce de mise en cache : si on ne change que notre code source plus tard, Docker n'aura pas besoin de réinstaller toutes les dépendances !"
4.  `COPY src/ /app/` : "Ensuite, on copie notre code source."
5.  `EXPOSE 8080` : "On indique que notre application écoutera sur le port 8080 à l'intérieur du conteneur."
6.  `CMD ["uvicorn", ...]` : "Et enfin, la commande pour lancer notre serveur FastAPI avec Uvicorn. C'est ce qui démarre l'API."

**PRÉSENTATEUR** :
"Avec ce fichier, on peut construire une image Docker de notre API, une sorte de 'snapshot' prêt à être exécuté n'importe où. Et notre 'n'importe où', ce sera le cloud !"

---

### Scène 3 : L'Hébergement : Google Cloud Run (4:00 - 5:30)

**[TRANSITION : Logo de Google Cloud Run qui apparaît.]**

**PRÉSENTATEUR** :
"Où va-t-on faire tourner notre conteneur ? On va utiliser **Google Cloud Run**. C'est une plateforme 'serverless'."

"Serverless, ça ne veut pas dire qu'il n'y a pas de serveurs. Ça veut dire que VOUS n'avez pas à les gérer ! C'est comme un restaurant magique : il n'existe que quand un client arrive, il peut s'agrandir instantanément pour servir 1000 clients, et vous ne payez que pour les repas servis. C'est parfait pour les API !"

**[ANIMATION : Schéma simple]**
*   `0 utilisateur` -> `0 conteneur (coût = 0$)`
*   `100 utilisateurs` -> `Cloud Run démarre et scale à 5 conteneurs automatiquement`
*   `1 utilisateur` -> `Cloud Run redescend à 1 conteneur`

**PRÉSENTATEUR** :
"Cloud Run prend notre image Docker et s'occupe de tout : la mise à l'échelle, la sécurité, la disponibilité. Notre seul travail, c'est de lui fournir l'image."

---

### Scène 4 : L'Automatisation (CI/CD) avec GitHub Actions (5:30 - 10:00)

**[TRANSITION : Animation d'une chaîne d'usine automatisée avec le logo GitHub Actions.]**

**PRÉSENTATEUR** :
"Maintenant, le plat de résistance : l'automatisation. On ne va pas construire et envoyer notre image Docker à la main à chaque changement. On va mettre en place une chaîne de CI/CD (Intégration et Déploiement Continus) avec GitHub Actions."

**[SCREEN : VS Code ouvert sur le fichier `.github/workflows/deploy-backend.yaml`.]**

**PRÉSENTATEUR** :
"Ce fichier YAML est la recette de notre automatisation. Décortiquons-le ensemble."

**(Le présentateur explique les sections clés.)**

1.  **`on: push: branches: [main] paths: ['backend/**']`** : "Ceci est le déclencheur. Le workflow se lancera automatiquement à chaque `git push` sur la branche `main`, mais SEULEMENT si des fichiers ont été modifiés dans le dossier `backend/`. C'est malin, on ne redéploie pas le backend si on ne touche qu'au frontend !"

2.  **`steps:`** : "Voici la liste des actions à exécuter."
    *   `actions/checkout@v4` : "On récupère notre code source."
    *   `google-github-actions/auth@v2` : "Étape cruciale : on s'authentifie à Google Cloud. On utilise ici un secret GitHub (`GCP_SA_KEY`) qui contient une clé de compte de service pour ne jamais exposer nos identifiants."
    *   `gcloud auth configure-docker` : "On configure Docker pour qu'il puisse pousser notre image sur l'Artifact Registry de Google, qui est un espace de stockage privé pour nos images Docker."

3.  **`Build and push Docker image`** : "Ici, on exécute les commandes `docker build` et `docker push`. On 'tag' l'image avec l'adresse de notre Artifact Registry pour que Docker sache où l'envoyer."

4.  **`Deploy to Cloud Run`** : "C'est le moment magique ! On utilise une action pré-faite (`deploy-cloudrun@v2`) qui simplifie tout. On lui dit :"
    *   Le nom de notre service (`sparring-partner`).
    *   La région (`LOCATION`).
    *   L'image qu'on vient de pousser.
    *   Et des `flags` importants comme le port, la mémoire, et surtout... les secrets !

---

### Scène 5 : La Gestion des Secrets (10:00 - 11:30)

**[TRANSITION : Animation d'un coffre-fort.]**

**PRÉSENTATEUR** :
"Notre API a besoin de clés pour se connecter à des services comme une base de données (Supabase) ou d'autres API (Groq, ElevenLabs). On ne les met JAMAIS dans le code. Comment Cloud Run les récupère ?"

**[SCREEN : On montre la section `secrets:` dans le fichier `deploy-backend.yaml`.]**

```yaml
secrets: |
  GROQ_API_KEY=GROQ_API_KEY:latest
  SUPABASE_URL=SUPABASE_URL:latest
  ...
```

**PRÉSENTATEUR** :
"Cette syntaxe est très puissante. Elle dit à Cloud Run : 'Prends le secret nommé `GROQ_API_KEY` qui est stocké dans le Secret Manager de Google Cloud, et expose-le à mon application comme une variable d'environnement nommée `GROQ_API_KEY`'."

**[VISUEL : Schéma simple montrant le Secret Manager de GCP comme un coffre-fort, et Cloud Run qui vient y chercher les clés au démarrage.]**

**PRÉSENTATEUR** :
"De cette manière, nos secrets sont stockés de façon centralisée et sécurisée. Notre code reste propre et sûr."

---

### Scène 6 : Démonstration et Conclusion (11:30 - 14:00)

**[SCREEN : Le présentateur est dans VS Code. Il fait une petite modification dans un fichier de l'API backend, par exemple, il change un message de retour.]**

**PRÉSENTATEUR** :
"Ok, voyons la magie opérer. Je vais faire un petit changement... Voilà. Maintenant, je commit et je push sur la branche `main`."

```bash
git add .
git commit -m "feat: Update API response message"
git push origin main
```

**[SCREEN : On passe à l'onglet 'Actions' du dépôt GitHub. On voit le workflow qui se lance, passe par chaque étape : build, push, deploy. Les étapes deviennent vertes les unes après les autres.]**

**PRÉSENTATEUR** :
"Et voilà ! GitHub Actions a pris le relais. Il est en train de construire notre image Docker, de la pousser sur l'Artifact Registry, et de demander à Cloud Run de se mettre à jour avec cette nouvelle version. Tout ça, sans aucune intervention manuelle."

**[SCREEN : Une fois le workflow terminé, on va sur la console Google Cloud, sur la page du service Cloud Run. On voit qu'une nouvelle révision a été créée et qu'elle reçoit 100% du trafic. Le présentateur visite l'URL de l'API et montre que le message a bien été mis à jour.]**

**PRÉSENTATEUR** :
"Et c'est terminé ! Notre modification est en production, de manière sécurisée et automatisée."

**[VISUEL : Retour du présentateur face caméra.]**

**PRÉSENTATEUR** :
"Pour résumer : on a mis notre API FastAPI dans un conteneur **Docker**, on a utilisé **GitHub Actions** pour créer une chaîne de **CI/CD** qui build et push cette image, et on a déployé le tout sur **Google Cloud Run**, une plateforme serverless qui gère tout pour nous, y compris les **secrets**.

"Vous avez maintenant une architecture de déploiement backend moderne et professionnelle. N'hésitez pas à l'adapter à vos propres projets !"

"Merci d'avoir suivi ! Si cette vidéo vous a plu, un pouce bleu fait toujours plaisir. Abonnez-vous pour plus de contenus sur le dev et le DevOps. À la prochaine !"

**[MUSIQUE QUI REPREND ET OUTRO]**

---

### SEO & Métadonnées pour YouTube

**Keywords (Mots-clés Simples)**:
1.  FastAPI
2.  Docker
3.  Déploiement
4.  Backend
5.  Google Cloud Run
6.  CI/CD
7.  GitHub Actions
8.  Python
9.  API
10. DevOps

**Keyword Phrases (Phrases Clés)**:
1.  Déploiement API FastAPI
2.  Mettre en production une API Python
3.  Tutoriel Google Cloud Run
4.  CI/CD pour le backend
5.  Dockeriser une application FastAPI
6.  Déploiement continu avec GitHub Actions
7.  Hébergement API serverless
8.  Gestion des secrets GCP
9.  FastAPI pour la production
10. Automatiser le déploiement backend

---

**Titre de la Vidéo (pour YouTube)**:
Tutoriel : Déployer une API FastAPI (Python) avec Docker, Google Cloud Run et CI/CD (GitHub Actions)

**Titre pour la Miniature (plus court et percutant)**:
API FASTAPI EN PROD
Docker, Cloud Run & CI/CD

---

**Description de la Vidéo**:
Passez au niveau supérieur et apprenez à déployer votre API FastAPI en production ! Dans ce tutoriel complet, nous allons dockeriser une application backend Python et la mettre en ligne sur Google Cloud Run, une plateforme serverless puissante. Découvrez comment mettre en place une pipeline de CI/CD complète avec GitHub Actions pour automatiser votre déploiement backend à chaque push. Nous couvrirons la gestion des secrets avec GCP Secret Manager pour sécuriser vos clés d'API. Ce guide est parfait pour les développeurs Python et les juniors en DevOps qui veulent maîtriser le déploiement continu.

---

**Tags pour YouTube (séparés par des virgules)**:

**Avec #**:
#FastAPI, #Docker, #Déploiement, #Backend, #GoogleCloudRun, #CICD, #GitHubActions, #Python, #API, #DevOps, #Serverless, #DeploiementContinu, #Programmation, #DeveloppementWeb, #Tutoriel

**Sans #**:
FastAPI, Docker, Déploiement, Backend, Google Cloud Run, CI/CD, GitHub Actions, Python, API, DevOps, Serverless, Déploiement Continu, Programmation, Développement Web, Tutoriel
