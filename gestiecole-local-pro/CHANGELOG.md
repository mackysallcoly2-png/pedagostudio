# CHANGELOG — GESTIECOLE LOCAL PRO (KABO_GESTION_PRO)

## 1.0 — Version initiale

Éditeur : KABO EDUCATION. Application 100 % locale (HTML5 + CSS3 + JavaScript ES6+ intégrés dans `index.html`).

### Ajouté

- **Cœur applicatif** — un seul fichier autonome : design system CSS (palette vert/marine/orange), coquille applicative (topbar, sidebar rétractable, toasts, modales), routeur interne sans rechargement.
- **Stockage** — IndexedDB (base `kabo_gestion_pro`, 23 magasins, horodatage automatique createdAt/updatedAt, index de recherche) + LocalStorage uniquement pour les préférences d'affichage.
- **Utilisateurs et rôles** — 6 rôles locaux (Administrateur, Directeur, Secrétariat, Enseignant, Gestionnaire, Consultation), comptes locaux avec mot de passe haché SHA-256 (secours djb2 hors contexte sécurisé), verrouillage de session, journalisation.
- **Paramètres établissement** — identité, logo (base64 local), administration scolaire sénégalaise (IA/IEF/district/commune/région/code).
- **Années scolaires** — format AAAA-AAAA, activation exclusive, clôture, export d'archive par année, séparation stricte des données entre années.
- **Classes** — niveaux CI→CM2, types simple/multigrade/double flux/spciale/autre, capacité, effectifs filles/garçons calculés depuis les inscriptions actives, suppression seulement si vide.
- **Élèves** — fiche complète avec photo (base64), matricule unique avec détection de doublons, 6 statuts, inscription individuelle/en série, import CSV avec assistant 3 étapes (détection des colonnes, prévisualisation, rapport de doublons), export CSV (BOM UTF-8), changement de classe avec historique, fiche imprimable.
- **Enseignants** — dossiers complets, affectations par classe/matière/année, archivage, liste du personnel imprimable.
- **Pédagogie** — matières avec coefficients/barèmes modifiables (modèles classiques et franco-arabes en un clic), 3 trimestres + périodes personnalisées, évaluations, **saisie de notes au clavier** (Entrée/↓/↑, `ABS` pour absent) avec contrôle du barème.
- **Calculs** — moyenne pondérée Σ(moyenne matière × coefficient) / Σ coefficients, arrondi paramétrable, notes manquantes (exclure/zero), classement concurrence 1,2,2,4, statistiques de classe (effectif, meilleure/moyenne/plus faible, taux de réussite ≥ 10).
- **Présences** — appel quotidien présent/absent/retard avec motif et observation, registre mensuel, statistiques par classe, export CSV, impression A4.
- **Bulletins** — en-tête République du Sénégal/Ministère/IA/IEF configurable, mentions et seuils paramétrables, bulletin individuel et série de classe, fiche synoptique, relevé de notes, liste élèves/enseignants, statistiques scolaires, registre d'appel — tous imprimables en A4 (PDF via « Imprimer → PDF » du navigateur).
- **Finances** — 6 catégories de frais, frais individuels ou par classe, paiements partiels, reçus numérotés REC-00001…, **annulations tracées jamais supprimées**, état financier imprimable, taux de recouvrement, encaissements par mois/catégorie.
- **Tableau de bord** — indicateurs uniquement issus des données réelles, graphiques en barres CSS sans bibliothèque.
- **Sauvegarde & restauration** — export JSON complet/par magasin/paramètres, historique des sauvegardes, restauration avec validation, prévisualisation, choix fusion/remplacement, **sauvegarde de sécurité automatique téléchargée avant restauration**, diagnostic d'intégrité (orphelins, matricules dupliqués), purge contrôlée par année avec double confirmation, réinitialisation complète.
- **Journal des opérations** — horodatage, utilisateur, action, détails ; export CSV ; jamais purgé automatiquement.
- **Jeu de démonstration** — générateur inline (bouton sur l'écran de connexion) + fichier `DONNEES_DEMO.json` du même format que l'export.

### Corrections apportées pendant le développement (pré-livraison)

- Magasin `settings` : clé de magasin corrigée (`keyPath: 'key'`) — les paramètres ne persistaient pas dans IndexedDB.
- Crash `kpi` (fonction utilisée avant sa déclaration) dans la vue « Frais & paiements » — remplacement par une fonction globale unique partagée avec le tableau de bord.
- `CalculationService.periodResult` : initialisation du cache corrigée (le classement par classe plantait lorsque le cache était fourni vide).
- Réinitialisation complète : les comptes utilisateur sont désormais conservés, comme annoncé dans la confirmation.
- Import CSV : le choix de la classe de destination est maintenant proposé à l'étape de correspondance.
- Nettoyage : gestion de l'absence de variable globale implicite (mode strict), expressions mortes supprimées, texte d'état vide corrigé, impression limitée à la zone dédiée (`#print-area`), nettoyage automatique après impression (`afterprint`).

### Limites connues (voir GUIDE_TECHNIQUE.md §8)

- Sécurité des rôles locale : contrôle d'affichage uniquement (documenté dans l'application et la présente arborescence).
- Un navigateur par ordinateur : les données ne sont pas partagées entre navigateurs ou comptes OS.
- Impression PDF via la boîte d'impression du navigateur.
