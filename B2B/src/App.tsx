import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home/Home.tsx';
import Dashboard from './pages/Dashboard/Dashboard.tsx';

function App() {
  return (
    <div>
      <BrowserRouter>
        <nav>
          <Link to="/dashboard">Dashboard</Link>
        </nav>

        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path='/dashboard' element={<Dashboard />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
