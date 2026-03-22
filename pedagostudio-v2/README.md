# 🎓 PedagoStudio

**Outil IA pour enseignants sénégalais** — Générateur de fiches de séance, évaluations diagnostiques et progressions annuelles selon le programme CEB du MENA Sénégal.

Propulsé par **Claude Opus 4** · Construit avec **Next.js 14**

---

## ✨ Fonctionnalités

- 📋 **Fiche de séance** — 4 phases (mise en situation, exploration, structuration, évaluation), différenciation, prolongement
- ✅ **Évaluation diagnostique** — Parties A·B·C, barème, grille de correction, contextualisée au Sénégal
- 📈 **Progression annuelle** — 3 trimestres, articulation APC, ressources officielles
- 🕓 **Historique** — 10 dernières générations accessibles
- 🖨️ **Export** — Copie et impression directe

---

## 🚀 Déploiement sur Vercel (3 étapes)

### Prérequis
- Compte [Vercel](https://vercel.com) (gratuit)
- Compte [GitHub](https://github.com) (gratuit)
- Clé API Anthropic depuis [console.anthropic.com](https://console.anthropic.com)

### Étape 1 — Pousser sur GitHub
```bash
git init
git add .
git commit -m "Initial commit — PedagoStudio"
git remote add origin https://github.com/TON_PSEUDO/pedagostudio.git
git push -u origin main
```

### Étape 2 — Importer sur Vercel
1. Va sur [vercel.com/new](https://vercel.com/new)
2. Clique **Import Git Repository** → sélectionne `pedagostudio`
3. Framework détecté automatiquement : **Next.js** ✓
4. Dans **Environment Variables**, ajoute :
   - `ANTHROPIC_API_KEY` = ta clé API Anthropic

### Étape 3 — Déployer
Clique **Deploy** → Vercel génère l'URL automatiquement 🎉

---

## 💻 Développement local

```bash
# Cloner et installer
git clone https://github.com/TON_PSEUDO/pedagostudio.git
cd pedagostudio
npm install

# Configurer l'environnement
cp .env.example .env.local
# Édite .env.local et mets ta clé API Anthropic

# Lancer en dev
npm run dev
# → http://localhost:3000
```

---

## 🏗️ Architecture

```
pedagostudio/
├── src/
│   ├── app/
│   │   ├── api/generate/route.ts  ← API Route (server-side Anthropic)
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   └── components/
│       └── PedagoStudio.tsx       ← UI client complet
├── public/
│   └── favicon.svg
├── .env.example
└── package.json
```

### Stack
| Couche | Technologie |
|--------|------------|
| Frontend | React 18 + TypeScript |
| Framework | Next.js 14 (App Router) |
| IA | Anthropic Claude Opus 4 |
| SDK | @anthropic-ai/sdk |
| Déploiement | Vercel |

---

## 🔐 Sécurité

La clé API Anthropic n'est **jamais exposée au client**. Toutes les requêtes passent par l'API Route `/api/generate` côté serveur.

---

## 📚 Conformité pédagogique

- ✅ Approche Par les Compétences (APC)
- ✅ Programme officiel MENA Sénégal
- ✅ Structure CEB (CI à CM2)
- ✅ Situations de transfert contextualisées au Sénégal

---

*Fait avec ❤️ pour les enseignants du Sénégal*
