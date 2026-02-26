import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import BackgroundEffects from '@/components/ui/BackgroundEffects'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ZBank - Digital Banking',
  description: 'Modern digital banking experience',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <BackgroundEffects />
        <div className="relative z-10">
          {children}
        </div>
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: 'rgba(26, 26, 46, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#fff',
            },
          }}
        />
      </body>
    </html>
  )
}
