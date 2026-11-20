# GUIDE TECHNIQUE — GESTIECOLE LOCAL PRO v1.0

Éditeur : KABO EDUCATION · Produit : KABO_GESTION_PRO. Architecture, modèle de données, modules, calculs, tests, limites.

---

## 1. Architecture générale

Un fichier unique `index.html` (≈ 3 550 lignes, ~230 Ko) contenant :

- **CSS** : design system (variables CSS, palette institutionnelle : vert #1b5e20, marine #16305c, orange #e65100 ; composants boutons/cartes/tableaux/modales/toasts/kpi/graphiques CSS ; `@media print` dédiée A4 qui n'imprime que `#print-area`) ;
- **HTML** : écran de connexion, coquille applicative (topbar + sidebar + `#view-root` + footer + `#toasts` + `#print-area`) ;
- **JavaScript ES6+** (un bloc unique, `'use strict'`, aucun bundler, aucune dépendance, aucun appel réseau) :

| Couche | Objets | Rôle |
|---|---|---|
| Utilitaires | `U` | échappement HTML, uid, dates, montants, CSV (sérialisation + parseur robuste `; , TAB`), SHA-256 (`crypto.subtle`, secours djb2 hors contexte sécurisé), téléchargements, `sortKey` insensible aux accents |
| Données | `DB`, `AppSettings`, `Audit`, `Pref` | wrapper IndexedDB (put/bulkPut/get/getAll/del/clear/count/byIndex + horodatage automatique), paramètres mergés, journal en file d'écriture groupée, LocalStorage |
| Accès | `Auth`, `Session` | comptes locaux (hachage sel+SHA-256), session sessionStorage (expire à la fermeture du navigateur) |
| UI | `UI`, `TableWidget` | toast/modal/confirm/prompt, formulaires déclaratifs avec validation interne, tableaux (tri, filtres, recherche, pagination, délégation d'événements `[data-act]`) |
| Métier | 15 services (§4) | règles centralisées, testables indépendamment |
| Présentation | `VIEWS.*` (14 vues) | rendu par `render(root, params)` |
| Pilotage | `Views`, `App` | routeur (contrôle de rôle, cache classes de l'année, mémorisation dernière vue), `App.setYear`, chrome (topbar/sidebar/année/utilisateur), démarrage `init()` |

## 2. Modèle de données (IndexedDB `kabo_gestion_pro`, v1)

23 magasins : `settings` (clé `key`) et 22 magasins à clé `id` + index secondaires :

```
settings (keyPath key)            academicYears (code)            schools (keyPath key)
users (username)                  roles                           classes (yearId, niveau, teacherId)
students (matricule, nomLower)    guardians (studentId)           enrollments (studentId, classId, yearId, status)
teachers (matricule)              teacherAssignments (teacherId, classId, yearId)
subjects (yearId, niveau)         subSubjects (subjectId)         gradingPeriods (yearId)
assessments (classId, subjectId, periodId, yearId)                grades (assessmentId, studentId)
attendance (classId, date, studentId, yearId)                     feeCategories
studentFees (studentId, categoryId, yearId)                       payments (feeId, date)
receipts (paymentId)              documents (type)                auditLogs (date, userId)   backups (date)
```

Règles : identifiants uniques (`U.uid()` = timestamp base36 + aléatoire) ; `DB.put/bulkPut` ajoutent `createdAt`/`updatedAt` ; les relations sont **référentielles par id** (jamais de duplication des données entre modules) ; les catégories de frais sont instanciées **par année** (`baseId:annee`) pour isoler strictement les années scolaires.

## 3. Stockage et séparation des années

- Toutes les lignes métier portent `yearId` : changer d'année via la topbar (`App.setYear`) filtre chaque vue.
- LocalStorage : uniquement `sidebarCollapsed`, `lastView`, `activeYear` (contexte d'affichage), jamais de données scolaires.
- Clôture d'année : statut `clôturée`, reste consultable ; export JSON dédié par année.

## 4. Les 15 services

| Nom (cahier des charges) | Objet réel | Contenu |
|---|---|---|
| DatabaseService | `DB` | wrapper IndexedDB central |
| AuditService | `Audit` | journal local en file, flush groupé (900 ms) |
| ValidationService | `ValidationService` + `UI.readForm` | validation des formulaires et des formats (matricule, date, montant, code année) |
| StudentService | `StudentService` | élèves, inscriptions (enrollments), statuts, transferts |
| EnrollmentService | alias de `StudentService` | les inscriptions sont le cœur du dossier élève |
| ClassService | `ClassService` | classes, effectifs calculés, suppression conditionnelle |
| TeacherService | `TeacherService` | enseignants, affectations |
| GradeService | `GradeService` | évaluations, notes (saisie unitaire et groupée) |
| CalculationService | `CalculationService` | moyennes pondérées, cache, classement, statistiques |
| AttendanceService | `AttendanceService` | appels, registres, statistiques |
| PaymentService | alias de `FinanceService` | frais, paiements, reçus, annulations tracées |
| BulletinService | `BulletinService` | documents imprimables (bulletins, listes, registres, statistiques) |
| DashboardService | `DashboardService` | indicateurs réels |
| ImportExportService | `ImportExportService` | CSV (mappings de colonnes, détection, normalisations) |
| BackupService | `BackupService` | export/import JSON, validation, restauration avec sécurité, diagnostics |

(Nomenclature dans le code : bloc « Nomenclature de services : alias du cahier des charges » — `DatabaseService`, `AuditService`, `PaymentService`, `EnrollmentService` sont des alias directs des objets réels, sans duplication de logique.)

## 5. Règles de calcul (paramétrables, documentées — aucune règle « officielle » imposée)

### Moyenne pondérée
```
moyenne matière = Σ notes de l'élève pour la matière / nombre de notes retenues
moyenne générale = Σ (moyenne matière × coefficient) / Σ coefficients (matières notées)
```
Paramètres (settings.calc) : `arrondi` (2 par défaut), `modeNoteManquante` (`exclure` = la matière sans note est ignorée ; `zero` = comptée à 0), `ramener20` (ramène les notes sur barème 20 avant calcul). Les absences (`ABS`) sont traitées selon le mode choisi.

### Classement
Tri par moyenne décroissante puis rang **concurrence** : même rang pour les moyennes égales, rang suivant décalé du nombre de rangs occupés (1, 2, 2, 4). Statistiques : effectif noté, meilleure, moyenne de classe, plus faible, taux de réussite (moyennes ≥ 10/20).

### Finances
- `reste = montant − Σ paiements non annulés` (paiements partiels autorisés, refus au-delà du reste) ;
- reçus : compteur `settings.finance.prochainRecu`, format `REC-00001` ;
- `cancelPayment` : marque `cancelled=true` + motif + auteur + horodatage (aucune suppression, traçabilité assurée par le journal) ;
- taux de recouvrement = encaissé ÷ attendu × 100 (annulations exclues des encaissements).

## 6. Sécurité et fiabilité — **et ses limites réelles**

- Échappement systématique des données affichées (`U.esc`), validation des formulaires en ligne, contrôle du barème des notes, refus des dates futures et des doublons de matricule.
- Confirmations avant : activation/clôture/suppression d'année, suppression de classe/élève, purge, restauration ; saisie du mot `SUPPRIMER` pour les purges.
- Journal d'audit horodaté (compte + action + cible).
- **Limites assumées et documentées** : l'authentification locale organise les responsabilités et la traçabilité mais **ne résiste pas à une personne qui contrôle le poste** (fichiers, outils développeur du navigateur). Aucun chiffrement des données au repos ; protéger l'ordinateur (session OS, chiffrement disque) et les sauvegardes JSON.
- SHA-256 via `crypto.subtle` (https ou localhost) ; en contexte `file://` non sécurisé selon le navigateur, repli djb2 — fonctionnel mais moins robuste.

## 7. Performance mesurée (harnais Node 22, IndexedDB simulé en mémoire)

Les temps mesurent le **calcul JS** (les accès IndexedDB réels du navigateur ajoutent l'I/O disque, mais l'application utilise des index et des écritures groupées) :

| Volume | Classement d'une classe (50 élèves) | Tableau de bord | État financier | Tri liste élèves | Export JSON | Diagnostic |
|---|---|---|---|---|---|---|
| 500 élèves / 7 000 notes | 5 ms | 7 ms | 2 ms | 2 ms | 19 ms (2,2 Mo) | 15 ms |
| 1 000 élèves / 14 000 notes | 6 ms | 10 ms | 3 ms | 3 ms | 34 ms (4,4 Mo) | 17 ms |
| 5 000 élèves / 70 000 notes | 63 ms | 95 ms | 12 ms | 41 ms | 436 ms (22 Mo) | 88 ms |

Procédure de test de charge : voir `TESTS.md` §5. Volumes confortables sur un ordinateur modeste jusqu'à ~5 000 élèves ; au-delà, la pagination, les index IndexedDB et la purge par année maintiennent l'interface fluide.

## 8. Limites connues de la v1.0

1. **Sécurité locale** : contrôle d'affichage, pas une protection forte (voir §6).
2. Un navigateur = une base : pas de partage temps réel multi-postes, pas de multi-utilisateur concurrent.
3. Impression PDF au travers de la boîte d'impression navigateur (pas de générateur PDF embarqué).
4. L'import CSV répartit les nouveaux élèves dans **une seule classe choisie** ; pour répartir entre classes, importer fichier par fichier puis utiliser le changement de classe (ou l'inscription en série).
5. La purge par année conserve les fiches élèves (prévu) : les fiches sans inscription active restent listables.
6. Photo/logo en base64 dans IndexedDB : limiter à quelques centaines de Ko par image.
7. Le journal d'audit est écrit en file (900 ms) : une fermeture brutale du navigateur dans la demi-seconde qui suit une action peut perdre une entrée de journal — jamais une donnée métier (écritures immédiates).
8. Données liées au navigateur/profil : changer de navigateur = importer la sauvegarde JSON.

## 9. Extension / maintenance

Tout est dans un fichier : ouvrir `index.html`, repérer les sections délimitées par des commentaires `/* ------ NomService : rôle ------ */`. Aucun outil de build ; modifier puis recharger (Ctrl+F5 pour forcer le cache). Les tests sont rejouables via un harnais Node (voir `TESTS.md`).
