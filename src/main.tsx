import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Amplify } from 'aws-amplify'
<<<<<<< HEAD
import amplifyOutputs from '../amplify_outputs.json'
=======
>>>>>>> 34433ffab3211f9f3ee13bcc8d767277ed52e10a
import './index.css'
import App from './App.tsx'
import outputs from '../amplify_outputs.json'

<<<<<<< HEAD
Amplify.configure(amplifyOutputs)
=======
Amplify.configure(outputs)
>>>>>>> 34433ffab3211f9f3ee13bcc8d767277ed52e10a

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
