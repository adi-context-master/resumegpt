import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Aditya Pratap Singh - AI CV Assistant',
  description: 'Interactive CV chatbot for Aditya Pratap Singh - Senior Product Owner',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
