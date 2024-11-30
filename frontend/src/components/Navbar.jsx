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
import { Button } from "./ui/button"

const activeClass = ({ isActive }) =>
  isActive
    ? "text-secondary-dark underline underline-offset-8 decoration-wavy decoration-2"
    : ""

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between p-5 bg-secondary-light shadow-md ">
      <Link to="/">
        <img src={icon} alt="logo" className="w-[30px]" />
      </Link>
      <ul className="flex gap-10 ml-32">
        <li>
          <NavLink to="/explore" className={activeClass}>
            Explore
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
          <NavLink to="/dashboard/my-dashboard" className={activeClass}>
            <Button className="bg-primary-dark">Dashboard</Button>
          </NavLink>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <Button className="bg-primary-dark">
            <SignInButton mode="modal" />
          </Button>
          <Button className="bg-primary-dark">
            <SignUpButton mode="modal" />
          </Button>
        </SignedOut>
      </div>
    </nav>
  )
}

export default Navbar
