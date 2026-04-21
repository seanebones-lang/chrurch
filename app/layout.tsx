import type { Metadata } from 'next'
import { Fraunces, Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ChatBot from '@/components/ChatBot'
import { CHURCH_NAME } from '@/lib/church-info'

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://harvestfbc.org')

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: `%s | ${CHURCH_NAME}`,
    default: `${CHURCH_NAME} — Trust and Obey Jesus`,
  },
  description:
    'Multigenerational church in DeSoto, TX — Sunday worship at 10:00 AM, Tuesday Bible study at 7:00 PM. Leading people to trust and obey Jesus.',
  openGraph: {
    siteName: CHURCH_NAME,
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="font-sans antialiased relative">
        <div className="page-atmosphere" aria-hidden />
        <Navbar />
        <main className="pt-16 relative z-[1]">{children}</main>
        <Footer />
        <ChatBot />
      </body>
    </html>
  )
}
