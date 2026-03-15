import { Stack } from '@mui/material'
import Header from './Header'

type MainLayoutProps = {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      <Header />
      <Stack component="main" flex={1} sx={{ py: 5, px: 3 }}>
        {children}
      </Stack>
    </>
  )
}
