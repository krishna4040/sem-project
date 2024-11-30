import React from "react"
import { Home } from "./pages"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import RootLayout from "./RootLayout"
import "./App.css"

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
        path: "explore",
        element: "Explore Items and workshops",
      },
      {
        path: "list-items",
        element: "List-items",
      },
      {
        path: "create-workshop",
        element: "Create-workshop",
      },
      {
        path: "dashboard",
        children: [
          {
            path: "my-dashboard",
            element: "My dashboard",
          },
        ],
      },
    ],
  },
])

const App = () => {
  return <RouterProvider router={router} />
}

export default App
