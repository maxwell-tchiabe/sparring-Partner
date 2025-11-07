# Script Vidéo : Déployer son Application Frontend de A à Z

**Titre de la vidéo** : Déployez Votre Site Web Comme un Pro ! (De Zéro à Héros du Déploiement Frontend)
**Durée estimée** : 15 minutes
**Public Cible** : Développeurs juniors ayant des projets en local.

---

### Scène 1 : Introduction Accrocheuse (0:00 - 1:30)

**[MUSIQUE DYNAMIQUE ET MODERNE EN FOND]**

**[VISUEL : Le présentateur face caméra, souriant. Incrustation du titre de la vidéo.]**

**PRÉSENTATEUR** :
"Salut à tous et bienvenue ! Si vous avez déjà codé un projet frontend incroyable sur votre machine, mais que l'idée de le mettre en ligne vous semble aussi complexe que de lancer une fusée, alors vous êtes au bon endroit !"

"Aujourd'hui, on va démystifier ensemble le déploiement. Pourquoi ? Parce que savoir coder, c'est génial, mais savoir partager ses créations avec le monde entier, c'est ça qui transforme un projet en une véritable application."

**[VISUEL : B-roll rapide d'un site web stylé qui fonctionne - un portfolio ou une to-do list.]**

**PRÉSENTATEUR** :
"Pour ce tuto, on va prendre un exemple concret : une petite application portfolio développée avec Next.js. Mais pas de panique, les concepts qu'on va voir s'appliquent à n'importe quel framework moderne, que ce soit React, Vue, ou Svelte."

"Notre objectif ? Partir du code source sur notre ordinateur et arriver à une URL personnalisée, sécurisée et accessible partout dans le monde. On va passer du `localhost` à `votrenom.com` en moins de 15 minutes. Prêts ? Alors, c'est parti !"

---

### Scène 2 : La Préparation : Le "Build" (1:30 - 3:00)

**[TRANSITION : Animation simple avec le mot "BUILD"]**

**PRÉSENTATEUR** :
"Avant de mettre notre site en ligne, on doit le préparer. C'est l'étape du 'build'."

"Imaginez que votre code source, avec ses composants React, ses fichiers TypeScript et son CSS, c'est comme une liste d'ingrédients bruts. Pour servir un plat délicieux, vous devez les cuisiner, les assembler. Le 'build', c'est exactement ça : on transforme notre code de développement en un 'plat prêt à servir' pour les navigateurs."

**[ANIMATION : Schéma du Processus de Build Simplifié]**
*   **À gauche** : Icônes représentant `Code Source (React, TSX, CSS)`.
*   **Flèche vers la droite** avec le logo de Vite ou Webpack au-dessus, légendée `Processus de Build`.
*   **À droite** : Icônes représentant `Fichiers Statiques Optimisés (HTML, JS, CSS)`.

**PRÉSENTATEUR** :
"Ce processus est géré par un outil qu'on appelle un 'bundler', comme Vite ou Webpack. Il va prendre tout notre code, le compresser, l'optimiser pour qu'il soit le plus petit et le plus rapide possible."

**[SCREEN : Terminal ouvert dans le dossier `frontend`.]**

**PRÉSENTATEUR** :
"Pour lancer ce processus, on utilise une simple commande définie dans notre fichier `package.json`. Regardez :"

**(Le présentateur tape la commande)**
```bash
npm run build
```

**[VISUEL : Le terminal affiche la sortie de la commande `next build`. Une fois terminé, le présentateur ouvre l'explorateur de fichiers.]**

**PRÉSENTATEUR** :
"Et voilà ! Un nouveau dossier vient d'apparaître : `.next` dans le cas de Next.js, ou souvent appelé `dist` ou `build` dans d'autres projets. À l'intérieur, on trouve notre site prêt à l'emploi : un fichier HTML, des fichiers CSS et JavaScript minifiés et optimisés. C'est CE dossier que nous allons déployer."

---

### Scène 3 : Où Héberger ? Le Choix de la Plateforme (3:00 - 4:30)

**[TRANSITION : Animation avec des logos de Vercel, Netlify, GitHub Pages]**

**PRÉSENTATEUR** :
"Maintenant que notre site est 'empaqueté', il nous faut un endroit où le mettre. Choisir un hébergeur, c'est un peu comme choisir le bon local pour ouvrir son magasin."

"Pour les projets frontend, il existe des plateformes fantastiques qui simplifient énormément le processus. Les plus populaires sont :"
*   **Vercel** : Créé par les mêmes personnes que Next.js, c'est l'option la plus simple et la plus intégrée pour ce framework.
*   **Netlify** : Extrêmement puissant et facile à utiliser, avec des tonnes de fonctionnalités comme les formulaires ou les fonctions serverless.
*   **GitHub Pages** : Gratuit et directement intégré à votre dépôt GitHub, parfait pour les sites statiques simples.

"Pour notre projet Next.js, on va choisir **Vercel** pour sa simplicité déconcertante. Mais les étapes sont très similaires sur Netlify."

---

### Scène 4 : Le Déploiement Manuel (4:30 - 5:30)

**[SCREEN : Le présentateur est sur le tableau de bord de Vercel.]**

**PRÉSENTATEUR** :
"Pour notre tout premier déploiement, on va faire au plus simple : le glisser-déposer. C'est un excellent moyen de comprendre ce qui se passe."

**[VISUEL : Le présentateur se connecte à Vercel avec son compte GitHub. Il arrive sur une page qui lui propose de déployer un projet.]**

**PRÉSENTATEUR** :
"La plupart des plateformes proposent une option pour déployer manuellement. Sur Vercel, on peut simplement utiliser leur CLI, mais pour l'exemple, imaginez une interface de 'drag-and-drop'."

**(Note: Vercel a déprécié le drag-and-drop direct. La méthode moderne est de lier un repo Git, ce qui sera montré dans la partie CI/CD. On va adapter cette partie pour montrer l'importation de projet Git, qui est le "manuel" moderne.)**

**PRÉSENTATEUR** :
"En fait, aujourd'hui, le 'déploiement manuel' le plus simple, c'est de connecter notre dépôt GitHub. Allons-y."

**[SCREEN : Le présentateur clique sur 'Add New... -> Project' sur Vercel. Il sélectionne son dépôt GitHub contenant le projet frontend. Vercel détecte automatiquement que c'est un projet Next.js.]**

**PRÉSENTATEUR** :
"Regardez ça, Vercel a tout détecté tout seul ! Le framework, la commande de build (`next build`), et le dossier de sortie. On n'a plus qu'à cliquer sur 'Deploy'."

**[VISUEL : L'interface de Vercel montre les logs de build. Après une minute, des confettis apparaissent.]**

**PRÉSENTATEUR** :
"Et... Tadam ! C'est fait ! En quelques clics, notre site est en ligne. Vercel nous donne une URL et on peut déjà la partager. C'est une première victoire incroyable, bravo !"

---

### Scène 5 : L'Automatisation : CI/CD avec GitHub Actions (5:30 - 8:30)

**[TRANSITION : Animation d'un robot qui travaille sur une chaîne de montage.]**

**PRÉSENTATEUR** :
"Le déploiement manuel, c'est bien, mais c'est répétitif. À chaque modification, il faudrait refaire le processus. On va donc automatiser tout ça avec ce qu'on appelle la **CI/CD** : Intégration Continue et Déploiement Continu."

"La métaphore, c'est d'avoir un assistant robot qui, à chaque fois que vous mettez à jour votre code sur GitHub, va automatiquement tester, builder et déployer le site pour vous. Magique, non ?"

**[ANIMATION : Schéma de l'Architecture Globale du Déploiement]**
*   `Développeur` ➡️ `git push` ➡️ `GitHub` ➡️ `GitHub Actions (CI/CD)` ➡️ `Vercel` ➡️ `Utilisateur Final`.

**PRÉSENTATEUR** :
"L'outil qui va nous servir de robot, c'est **GitHub Actions**. On va créer un fichier de configuration qui décrit les étapes à suivre."

**[SCREEN : VS Code. Le présentateur crée le chemin `.github/workflows/` et un fichier `deploy.yml` à l'intérieur.]**

**PRÉSENTATEUR** :
"Dans notre projet, on crée un dossier `.github/workflows`. À l'intérieur, un fichier `deploy.yml`. C'est notre recette pour le robot."

**(Le présentateur colle le code suivant et l'explique ligne par ligne.)**

```yaml
# .github/workflows/deploy.yml
name: Deploy Frontend to Vercel

on:
  push:
    branches:
      - main # Se déclenche à chaque push sur la branche main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm install

      - name: Build project
        run: npm run build
        env:
          NEXT_PUBLIC_API_BASE_URL: ${{ secrets.NEXT_PUBLIC_API_BASE_URL }}
          # Ajoutez d'autres variables d'environnement ici

      # Note : Pour Vercel, le déploiement est automatique via l'intégration Git.
      # Ce fichier est un exemple si vous déployiez sur une autre plateforme
      # comme Netlify CLI ou AWS S3. Vercel rend ça encore plus simple !
      - name: Vercel Deployment
        run: echo "Vercel handles this automatically when linked to a GitHub repo."
```

**PRÉSENTATEUR** :
"**Correction importante !** Avec Vercel, c'est encore plus simple. Le simple fait d'avoir connecté notre dépôt GitHub à Vercel à l'étape précédente a DÉJÀ mis en place la CI/CD ! Vercel écoute chaque `git push` sur la branche `main` et redéploie tout seul. On n'a même pas besoin de ce fichier `deploy.yml` pour Vercel."

"Cependant, si vous utilisiez Netlify ou que vous vouliez déployer sur un serveur personnel, ce fichier serait la clé. C'est le principe de la CI/CD."

**[VISUEL : Le présentateur fait une petite modification dans le code (change un titre), `git push`, et on voit sur le dashboard Vercel qu'un nouveau déploiement se lance automatiquement.]**

---

### Scène 6 : Variables d'Environnement (8:30 - 10:00)

**[TRANSITION : Animation d'une clé entrant dans une serrure.]**

**PRÉSENTATEUR** :
"Notre application a sûrement besoin de se connecter à une API. L'URL de cette API peut changer entre notre machine (`localhost`) et la version en ligne. Pire, on peut avoir des clés d'API secrètes. On ne doit JAMAIS les écrire en dur dans le code !"

**[VISUEL : On montre un fichier `.env.local` avec `NEXT_PUBLIC_API_BASE_URL=...` et un fichier `.gitignore` qui ignore les fichiers `.env*`.]**

**PRÉSENTATEUR** :
"La solution, ce sont les variables d'environnement. En local, on utilise un fichier `.env.local`. Mais ce fichier n'est jamais envoyé sur GitHub, pour des raisons de sécurité. Alors, comment notre hébergeur les connaît ?"

**[SCREEN : Dashboard du projet sur Vercel. Onglet 'Settings' -> 'Environment Variables'.]**

**PRÉSENTATEUR** :
"C'est très simple. Sur Vercel, on va dans les paramètres du projet, et on trouve une section 'Environment Variables'. Ici, on va recréer nos variables, comme `NEXT_PUBLIC_API_BASE_URL`, mais avec la valeur de production."

**(Le présentateur ajoute la variable `NEXT_PUBLIC_API_BASE_URL` avec la valeur `https://api.mon-site.com`.)**

**PRÉSENTATEUR** :
"Et voilà ! Vercel injectera cette variable au moment du build. Vos secrets sont bien gardés."

---

### Scène 7 : Le Nom de Domaine (10:00 - 11:30)

**[TRANSITION : Animation d'une adresse postale qui se transforme en URL.]**

**PRÉSENTATEUR** :
"L'URL que Vercel nous a donnée est un peu longue. On veut notre propre adresse, comme `mon-portfolio.dev`. C'est là qu'interviennent les noms de domaine et le DNS."

"Le **DNS**, ou Domain Name System, c'est simplement l'annuaire d'Internet. Il traduit un nom facile à retenir (comme `google.com`) en une adresse de serveur technique (une adresse IP)."

**[SCREEN : Le présentateur montre un site comme Namecheap ou Gandi.]**

**PRÉSENTATEUR** :
"La première étape est d'acheter un nom de domaine. Ça coûte environ 10€ par an. Une fois que vous en possédez un, il faut le 'brancher' à notre hébergeur."

**[SCREEN : Dashboard de Vercel, onglet 'Domains'.]**

**PRÉSENTATEUR** :
"Sur Vercel, on va dans 'Domains', on ajoute notre nom de domaine. Vercel va nous donner des instructions, généralement de changer les 'nameservers' ou d'ajouter un enregistrement DNS chez notre fournisseur de domaine."

**[VISUEL : Schéma simple montrant le panneau de Namecheap où l'on copie les informations données par Vercel.]**

**PRÉSENTATEUR** :
"On copie-colle ces informations, on attend quelques minutes (parfois quelques heures), et c'est tout ! Votre site est maintenant accessible via votre propre nom de domaine."

---

### Scène 8 : Sécurité et Performance (11:30 - 12:30)

**[TRANSITION : Animation d'un cadenas qui se ferme et d'une fusée qui décolle.]**

**PRÉSENTATEUR** :
"Deux derniers points cruciaux : la sécurité et la performance."

"Vous avez remarqué le petit cadenas vert à côté de l'URL ? C'est le **HTTPS**. Ça veut dire que la connexion entre vos utilisateurs et votre site est chiffrée et sécurisée. La bonne nouvelle ? Des plateformes comme Vercel ou Netlify le configurent automatiquement et gratuitement pour vous. C'est un standard indispensable aujourd'hui."

**[ANIMATION : Flux de Requête avec CDN]**
*   Une carte du monde. Un utilisateur en Europe clique.
*   La requête ne va pas jusqu'au serveur d'origine (ex: USA) mais est interceptée par un serveur CDN en Europe.
*   Le site se charge quasi instantanément.

**PRÉSENTATEUR** :
"Ensuite, la performance. Pour que votre site soit rapide partout dans le monde, ces plateformes utilisent un **CDN**, ou Content Delivery Network. C'est un réseau de serveurs répartis sur toute la planète. Quand un utilisateur visite votre site, il reçoit les fichiers depuis le serveur le plus proche de chez lui. Résultat : un temps de chargement ultra-rapide, que vous soyez à Paris ou à Tokyo."

---

### Scène 9 : Conclusion et Prochaines Étapes (12:30 - 14:00)

**[VISUEL : Le présentateur de retour face caméra. Incrustation d'un résumé des étapes.]**

**PRÉSENTATEUR** :
"Et voilà ! Faisons un petit récapitulatif. On a :"
1.  **Buildé** notre projet pour le rendre prêt pour la production.
2.  Choisi un **hébergeur** moderne comme Vercel.
3.  Connecté notre dépôt Git pour un déploiement **automatisé** (CI/CD).
4.  Sécurisé nos clés d'API avec les **variables d'environnement**.
5.  Configuré un **nom de domaine** personnalisé.
6.  Et on a bénéficié automatiquement du **HTTPS** et d'un **CDN**.

"Vous avez maintenant toutes les clés en main pour déployer n'importe lequel de vos projets frontend. Le plus important maintenant, c'est de pratiquer. Prenez un de vos projets sur votre machine, et mettez-le en ligne. C'est en faisant qu'on apprend le mieux."

**[VISUEL : Incrustation de pistes pour aller plus loin.]**

**PRÉSENTATEUR** :
"Si vous voulez aller plus loin, vous pouvez explorer les tests automatisés dans votre CI/CD, le monitoring pour surveiller si votre site est en ligne, ou encore les 'preview deployments' pour tester vos modifications avant de les mettre en production."

"Merci d'avoir suivi ce tutoriel ! Si ça vous a aidé, n'hésitez pas à laisser un pouce bleu et à vous abonner. Et surtout, partagez les liens de vos projets déployés dans les commentaires, j'ai hâte de voir ce que vous avez créé !"

**[MUSIQUE DYNAMIQUE QUI REPREND]**

**[OUTRO : Animation avec les liens vers les réseaux sociaux et un bouton d'abonnement.]**

---

### SEO & Métadonnées pour YouTube

**Keywords (Mots-clés Simples)**:
1.  Déploiement
2.  Frontend
3.  Vercel
4.  CI/CD
5.  GitHub Actions
6.  Next.js
7.  React
8.  Tutoriel
9.  Hébergement
10. Développeur

**Keyword Phrases (Phrases Clés)**:
1.  Déploiement frontend de A à Z
2.  Mettre en ligne un site web
3.  Tutoriel déploiement pour débutants
4.  CI/CD avec GitHub Actions
5.  Déployer une application Next.js
6.  Hébergement web pour frontend
7.  Variables d'environnement Vercel
8.  Configurer un nom de domaine
9.  Déploiement continu facile
10. De localhost à production

---

**Titre de la Vidéo (pour YouTube)**:
Tutoriel : Déployer son Site Frontend (Next.js/React) de A à Z avec Vercel & CI/CD (GitHub Actions)

**Titre pour la Miniature (plus court et percutant)**:
DÉPLOIEMENT FACILE
De Localhost à Production

---

**Description de la Vidéo**:
Apprenez le déploiement frontend de A à Z dans ce tutoriel complet pour développeurs débutants. Nous allons mettre en ligne un site web (application Next.js / React) en utilisant Vercel pour un hébergement web simple et puissant. Découvrez comment automatiser votre workflow avec une CI/CD utilisant GitHub Actions, protéger vos clés API avec les variables d'environnement sur Vercel, et configurer votre propre nom de domaine. Passez de localhost à production comme un pro ! Ce guide couvre tout ce qu'il faut savoir sur le déploiement continu facile.

---

**Tags pour YouTube (séparés par des virgules)**:

**Avec #**:
, #Netlify, #CICD, #GitHubActions, #NextJS, #ReactJS, #Tutoriel, #DeploiementFrontend, #Developpeur, #MettreEnLigne, #DeploiementContinu, #Programmation, #DeveloppementWeb

**Sans #**:
Déploiement, Frontend, Vercel, Netlify, CI/CD, GitHub Actions, Next.js, React.js, Tutoriel, Deploiement Frontend, Développeur, Mettre en ligne, Déploiement Continu, Programmation, Développement Web
