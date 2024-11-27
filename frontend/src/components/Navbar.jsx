import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react"
import React from "react"
import { NavLink } from "react-router-dom"

const Navbar = () => {
  return (
    <nav>
      <ul className="flex gap-5">
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? "text-red-400" : "")}
        >
          Home
        </NavLink>
        <SignedIn>
          <UserButton />
          <NavLink
            to="/dashboard"
            className={({ isActive }) => (isActive ? "text-red-400" : "")}
          >
            Dashboard
          </NavLink>
        </SignedIn>
        <SignedOut>
          <NavLink
            to="/sign-up"
            className={({ isActive }) => (isActive ? "text-red-400" : "")}
          >
            Signup
          </NavLink>
          <NavLink
            to="/sign-in"
            className={({ isActive }) => (isActive ? "text-red-400" : "")}
          >
            Signin
          </NavLink>
          {/* <SignInButton /> */}
          {/* <SignUpButton /> */}
        </SignedOut>
      </ul>
    </nav>
  )
}

export default Navbar
