import Header from '@/components/Header.jsx'

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow">{children}</main>
    </div>
  )
}
