import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Buy-to-Let Property Calculator',
  description: 'Calculate the viability of your buy-to-let property investment with accurate stamp duty, ROI, and cash flow projections',
  keywords: 'buy to let, property investment, stamp duty calculator, BTL calculator, rental yield, property ROI',
  authors: [{ name: 'BTL Calculator' }],
  openGraph: {
    title: 'Buy-to-Let Property Calculator',
    description: 'Calculate the viability of your buy-to-let property investment',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}