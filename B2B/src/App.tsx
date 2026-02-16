import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home/Home.tsx';
import Dashboard from './pages/Dashboard/Dashboard.tsx';
import Auth from './pages/Auth/Auth.tsx';
import PrivacyPolicy from './pages/PrivacyPolicy/PrivacyPolicy.tsx';
import About from './pages/About/About.tsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/auth' element={<Auth />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/about' element={<About />} />
        <Route path='/privacy-policy' element={<PrivacyPolicy />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
