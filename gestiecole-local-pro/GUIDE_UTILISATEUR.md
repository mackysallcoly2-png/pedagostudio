# GUIDE UTILISATEUR — GESTIECOLE LOCAL PRO v1.0

Éditeur : KABO EDUCATION · Produit : KABO_GESTION_PRO · Manuel des fonctionnalités.

> ⚠️ **Sécurité** : les mots de passe et rôles de cette application locale organisent le travail et la traçabilité, mais **ne protègent pas fortement** contre une personne ayant accès aux fichiers de l'ordinateur et au navigateur. Verrouillez votre session Windows/Ubuntu quand vous quittez le poste.

---

## 1. Démarrage et comptes

1. Ouvrez `index.html` (double-clic) dans Chrome, Edge ou Firefox récents.
2. Connectez-vous. Comptes prêts à l'emploi :
   - `admin / admin123` (Administrateur — à changer immédiatement),
   - si le jeu de démonstration est chargé : `directeur`, `secretariat`, `enseignant`, `gestionnaire`, `consultation` — mot de passe `demo1234`.
3. Modifier un mot de passe : cliquez sur votre nom en haut à droite → « Changer mon mot de passe ».
4. **Verrouiller** la session quand vous vous éloignez : bouton « 🔒 Verrouiller » (un mot de passe suffit pour reprendre). **Quitter** termine la session.

L'écran de connexion propose aussi :
- « Charger le jeu de données de démonstration » (données 100 % fictives, remplace l'existant) ;
- « Restaurer une sauvegarde (.json) ».

### Rôles et accès (contrôle d'affichage)

| Vue | Admin | Directeur | Secrétariat | Enseignant | Gestionnaire | Consultation |
|---|---|---|---|---|---|---|
| Tableau de bord, Bulletins | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| Établissement / Années | ✎ | ✎ | — | — | — | lecture |
| Utilisateurs | ✎ | lecture | — | — | — | — |
| Classes / Élèves / Enseignants | ✎ | ✎ | ✎ | lecture | — | lecture |
| Matières & périodes | ✎ | ✎ | — | lecture | — | lecture |
| Évaluations & notes, Présences | ✎ | ✎ | — | ✎ | — | lecture |
| Frais & paiements | ✎ | ✎ | — | — | ✎ | lecture |
| Sauvegarde & données | ✎ | lecture | — | — | — | — |
| Journal des opérations | ✔ | ✔ | — | — | — | — |

✔ = consultation · ✎ = consultation + écriture.

## 2. Sélecteur d'année scolaire

En haut à droite, le sélecteur « Année … » change le contexte de **toutes** les vues : classes, élèves, notes, présences, finances. Les données de deux années ne sont jamais mélangées. Création et clôture des années : menu « Années scolaires » (une seule année active à la fois ; une année clôturée reste consultable).

## 3. Établissement

Menu « Établissement », 4 onglets :
- **Identité & administration** : nom, type, code, adresse, téléphone, courriel, responsable, année de création + administration scolaire sénégalaise (Académie/IA, Inspection/IEF, District, Commune, Région) ;
- **Moyennes & calculs** : arrondi, traitement des notes manquantes (« exclure » ou « zero »), ramener ou non les notes sur 20 ;
- **Bulletins** : textes d'en-tête (République, Ministère), mentions et seuils, décisions, signataire et cachet ;
- **Logo & affichage** : image locale stockée dans la base (base64), sans Internet.

Ces informations alimentent les bulletins, listes, fiches et reçus imprimés.

## 4. Annuaires : classes, élèves, enseignants

### Classes
Créez la classe (nom, niveau CI→CM2, type simple/multigrade/double flux/spéciale/autre, capacité, enseignant principal). L'effectif, les filles et les garçons sont **calculés automatiquement** à partir des inscriptions actives. Une classe vide peut être supprimée (les élèves déjà inscrits l'interdisent). Boutons par ligne : voir les élèves, modifier, affecter un enseignant, imprimer la liste, supprimer.

