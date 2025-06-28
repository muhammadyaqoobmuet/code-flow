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
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorFallback } from './components/ui/ErrorFallback'
import WebRtcDemoPage from './pages/webrtc-temp-pag/webRtc'

createRoot(document.getElementById('root')).render(

  <>



    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/rtc" element={< WebRtcDemoPage />} />
        <Route path="/create-room" element={<CreateRoomPage />} />
        <Route path="/join-room" element={<JoinRoom />} />
        <Route path="/editor/:roomId" element={<Room />} />
      </Routes>

    </BrowserRouter>
    <Toaster richColors={true} position='top-right' />


  </>

)
