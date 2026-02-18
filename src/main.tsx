import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Amplify } from 'aws-amplify'
import './index.css'
import App from './App.tsx'

const amplifyOutputsPath = '../amplify_outputs.json'

void import(/* @vite-ignore */ amplifyOutputsPath)
  .then((module) => {
    Amplify.configure(module.default ?? module)
  })
  .catch(() => {
    // Allow app boot without local Amplify outputs during initial setup.
  })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
