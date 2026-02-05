import './globals.css'

export const metadata = {
  title: 'MoltFire Dashboard',
  description: 'Personal AI Assistant Control Center',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#ff6b35',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#ff6b35" />
      </head>
      <body>{children}</body>
    </html>
  )
}