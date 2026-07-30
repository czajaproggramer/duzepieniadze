import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Account } from './pages/Account'
import { Admin } from './pages/Admin'
import { Booking } from './pages/Booking'
import { Home } from './pages/Home'
import { Login } from './pages/Login'

export function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rezerwacja" element={<Booking />} />
        <Route path="/logowanie" element={<Login />} />
        <Route path="/konto" element={<Account />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}
