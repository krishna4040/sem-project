import React from "react"
import { Home, Signin, Signup } from "./pages"
// import { AuthRoutesGuard, ProtectedRoutesGuard } from "./guards"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import RootLayout from "./RootLayout"

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <Home /> },
      {
        // element: <AuthRoutesGuard />,
        children: [
          { path: "/sign-up", element: <Signup /> },
          { path: "/sign-in", element: <Signin /> },
        ],
      },
      // {
      //   element: <ProtectedRoutesGuard />,
      //   path: 'dashboard',
      //   children: [
      //     { path: '/dashboard', element: <DashboardPage /> },
      //     { path: '/dashboard/invoices', element: <InvoicesPage /> },
      //   ],
      // },
    ],
  },
])

const App = () => {
  return <RouterProvider router={router} />
}

export default App
