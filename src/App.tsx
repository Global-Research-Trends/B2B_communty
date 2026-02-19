import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home.tsx';
import Dashboard from './pages/Dashboard/Dashboard.tsx';
import Auth from './pages/Auth/Auth.tsx';
import PrivacyPolicy from './pages/PrivacyPolicy/PrivacyPolicy.tsx';
import About from './pages/About/About.tsx';
import Questionnaire from './pages/Questionare/question.tsx';
import { TestQuestionnaire } from './pages/Questionare/question.tsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/auth' element={<Auth />} />
        <Route path='/questionnaire' element={<Questionnaire />} />
        <Route path='/test-questionnaire' element={<TestQuestionnaire />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/about' element={<About />} />
        <Route path='/privacy-policy' element={<PrivacyPolicy />} />
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
