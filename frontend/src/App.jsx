import React from 'react'
import AppRoutes from './routes/AppRoutes'
import { UserProvider } from './context/user.context.jsx'
import { Toaster } from "react-hot-toast"

const App = () => {
  return (
    <UserProvider>
      <Toaster position="top-center" reverseOrder={false} />
      <AppRoutes />
    </UserProvider>
  )
}

export default App
