import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { NuqsAdapter } from 'nuqs/adapters/react-router/v7'
import { ToastProvider } from '@/contexts/ToastContext'
import MainLayout from './components/layout/MainLayout'
import WaitListPage from './pages/WaitListPage'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

function App() {
  return (
    <BrowserRouter>
      <NuqsAdapter>
        <ToastProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MainLayout>
              <Routes>
                <Route path="/waitlist" element={<WaitListPage />} />
                <Route path="*" element={<Navigate to="/waitlist" replace />} />
              </Routes>
            </MainLayout>
          </LocalizationProvider>
        </ToastProvider>
      </NuqsAdapter>
    </BrowserRouter>
  )
}

export default App
