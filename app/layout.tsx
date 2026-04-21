import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ChatBot from '@/components/ChatBot'

export const metadata: Metadata = {
  title: {
    template: '%s | Harvest Church',
    default: 'Harvest Church — Rooted in Faith, Growing in Love',
  },
  description: 'Welcome to Harvest Church. Join us for Sunday worship, sermons, events, and community.',
  openGraph: {
    siteName: 'Harvest Church',
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
