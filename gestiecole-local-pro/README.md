# GESTIECOLE LOCAL PRO — v1.0

**Éditeur :** KABO EDUCATION · **Produit :** KABO_GESTION_PRO · **Version :** 1.0

Application complète de gestion administrative, pédagogique et financière d'un établissement scolaire sénégalais. **100 % locale et autonome** : un seul fichier HTML, aucune API, aucun serveur, aucun CDN, aucune connexion Internet.

---

## 1. Installation

Aucune installation n'est nécessaire.

1. Copiez `index.html` sur l'ordinateur (clé USB, dossier local, courriel interne…).
2. Ouvrez-le avec un navigateur récent : **Google Chrome, Microsoft Edge ou Mozilla Firefox** (versions 2021 ou plus récentes recommandées).
   - Préférez Chrome ou Edge : IndexedDB y est le plus fiable.
3. La base de données (`kabo_gestion_pro`) et le compte administrateur sont créés automatiquement au premier lancement.

**Première connexion :** identifiant `admin`, mot de passe `admin123`.
→ **Changez immédiatement ce mot de passe** (clic sur votre profil en haut à droite → « Changer mon mot de passe »).

### Contenu du package

| Fichier | Rôle |
|---|---|
| `index.html` | L'application complète (CSS + JS intégrés) |
| `DONNEES_DEMO.json` | Jeu de données **fictives** à importer depuis l'écran de connexion (ou depuis « Sauvegarde & données ») |
| `GUIDE_UTILISATEUR.md` | Manuel d'utilisation par module |
| `GUIDE_TECHNIQUE.md` | Architecture, base de données, calculs, limites |
| `TESTS.md` | Rapport des scénarios de test et résultats |
| `CHANGELOG.md` | Historique des versions |

## 2. Les données restent locales

- Toutes les données sont stockées dans **IndexedDB** du navigateur (base `kabo_gestion_pro`), sur **ce** navigateur et **cet** ordinateur uniquement.
- L'identité de l'application et les préférences d'affichage uniquement sensibles (menu replié, dernière vue, année active) sont dans le LocalStorage du même navigateur.
- **Aucune donnée n'est jamais transmise à l'extérieur** : l'application ne fait aucun appel réseau (ni CDN, ni police web, ni API).

### Points de vigilance navigateur

- Les données sont attachées au **profil de navigateur** de l'ordinateur : les ouvrir depuis un profil « navigation privée » ou un autre compte = data absentes ou dissociées.
- Ne videz pas les « données de sites » / l'historique avec suppression de cookies et données de sites pour ce fichier : cela détruirait la base.
- recommandé : **sauvegarde JSON hebdomadaire** (« Sauvegarde & données » → Sauvegarde complète) conservée sur un support externe.

## 3. Utilitaires de démonstration

Deux moyens de charger un environnement d'essai :

- **Écran de connexion** → « Charger le jeu de données de démonstration… » : remplace les données actuelles par un jeu fictif (établissement, année 2025-2026, 6 classes, 36 élèves, notes, présences, paiements). Les comptes de démo utilisent le mot de passe `demo1234` : `directeur`, `secretariat`, `enseignant`, `gestionnaire`, `consultation`.
- **Écran de connexion** → « Restaurer une sauvegarde (.json)… » ou module « Sauvegarde & données » : réimport complet d'un fichier exporté plus tôt. Une **sauvegarde de sécurité est automatiquement téléchargée avant chaque restauration**.

## 4. Sécurité — avertissement essentiel

> ⚠️ **Les rôles et l'écran de connexion d'une application HTML locale ne constituent PAS une protection forte.** Tout personne pouvant ouvrir le fichier avec un navigateur de l'ordinateur peut consulter les données enregistrées et contourner les contrôles d'affichage. L'application est conçue pour :
> - **organiser** les responsabilités (roles : administrateur, directeur, secrétariat, enseignant, gestionnaire, consultation),
> - **tracer** les opérations (journal d'audit),
> - **empêcher les erreurs** (confirmations, validations, annulations tracées).
>
> Elle ne remplace pas un système serveur sécurisé. Protégez l'ordinateur lui-même (session OS verrouillée, mot de passe, chiffrement du disque si nécessaire) et conservez les sauvegardes JSON hors de portée des personnes non autorisées.

## 5. Aide rapide par module

Voir [GUIDE_UTILISATEUR.md](GUIDE_UTILISATEUR.md). Résumé :

| Module | Actions principales |
|---|---|
| Tableau de bord | Indicateurs réels calculés sur les données enregistrées |
| Établissement | Identité + administration scolaire (IA, IEF, district, commune, région, code) |
| Années scolaires | Créer / activer / clôturer (format 2026-2027, séparation stricte des données) |
| Classes | CI→CM2, simple/multigrade/double flux/spéciale, effectifs calculés |
| Élèves | Fiches complètes, import/export CSV, inscription en série, transferts, fiche imprimable |
| Enseignants | Dossiers, affectations, impression du personnel |
| Matières & périodes | Coefficients et barèmes modifiables, modèles classiques/franco-arabes |
| Évaluations & notes | Saisie clavier rapide, classement avec ex æquo, statistiques |
| Présences | Appel quotidien P/A/R + motif, registre mensuel imprimable |
| Bulletins & documents | Bulletins individuels et de classe, fiche synoptique, listes — PDF via impression navigateur |
| Frais & paiements | 6 catégories, paiements partiels, reçus numérotés, annulations tracées |
| Sauvegarde & données | Export/Import JSON, diagnostic, purge contrôlée |
| Journal des opérations | Trace horodatée de toutes les actions sensibles |

## 6. Support / assistance

- Consultez le [journal des opérations](GUIDE_UTILISATEUR.md#12-journal-des-opérations) en cas de doute sur une action.
- En cas d'incident de données : importez votre dernière sauvegarde JSON (la sécurité est préservée automatiquement).
- Support : **KABO EDUCATION** — produit KABO_GESTION_PRO v1.0.

© KABO EDUCATION, KABO_GESTION_PRO v1.0. Application fournie en l'état, sans garantie de service.
