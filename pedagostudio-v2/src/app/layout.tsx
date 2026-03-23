import type { Metadata } from 'next'
import './globals.css'


export const metadata: Metadata = {
  title: 'PedagoStudio — Outil IA pour enseignants sénégalais',
  description: 'Générateur de fiches de séance, évaluations et progressions annuelles selon le programme CEB du MENA Sénégal',
  icons: { icon: '/favicon.svg' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
