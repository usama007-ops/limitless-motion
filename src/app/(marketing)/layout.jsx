import Header from '@/components/Header.jsx'
import Footer from '@/components/Footer.jsx'

export default function MarketingLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  )
}
