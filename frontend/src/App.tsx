import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './features/auth/components/Login'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  )
}

export default App