### Élèves
- « ＋ Nouvel élève » : fiche complète (matricule unique vérifié, sexe, dates vérifiées, nationalité, père, mère, tuteur, téléphone, photo facultative).
- « Inscription en série » : un élève par ligne au format `Matricule;Nom;Prénom;Sexe(M/F);DateNaissance(AAAA-MM-JJ)` + choix de la classe de destination. Les doublons de matricule sont signalés et ignorés.
- « Import CSV » : assistant en 3 étapes — fichier → correspondance des colonnes et classe de destination → prévisualisation avec détection des doublons → rapport d'import. Séparateur `;`, `,` ou tabulation détecté automatiquement.
- « Export CSV » : la liste affichée, avec BOM UTF-8 (ouvrable dans Excel/LibreOffice).
- Actions par élève : modifier, changer de classe (l'historique des passages est conservé), statut (Nouveau / Passant / Redoublant / Transféré / Abandonné / Sortant), fiche imprimable, désactiver l'inscription (confirmation explicite, jamais de suppression silencieuse).

### Enseignants
Dossiers (matricule unique, diplôme, qualification, fonction, prise de service, statut), affectation aux classes par matière et année, archivage, impression de la liste du personnel.

## 5. Matières, périodes, évaluations et notes

1. **Matières & périodes** : créez vos matières (nom, coefficient, note maximale, ordre, niveau éventuel) ou utilisez « Init matières classiques » / « Init matières franco-arabes » comme point de départ — tout reste modifiable. Créez les périodes (3 trimestres par défaut ou périodes personnalisées).
2. **Évaluations & notes** : choisissez classe + période ; créez les évaluations (matière, titre, coefficient, barème). « Saisie des notes » ouvre la grille :
   - saisissez une note puis **Entrée ou ↓** pour passer à l'élève suivant, **↑** pour remonter ;
   - `ABS` marque l'absence ; les notes hors barème sont refusées ;
   - enregistrement groupé en un clic ; modifications ultérieures possibles.
3. **Panneau classement** : rang (ex æquo : même rang, rang suivant décalé — 1, 2, 2, 4), moyenne par élève, statistiques de la classe (moyenne de classe, meilleure, plus faible, taux de réussite des moyennes ≥ 10/20).

Formule appliquée (paramétrable dans « Établissement → Moyennes & calculs ») :

`Moyenne = Σ(moyenne de la matière × coefficient) / Σ(coefficients)`

Seules les matières comportant au moins une note comptent — ou comptent pour 0 si le mode « notes manquantes : zero » est choisi. Les arrondis suivent le paramétrage.

## 6. Présences & absences

Choisissez la classe et la date : chaque élève est Présent / Absent / Retard, avec motif et observation. Enregistrez l'appel. La vue affiche les cumuls P/A/R de la classe.
« Registre mensuel » : grille du mois (élèves × jours), historique individuel, statistiques, export CSV des absences et impression A4 du récapitulatif mensuel.

## 7. Bulletins & documents

Choisissez la classe et la période, puis :
- **Bulletin individuel** : recherchez l'élève → aperçu → impression/PDF ;
- **Bulletins de la classe** : tous les bulletins enchaînés (une page par élève) ;
- **Fiche synoptique** (matières × élèves : moyennes et rangs), **relevé de notes**, **statistiques** de classe ;
- **Listes** : élèves, enseignants, registre d'appel, état financier.

Chaque impression affiche la boîte d'impression du navigateur : choisissez « Destination : PDF » pour un PDF, ou une imprimante pour le papier (format A4).

Bulletin : en-tête République du Sénégal / Ministère / IA / IEF / établissement / année / trimestre ; tableau des disciplines avec notes, coefficients, moyennes, mentions ; synthèse (moyenne générale, rang, moyenne de classe, décision) ; signatures Enseignant / Directeur + cachet.

## 8. Frais & paiements

1. Créez des frais pour **un élève** ou **une classe entière** — catégorie (Inscription, Scolarité, Cantine, Transport, Fournitures, Autres), libellé, montant.
2. Recherchez l'élève : ses frais avec total / payé / reste / taux pour chaque ligne.
3. « Payer » : montant (paiement partiel autorisé), date, mode, agent encaisseur → un **reçu numéroté** (REC-00001, REC-00002…) est créé et imprimable (numéro, établissement, élève, classe, nature, montant payé, restant, date, agent).
4. « Annuler » un paiement : **jamais de suppression silencieuse** — le paiement est marqué annulé, avec motif, auteur, horodatage, et reste visible (en rouge) dans l'historique.
5. « État financier » imprimable : attendu, encaissé, restant, annulé tracé, taux de recouvrement, détail par élève.

Le tableau de bord reprend ces montants en temps réel.

## 9. Tableau de bord

Indicateurs calculés uniquement sur les données réellement enregistrées de l'année active : élèves inscrits (filles/garçons), classes, enseignants affectés, abandons, répartition par niveau et par classe, situation financière et encaissements récents, état des inscriptions par statut, jours d'absence cumulés. Bouton « Actualiser ».

## 10. Sauvegarde & restauration

Menu « Sauvegarde & données » :
- **Export complet** (JSON unique horodaté) — à refaire chaque semaine et conserver sur support externe ;
- export par magasin ou des paramètres seuls ; historique des exports ;
- **Restauration** : fichier → validation du format → prévisualisation (comptages par magasin, version, alerte si version différente) → choix fusion ou remplacement → confirmation. Une **sauvegarde de sécurité est automatiquement téléchargée avant** l'opération ;
- **Diagnostic** : nombre d'enregistrements par magasin, références orphelines, matricules dupliqués ;
- **Nettoyage contrôlé** : suppression des données d'une année (double confirmation + saisie de `SUPPRIMER`), réinitialisation complète (les comptes utilisateur sont conservés).

## 11. Journal des opérations

Menu « Journal des opérations » : connexions, créations/modifications, sauvegardes, restaurations, annulations, purges — horodatées avec le compte concerné. Filtre par action, recherche instantanée, export CSV. Le journal n'est jamais purgé automatiquement.

## 12. Dépannage

| Problème | Cause probable / solution |
|---|---|
| Mes données ont disparu | Autre navigateur, autre profil OS, navigation privée, ou données de site supprimées. Revenez au navigateur/profil utilisé ; importez la dernière sauvegarde JSON. |
| « IndexedDB bloqué » | Fermez les autres onglets/fenêtres de l'application puis rechargez. |
| L'impression sort la page entière | Dans la boîte d'impression, la zone dédiée doit seule apparaître ; vérifiez marges « Par défaut » et A4. |
| CSV illisible | Enregistrez le fichier en UTF-8 ; séparateur `;` `,` ou tabulation détecté automatiquement. |
| Bulletins sans mention | Vérifiez les seuils (Établissement → Bulletins) et le mode des notes manquantes. |
| Reste à 0 alors qu'un paiement « manque » | Un paiement a peut-être été annulé (tracé) : voyez la fiche frais et le journal. |
| Mot de passe oublié | Un compte Administrateur peut redéfinir les mots de passe (menu Utilisateurs). |
| Se connecter après restoration | Utilisez les comptes tels qu'ils étaient au moment de la sauvegarde importée. |
