Plan de slides (pour une vidéo pédagogique ~12-15 min)

Slide 1 — Titre & objectifs (10s)

- Titre: Comprendre l'API AI Companion
- Objectifs: ce que les étudiants vont apprendre

Slide 2 — Architecture globale (1:00)

- Diagramme: Frontend, Backend, DB, Short-term memory, Modules, Auth
- Note présentateur: pointer le flux de gauche à droite

Slide 3 — Auth & Middleware (1:40)

- Extrait de `main.py` montrant le middleware
- Points: extraction Authorization, verify_token, request.state.user_id
- Note: expliquer erreurs et endpoints publics

Slide 4 — Routes principales (2:30)

- Endpoints: create/get/update/delete chat sessions, /api/chat, /api/messages
- Code: extrait de `routes.py` pour `/api/chat` et `/api/chat-sessions`
- Note: expliquer validation et sécurité

Slide 5 — Database & Models (1:30)

- Tablees: users, chat_sessions, messages
- Montrer exemple de `Message` et `ChatSession` (champs clés)
- Note: expliquer stockage audio/image en base64

Slide 6 — Short-term memory & Agent (1:30)

- Montrer usage d'`AsyncSqliteSaver` et `graph_builder`
- Expliquer pourquoi on utilise mémoire courte pour context

Slide 7 — Exécution d'un message (2:00)

- Diagramme de séquence: Frontend -> Backend -> DB -> Agent -> DB -> Frontend
- Note: étape par étape avec temps approximatif

Slide 8 — Erreurs & Sécurité (0:50)

- Lister codes d'erreur et actions
- Bonnes pratiques

Slide 9 — Conclusion & Exercises (0:40)

- Récapitulatif et mini-projets pour étudiants

Slide 10 — Références & commandes (0:30)

- Commandes uvicorn, tests, générer diagrammes

Speaker notes: inclure invites pour pauses et questions, suggestions d'exemples live
