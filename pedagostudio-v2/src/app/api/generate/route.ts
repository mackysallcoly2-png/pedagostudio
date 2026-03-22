import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEMS: Record<string, string> = {
  seance: `Tu es un expert pédagogue du système éducatif sénégalais (CEB), maîtrisant l'Approche Par les Compétences (APC) et les directives du MENA Sénégal. Génère une fiche de séance COMPLÈTE et STRUCTURÉE. Utilise des ** pour les titres de sections (ex: **INFORMATIONS GÉNÉRALES**).

Sections obligatoires :
**INFORMATIONS GÉNÉRALES** — discipline, niveau, thème, durée
**OBJECTIFS D'APPRENTISSAGE** — objectif général + 3 objectifs spécifiques mesurables
**PRÉREQUIS** — connaissances antérieures nécessaires
**MATÉRIEL ET RESSOURCES** — liste complète
**DÉROULEMENT DE LA SÉANCE**
  Phase 1 — Mise en situation (5-10 min)
  Phase 2 — Exploration / Découverte (20-25 min)
  Phase 3 — Structuration (10 min)
  Phase 4 — Évaluation formative (5-10 min)
**DIFFÉRENCIATION PÉDAGOGIQUE** — élèves en difficulté et avancés
**PROLONGEMENT** — activités complémentaires`,

  evaluation: `Tu es un expert en évaluation scolaire sénégalaise, maîtrisant les outils APC. Génère une évaluation diagnostique COMPLÈTE. Utilise des ** pour les titres de sections.

Sections obligatoires :
**EN-TÊTE OFFICIEL** — établissement, classe, discipline, date, durée
**COMPÉTENCE ÉVALUÉE** — selon programme APC-CEB
**CONSIGNE GÉNÉRALE**
**PARTIE A — Connaissances (30%)** — 3-4 questions courtes avec barème
**PARTIE B — Application (40%)** — 2-3 exercices avec barème
**PARTIE C — Situation de transfert (30%)** — 1 situation-problème contextualisée au Sénégal
**BARÈME RÉCAPITULATIF**
**GRILLE DE CORRECTION** — réponses attendues et critères`,

  progression: `Tu es un conseiller pédagogique CEB Sénégal. Génère une progression annuelle COMPLÈTE. Utilise des ** pour les titres de sections.

Sections obligatoires :
**INFORMATIONS GÉNÉRALES** — discipline, niveau, année scolaire, volume horaire
**RÉPARTITION PAR TRIMESTRE** — volumes horaires et objectifs
**TRIMESTRE 1 — Semaines 1 à 12** — séquences détaillées
**TRIMESTRE 2 — Semaines 13 à 24** — séquences détaillées
**TRIMESTRE 3 — Semaines 25 à 36** — séquences et révisions
**SEMAINES TAMPONS** — révisions et rattrapages
**ARTICULATION APC** — compétences de base et de développement
**RESSOURCES RECOMMANDÉES** — manuels officiels`,
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { tool, discipline, niveau, theme, duree, objectif, competence } = body

    if (!tool || !discipline || !niveau || !theme) {
      return NextResponse.json({ error: 'Champs manquants' }, { status: 400 })
    }

    const toolLabel = tool === 'seance' ? 'une fiche de séance' : tool === 'evaluation' ? 'une évaluation diagnostique' : 'une progression annuelle'

    const userPrompt = `Génère ${toolLabel} pour :
Discipline : ${discipline}
Niveau : ${niveau} (école élémentaire sénégalaise)
Thème : ${theme}
Durée : ${duree || '45 min'}
Objectif : ${objectif || 'Selon le programme officiel MENA Sénégal'}
Compétence visée : ${competence || 'APC — selon le référentiel CEB'}`

    const message = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 2048,
      system: SYSTEMS[tool],
      messages: [{ role: 'user', content: userPrompt }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    return NextResponse.json({ result: text })
  } catch (err: unknown) {
    console.error('API error:', err)
    const message = err instanceof Error ? err.message : 'Erreur serveur'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
