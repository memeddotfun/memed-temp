import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import type { Metadata } from "next"
import { ToastProvider } from "@/components/ui/custom-toast";
import RecaptchaProvider from "@/components/recaptcha-provider";

export const metadata: Metadata = {
  title: "Memed.fun",
  description: "Memed.fun",
  icons: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      url: 'icon/favicon-32x32.png',
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <RecaptchaProvider>
          <ToastProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
              {children}
            </ThemeProvider>
          </ToastProvider>
        </RecaptchaProvider>
      </body>
    </html>
  )
}
