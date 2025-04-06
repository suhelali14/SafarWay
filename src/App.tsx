import { Outlet } from 'react-router-dom'
import { Header } from './components/layout/header'

export function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  )
}
