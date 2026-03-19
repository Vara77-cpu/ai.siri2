"use client"

import { SessionProvider } from "next-auth/react"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          background: "#000",
          color: "#fff",
          fontFamily: "Arial, sans-serif",
          minHeight: "100vh"
        }}
      >
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}