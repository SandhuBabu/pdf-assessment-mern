import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { UserProvider } from './context/UserContext.jsx'


const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <BrowserRouter>
  // User Context Provider wrapped to access user data in all components in app
    <UserProvider>
      <App />
    </UserProvider>
  </BrowserRouter>
)
