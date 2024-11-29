import express from "express"
import {
  addUserDetails,
  createUser,
  deleteUser,
  updateUser,
} from "../controller/auth.js"

const router = express.Router()

router.post("/sign-up", express.raw({ type: "application/json" }), createUser)
router.post(
  "/delete-user",
  express.raw({ type: "application/json" }),
  deleteUser,
)
router.post(
  "/update-user",
  express.raw({ type: "application/json" }),
  updateUser,
)
router.post("/add-details", express.json(), addUserDetails)

export default router
