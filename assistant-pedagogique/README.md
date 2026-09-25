# L'Assistant Pédagogique — transfert vers Codex

Projet source : Lovable — `L'Assistant Pédagogique`
Lovable project ID : `4e7f7248-9a9f-4ba8-a848-c10937729451`
Dernier commit Lovable connu : `84e10ce02297a46858a2bd2b617eab3af9a70744`

## Objectif
Poursuivre localement avec Codex le développement de la plateforme d'ingénierie pédagogique sénégalaise.

## Phase 1 déjà réalisée côté Lovable
- Supabase activé.
- Tables territoriales : `academies` → `iefs` → `ecoles`.
- `profiles`, `user_roles`, `journal_activite`.
- RLS et fonction serveur `has_role()`.
- Authentification : connexion, inscription, mot de passe oublié/réinitialisation.
- Administration initiale : utilisateurs et structures.
- Profil utilisateur avec rattachement IA/IEF/école.
- Ajout des champs `profiles.email` et `profiles.actif`.
- Protection serveur de ces deux champs pour les non-admins.
- Premier utilisateur inscrit : admin + enseignant ; utilisateurs suivants : enseignant.

## Architecture cible
React + Vite + TypeScript + Tailwind/shadcn + Supabase + Drizzle.

Le référentiel pédagogique futur doit rester séparé des rôles : `user_roles` est la source d'autorité pour les permissions.

## Règle de sécurité
Ne jamais versionner `.env`, les clés Supabase, les clés IA ou les tokens.
Créer un `.env.local` à partir d'un `.env.example`.

## Prochaine séquence Codex
1. Récupérer la copie complète du code source Lovable dans `assistant-pedagogique/`.
2. Vérifier `npm install`, `npm run build`, `npm run lint` et `npm test`.
3. Finaliser les menus et routes par rôle.
4. Finaliser l'administration IA → IEF → École.
5. Vérifier les RLS avec des tests d'intégration.
6. Construire ensuite le référentiel CEB : CB → Palier → OA → OS.

## Important
La synchronisation automatique Lovable → GitHub n'a pas pu être déclenchée depuis la session actuelle car l'espace Lovable n'a plus de crédits. Le code source complet doit donc être exporté depuis Lovable ou récupéré via une intégration GitHub Lovable dès que celle-ci est disponible.
