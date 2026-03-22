'use client'

import { useState } from 'react'

/* ─── Types ─────────────────────────────────────────── */
type Tool = 'seance' | 'evaluation' | 'progression'
type Phase = 'idle' | 'loading' | 'done' | 'error'

interface FormState {
  discipline: string
  niveau: string
  theme: string
  duree: string
  objectif: string
  competence: string
}

interface HistoryEntry {
  id: number
  tool: Tool
  label: string
  result: string
  badges: string[]
}

/* ─── Constants ─────────────────────────────────────── */
const DISCIPLINES = ['Mathématiques', 'Langue française', 'Sciences naturelles', 'Histoire-Géographie', 'Éducation civique', 'Anglais']
const NIVEAUX = ['CI', 'CP', 'CE1', 'CE2', 'CM1', 'CM2']
const DUREES = ['30 min', '45 min', '60 min', '90 min']

const NAV: { id: Tool; label: string; short: string; icon: string }[] = [
  { id: 'seance', label: 'Fiche de séance', short: 'Séance', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { id: 'evaluation', label: 'Évaluation diagnostique', short: 'Évaluation', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  { id: 'progression', label: 'Progression annuelle', short: 'Progression', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
]

const COLORS = {
  primary: '#D85A30',
  primaryLight: '#fff3ef',
  primaryDark: '#993C1D',
  blue: '#2563eb',
  green: '#059669',
  amber: '#d97706',
  border: '#e5e7eb',
  bg: '#f9fafb',
  bgCard: '#ffffff',
  text: '#111827',
  textMuted: '#6b7280',
  textLight: '#9ca3af',
}

/* ─── Helpers ───────────────────────────────────────── */
function SvgIcon({ path, size = 16, color = 'currentColor' }: { path: string; size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d={path} />
    </svg>
  )
}

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span style={{ padding: '3px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, background: `${color}18`, color, letterSpacing: '0.03em' }}>
      {label}
    </span>
  )
}

function renderOutput(text: string) {
  const lines = text.split('\n')
  return lines.map((line, i) => {
    const t = line.trim()

    if (t.startsWith('**') && t.endsWith('**') && t.length > 4) {
      return (
        <div key={i} style={{ margin: '1.5rem 0 0.6rem', paddingBottom: '6px', borderBottom: `1px solid ${COLORS.border}` }}>
          <span style={{ fontSize: '10.5px', fontWeight: 700, color: COLORS.textLight, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            {t.slice(2, -2)}
          </span>
        </div>
      )
    }

    if (t.startsWith('Phase') || t.startsWith('Partie') || t.startsWith('Trimestre') || t.startsWith('Séquence')) {
      return <p key={i} style={{ margin: '10px 0 2px', fontSize: '13.5px', fontWeight: 700, color: COLORS.text }}>{line}</p>
    }

    if (line.startsWith('- ') || line.startsWith('* ')) {
      return (
        <div key={i} style={{ display: 'flex', gap: '8px', fontSize: '14px', lineHeight: '1.7', color: COLORS.text, marginBottom: '3px', paddingLeft: '4px' }}>
          <span style={{ color: COLORS.primary, flexShrink: 0, marginTop: '3px', fontSize: '10px' }}>●</span>
          <span>{line.slice(2)}</span>
        </div>
      )
    }

    if (t === '') return <div key={i} style={{ height: '6px' }} />

    return <p key={i} style={{ margin: '2px 0', fontSize: '14px', lineHeight: '1.75', color: '#1f2937' }}>{line}</p>
  })
}

/* ─── Main Component ────────────────────────────────── */
export default function PedagoStudio() {
  const [nav, setNav] = useState<Tool>('seance')
  const [form, setForm] = useState<FormState>({ discipline: '', niveau: '', theme: '', duree: '45 min', objectif: '', competence: '' })
  const [output, setOutput] = useState('')
  const [phase, setPhase] = useState<Phase>('idle')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [showHistory, setShowHistory] = useState(false)

  const up = (k: keyof FormState, v: string) => setForm(f => ({ ...f, [k]: v }))
  const canGen = form.discipline && form.niveau && form.theme && phase !== 'loading'

  const generate = async () => {
    setPhase('loading')
    setOutput('')
    setError('')

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool: nav, ...form }),
      })

      const data = await res.json()

      if (!res.ok || data.error) throw new Error(data.error || 'Erreur serveur')

      setOutput(data.result)
      setPhase('done')

      // Save to history
      const entry: HistoryEntry = {
        id: Date.now(),
        tool: nav,
        label: `${form.discipline} · ${form.niveau} · ${form.theme}`,
        result: data.result,
        badges: [form.discipline, form.niveau, form.duree],
      }
      setHistory(h => [entry, ...h].slice(0, 10))
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur de connexion'
      setError(msg)
      setPhase('error')
    }
  }

  const copy = () => {
    navigator.clipboard?.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const print = () => {
    const w = window.open('', '_blank')!
    w.document.write(`<html><head><title>PedagoStudio — ${form.theme}</title><style>
      body{font-family:Georgia,serif;max-width:800px;margin:40px auto;padding:0 20px;color:#1f2937;line-height:1.7}
      h1{font-size:18px;border-bottom:2px solid #D85A30;padding-bottom:8px;margin-bottom:24px}
      .section-title{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#6b7280;border-bottom:1px solid #e5e7eb;padding-bottom:4px;margin:20px 0 8px}
      p{margin:4px 0;font-size:14px}
      .badge{display:inline-block;padding:3px 10px;background:#fff3ef;color:#D85A30;border-radius:4px;font-size:11px;font-weight:600;margin-right:6px;margin-bottom:12px}
      @media print{@page{margin:2cm}}
    </style></head><body>
    <h1>PedagoStudio — ${NAV.find(n => n.id === nav)?.label}</h1>
    <div>${[form.discipline, form.niveau, form.duree, 'APC · MENA'].map(b => `<span class="badge">${b}</span>`).join('')}</div>
    <div>${output.split('\n').map(line => {
      const t = line.trim()
      if (t.startsWith('**') && t.endsWith('**')) return `<p class="section-title">${t.slice(2, -2)}</p>`
      if (line.startsWith('- ')) return `<p>• ${line.slice(2)}</p>`
      if (t === '') return '<br>'
      return `<p>${line}</p>`
    }).join('')}</div>
    </body></html>`)
    w.document.close()
    w.print()
  }

  const reset = () => { setPhase('idle'); setOutput(''); setError('') }

  const loadHistory = (entry: HistoryEntry) => {
    setNav(entry.tool)
    setOutput(entry.result)
    setPhase('done')
    setShowHistory(false)
  }

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

      {/* ── Top header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: COLORS.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SvgIcon path="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" size={18} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 800, color: COLORS.text, letterSpacing: '-0.02em' }}>PedagoStudio</h1>
            <p style={{ fontSize: '12px', color: COLORS.textLight }}>Outil IA pour enseignants · CEB · APC · MENA Sénégal</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {history.length > 0 && (
            <button onClick={() => setShowHistory(!showHistory)} style={{
              padding: '7px 14px', borderRadius: '8px', border: `1px solid ${COLORS.border}`,
              fontSize: '13px', background: showHistory ? COLORS.primaryLight : COLORS.bgCard,
              color: showHistory ? COLORS.primaryDark : COLORS.textMuted, cursor: 'pointer', fontWeight: 500,
            }}>
              Historique ({history.length})
            </button>
          )}
          <div style={{ fontSize: '11px', color: COLORS.textLight, textAlign: 'right' }}>
            <div>Propulsé par</div>
            <div style={{ fontWeight: 700, color: COLORS.primary }}>Claude Opus 4</div>
          </div>
        </div>
      </div>

      {/* ── History panel ── */}
      {showHistory && (
        <div style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
          <p style={{ fontSize: '12px', fontWeight: 700, color: COLORS.textLight, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
            Dernières générations
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {history.map(entry => (
              <button key={entry.id} onClick={() => loadHistory(entry)} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 14px', borderRadius: '8px', border: `1px solid ${COLORS.border}`,
                background: COLORS.bg, cursor: 'pointer', textAlign: 'left',
              }}>
                <div>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: COLORS.text }}>{entry.label}</p>
                  <p style={{ margin: 0, fontSize: '11px', color: COLORS.textLight }}>
                    {NAV.find(n => n.id === entry.tool)?.label}
                  </p>
                </div>
                <span style={{ fontSize: '11px', color: COLORS.primary }}>Charger →</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Tab nav ── */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
        {NAV.map(item => (
          <button key={item.id} onClick={() => { setNav(item.id); reset() }} style={{
            padding: '9px 18px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer',
            border: `1px solid ${nav === item.id ? COLORS.primary : COLORS.border}`,
            background: nav === item.id ? COLORS.primaryLight : COLORS.bgCard,
            color: nav === item.id ? COLORS.primaryDark : COLORS.textMuted,
            fontWeight: nav === item.id ? 700 : 400,
            transition: 'all 0.12s',
          }}>
            {item.short}
          </button>
        ))}
      </div>

      {/* ── Main layout ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '16px', alignItems: 'start' }}>

        {/* ── Form card ── */}
        <div style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

          <div>
            <label style={labelStyle}>Discipline *</label>
            <select value={form.discipline} onChange={e => up('discipline', e.target.value)} style={selectStyle}>
              <option value="">Sélectionner une discipline...</option>
              {DISCIPLINES.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Niveau *</label>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {NIVEAUX.map(n => (
                <button key={n} onClick={() => up('niveau', n)} style={{
                  padding: '6px 14px', borderRadius: '7px', fontSize: '13px', cursor: 'pointer',
                  border: `1px solid ${form.niveau === n ? COLORS.primary : COLORS.border}`,
                  background: form.niveau === n ? COLORS.primaryLight : COLORS.bgCard,
                  color: form.niveau === n ? COLORS.primaryDark : COLORS.textMuted,
                  fontWeight: form.niveau === n ? 700 : 400,
                }}>
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={labelStyle}>Thème / Leçon *</label>
            <input
              type="text" value={form.theme} onChange={e => up('theme', e.target.value)}
              placeholder="Ex: La phrase interrogative, Les fractions..."
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Durée de la séance</label>
            <div style={{ display: 'flex', gap: '6px' }}>
              {DUREES.map(d => (
                <button key={d} onClick={() => up('duree', d)} style={{
                  padding: '6px 12px', borderRadius: '7px', fontSize: '12px', cursor: 'pointer',
                  border: `1px solid ${form.duree === d ? COLORS.primary : COLORS.border}`,
                  background: form.duree === d ? COLORS.primaryLight : COLORS.bgCard,
                  color: form.duree === d ? COLORS.primaryDark : COLORS.textMuted,
                  fontWeight: form.duree === d ? 700 : 400,
                }}>
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={labelStyle}>Objectif spécifique</label>
            <textarea
              value={form.objectif} onChange={e => up('objectif', e.target.value)} rows={3}
              placeholder="Décrire l'objectif d'apprentissage (optionnel)..."
              style={{ ...inputStyle, resize: 'vertical', minHeight: '72px' }}
            />
          </div>

          <div>
            <label style={labelStyle}>Compétence APC visée</label>
            <input
              type="text" value={form.competence} onChange={e => up('competence', e.target.value)}
              placeholder="Ex: Communiquer à l'écrit en langue française..."
              style={inputStyle}
            />
          </div>

          <button onClick={generate} disabled={!canGen} style={{
            padding: '13px 16px', borderRadius: '9px', fontSize: '14px', fontWeight: 700,
            background: canGen ? COLORS.primary : '#f3f4f6',
            color: canGen ? '#fff' : COLORS.textLight,
            border: 'none', cursor: canGen ? 'pointer' : 'not-allowed', width: '100%',
            transition: 'opacity 0.15s, background 0.15s',
            letterSpacing: '0.01em',
          }}>
            {phase === 'loading' ? '⏳ Génération en cours...' : '✨ Générer avec l\'IA'}
          </button>

          {error && (
            <div style={{ padding: '10px 12px', borderRadius: '8px', background: '#fef2f2', border: '1px solid #fecaca', fontSize: '12px', color: '#dc2626', lineHeight: 1.5 }}>
              ⚠️ {error}
            </div>
          )}

          {/* Stack info */}
          <div style={{ paddingTop: '12px', borderTop: `1px solid ${COLORS.border}` }}>
            <p style={{ fontSize: '10px', fontWeight: 700, color: COLORS.textLight, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Architecture</p>
            {[
              { label: 'Next.js 14 (App Router)', color: COLORS.text },
              { label: 'Anthropic API · Claude Opus 4', color: COLORS.primary },
              { label: 'Vercel Edge Network', color: COLORS.blue },
            ].map(({ label, color }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '5px' }}>
                <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: color, flexShrink: 0 }} />
                <span style={{ fontSize: '11px', color: COLORS.textMuted }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Output card ── */}
        <div style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: '12px', minHeight: '600px', display: 'flex', flexDirection: 'column' }}>

          {/* Output header */}
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${COLORS.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: COLORS.text }}>
                {NAV.find(n => n.id === nav)?.label}
              </h2>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: COLORS.textLight }}>
                Programme officiel · MENA Sénégal
              </p>
            </div>

            {phase === 'done' && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={copy} style={actionBtnStyle}>
                  {copied ? '✓ Copié' : 'Copier'}
                </button>
                <button onClick={print} style={actionBtnStyle}>
                  Imprimer
                </button>
                <button onClick={reset} style={actionBtnStyle}>
                  Nouveau
                </button>
              </div>
            )}
          </div>

          {/* Output body */}
          <div style={{ flex: 1, padding: '24px 28px', overflowY: 'auto' }}>

            {phase === 'idle' && (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', padding: '60px 0' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: COLORS.bg, border: `1px solid ${COLORS.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <SvgIcon path="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" size={24} color={COLORS.textLight} />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ margin: '0 0 6px', fontSize: '16px', fontWeight: 600, color: COLORS.textMuted }}>Prêt à générer</p>
                  <p style={{ margin: 0, fontSize: '13px', color: COLORS.textLight, lineHeight: 1.6 }}>
                    Remplissez la discipline, le niveau et le thème<br />puis cliquez sur « Générer avec l&apos;IA »
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', maxWidth: '480px', marginTop: '24px' }}>
                  {[
                    { title: 'Fiche de séance', desc: '4 phases · APC · Différenciation', color: COLORS.primary },
                    { title: 'Évaluation', desc: 'Parties A·B·C · Barème · Correction', color: COLORS.blue },
                    { title: 'Progression', desc: '3 trimestres · Compétences CEB', color: COLORS.green },
                  ].map(({ title, desc, color }) => (
                    <div key={title} style={{ padding: '14px', borderRadius: '10px', background: COLORS.bg, border: `1px solid ${COLORS.border}` }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, marginBottom: '8px' }} />
                      <p style={{ margin: '0 0 3px', fontSize: '13px', fontWeight: 700, color: COLORS.text }}>{title}</p>
                      <p style={{ margin: 0, fontSize: '11px', color: COLORS.textLight, lineHeight: 1.4 }}>{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {phase === 'loading' && (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px', padding: '60px 0' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: `2.5px solid ${COLORS.border}`, borderTopColor: COLORS.primary, animation: 'spin 0.85s linear infinite' }} />
                <div style={{ textAlign: 'center' }}>
                  <p style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 600, color: COLORS.text }}>Génération en cours</p>
                  <p style={{ margin: 0, fontSize: '13px', color: COLORS.textMuted }}>
                    {form.discipline} · {form.niveau} · {form.theme}
                  </p>
                  <p style={{ margin: '8px 0 0', fontSize: '12px', color: COLORS.textLight }}>
                    Claude Opus 4 rédige votre document pédagogique...
                  </p>
                </div>
              </div>
            )}

            {phase === 'done' && output && (
              <div style={{ animation: 'fadeUp 0.3s ease' }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                  <Badge label={form.discipline} color={COLORS.primary} />
                  <Badge label={form.niveau} color={COLORS.blue} />
                  <Badge label={form.duree} color={COLORS.green} />
                  <Badge label="APC · MENA" color={COLORS.amber} />
                </div>
                <div>{renderOutput(output)}</div>
              </div>
            )}

            {phase === 'error' && (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '14px' }}>
                <p style={{ fontSize: '15px', fontWeight: 600, color: '#dc2626' }}>Erreur de génération</p>
                <p style={{ fontSize: '13px', color: COLORS.textMuted, textAlign: 'center' }}>{error}</p>
                <button onClick={reset} style={actionBtnStyle}>Réessayer</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '12px', color: COLORS.textLight }}>
        PedagoStudio · Outil pédagogique IA pour le système éducatif sénégalais · CEB · APC · MENA
      </div>
    </div>
  )
}

/* ─── Shared styles ─────────────────────────────────── */
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '11px', fontWeight: 700, color: '#6b7280',
  marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em',
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 11px', borderRadius: '8px',
  border: '1px solid #e5e7eb', fontSize: '13px', color: '#111827',
  outline: 'none', boxSizing: 'border-box', background: '#fff',
}

const selectStyle: React.CSSProperties = {
  ...inputStyle, cursor: 'pointer',
}

const actionBtnStyle: React.CSSProperties = {
  padding: '7px 14px', borderRadius: '8px', border: '1px solid #e5e7eb',
  fontSize: '12px', background: '#fff', cursor: 'pointer', color: '#374151', fontWeight: 500,
}
