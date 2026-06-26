import '@/app/globals.css'
import { Providers } from '@/lib/providers'
import ScrollToTop from '@/components/ScrollToTop'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Limitless Motion',
  description: 'Transform your body, mind, and spirit with personalized fitness and nutrition plans.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <ScrollToTop>{children}</ScrollToTop>
        </Providers>
      </body>
    </html>
  )
}
