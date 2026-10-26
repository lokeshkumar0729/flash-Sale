import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function CustomerLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8">
        <Outlet />
      </main>
      <footer className="border-t border-line bg-white py-6 text-center text-sm text-slate-500">
        FlashSale · a demo store. Payments are simulated and no real orders are shipped.
      </footer>
    </div>
  )
}
