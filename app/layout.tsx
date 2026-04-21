import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ChatBot from '@/components/ChatBot'
import { CHURCH_NAME } from '@/lib/church-info'

export const metadata: Metadata = {
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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Navbar />
        <main className="pt-16">{children}</main>
        <Footer />
        <ChatBot />
      </body>
    </html>
  )
}
