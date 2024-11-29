import express from "express"
import { createUser, deleteUser, updateUser } from "../controller/auth.js"

const router = express.Router()

router.post("/sign-up", createUser)
router.post("/delete-user", deleteUser)
router.post("/update-user", updateUser)

export default router
