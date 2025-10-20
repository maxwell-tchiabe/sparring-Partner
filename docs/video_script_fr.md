Titre: Comprendre l'API AI Companion — base de données, auth, modèles et routes

Durée cible: 12-15 minutes

0:00 - 0:20 Introduction

- Présentation rapide: objectif de la vidéo et public (étudiants)
- Résumé du système: un backend FastAPI qui gère l'authentification, les sessions de chat, le stockage des messages et l'intégration de modules (speech, image, graph agent)

0:20 - 1:20 Vue d'ensemble architecture (slide 1)

- Composants: Frontend (Next.js), Backend (FastAPI), Database (Supabase/Postgres), Short-term memory (SQLite via langgraph), Modules (speech/image), Auth (JWT)
- Expliquer le flux général: Auth -> Routes -> Services -> DB -> Agents -> Réponse

1:20 - 3:00 Auth et middleware (slide 2)

- Montrer `main.py` middleware d'authentification
- Expliquer extraction du header Authorization, vérification du JWT via `verify_token`, ajout de `request.state.user_id`
- Cas d'erreurs (token manquant, invalidité) et endpoints publics (/api/health, /docs)
- Pourquoi utiliser middleware vs dépendances FastAPI

3:00 - 6:00 Routes et logique principale (slide 3)

- Parcourir `routes.py`: endpoints pour sessions (`/api/chat-sessions`), messages (`/api/chat`, `/api/messages`), santé
- Expliquer validation de propriété: comment on vérifie que `session.user_id == request.state.user_id`
- Expliquer rate limiting: `slowapi` et `limiter.shared_limit` et `get_user_identifier` (clé basée sur JWT ou IP)
- Gestion des inputs multimodaux: text/audio/image — comment le backend normalise en `Message` et stocke en base64 si nécessaire

6:00 - 8:00 Services et base de données (slide 4)

- `ai_companion.database.supabase` (db): expliquer rôle (CRUD pour sessions/messages)
- Différence entre stockage primaire (Postgres via Supabase) et short-term memory (SQLite) utilisé par `langgraph`
- Expliquer les modèles Pydantic (ou Pydantic v2 `BaseModel`) : `Message`, `ChatSession` — shapes et validation

8:00 - 10:00 Pipeline agent / modules (slide 5)

- Montrer intégration `graph_builder` + `AsyncSqliteSaver` pour contexte short-term
- Expliquer modules `SpeechToText`, `TextToSpeech`, `ImageToText` : points d'entrée et comment ils transforment les données
- Décrire le flux: recevoir message -> sauvegarder user message -> appeler graph -> récupérer output_state -> sauvegarder assistant message -> renvoyer JSON

10:00 - 11:30 Exemples et cas d'erreurs (slide 6)

- Démonstration: envoi de texte, envoi d'audio, envoi d'image
- Gestion des erreurs: 401 (auth), 403 (autorisation), 404 (session non trouvée), 429 (rate limit), 500 (erreur interne)

11:30 - 12:30 Conclusion et bonnes pratiques (slide 7)

- Sécurité: rotation et validation des tokens, limitation de débit, validation d'entrées
- Observabilité: logs structurés, traces, métriques
- Extensibilité: séparation des responsabilités, tests, mocks pour modules externes

Annexes (liens et commandes)

- Où trouver le code dans le repo
- Commandes pour lancer le backend en local (uvicorn), tests, et générer diagrammes

---

Notes pédagogiques:

- Garder un ton simple, utiliser analogies (agent = cerveau, DB = mémoire longue, SQLite = post-it mémoire courte)
- Montrer toujours le code en parallèle avec le diagramme de flux
- Suggérer exercices pour les étudiants (implémenter un endpoint, mocker un module TTS)
