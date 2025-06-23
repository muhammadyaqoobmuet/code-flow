import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import CreateRoomPage from './pages/CreateRoom/CreateRoomPage.jsx'
import { Toaster } from 'sonner'

import JoinRoom from './pages/JoinRoom/page.jsx'
import Home from './pages/Home/Home.jsx'
import Room from './pages/Room/page.jsx'

createRoot(document.getElementById('root')).render(

  <>


    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/create-room" element={<CreateRoomPage />} />
        <Route path="/join-room" element={<JoinRoom />} />
        <Route path="/editor/:roomId" element={<Room />} />
      </Routes>

    </BrowserRouter>
    <Toaster richColors={true} position='top-right' />

  </>

)
