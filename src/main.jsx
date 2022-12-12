import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import Login from './Login'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<App />} />
        <Route exact path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  // </React.StrictMode>,
)
