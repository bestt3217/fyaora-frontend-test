import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Box } from '@mui/material'
import Header from './components/layout/Header'
import WaitListPage from './pages/WaitListPage'

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Box component="main">
        <Routes>
          <Route path="/waitlist" element={<WaitListPage />} />
          <Route path="*" element={<Navigate to="/waitlist" replace />} />
        </Routes>
      </Box>
    </BrowserRouter>
  )
}

export default App
