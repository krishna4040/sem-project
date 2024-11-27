import { Outlet, useNavigate } from "react-router-dom"
import { Footer, Navbar, Show } from "./components"
import { ClerkProvider } from "@clerk/clerk-react"

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

export default function RootLayout() {
  const navigate = useNavigate()
  const dndNavbar = []
  const dndFooter = []

  return (
    <ClerkProvider
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}
      publishableKey={PUBLISHABLE_KEY}
    >
      <Show when={!dndNavbar.includes(location.pathname)}>
        <header>
          <Navbar />
        </header>
      </Show>
      <main>
        <Outlet />
      </main>
      <Show when={!dndFooter.includes(location.pathname)}>
        <Footer />
      </Show>
    </ClerkProvider>
  )
}
