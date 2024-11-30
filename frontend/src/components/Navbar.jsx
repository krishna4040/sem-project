import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react"
import React from "react"
import { Link, NavLink } from "react-router-dom"
import icon from "../../public/favicon.ico"

const activeClass = ({ isActive }) => (isActive ? "text-secondary-dark" : "")

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between p-3">
      <Link to="/">
        <img src={icon} alt="logo" className="w-[30px]" />
      </Link>
      <ul className="flex gap-5">
        <li>
          <NavLink to="/view-items" className={activeClass}>
            View Items
          </NavLink>
        </li>
        <li>
          <NavLink to="/list-items" className={activeClass}>
            List Items
          </NavLink>
        </li>
        <li>
          <NavLink to="/create-workshop" className={activeClass}>
            Create Workshop
          </NavLink>
        </li>
      </ul>
      <div className="flex gap-5">
        <SignedIn>
          <UserButton />
          <NavLink to="/dashboard" className={activeClass}>
            Dashboard
          </NavLink>
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal" />
          <SignUpButton mode="modal" />
        </SignedOut>
      </div>
    </nav>
  )
}

export default Navbar
