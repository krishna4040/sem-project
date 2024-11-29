import express from "express"
import { listItem, searchItems } from "../controller/item.js"
import { requireAuth } from "@clerk/express"

const router = express.Router()

router.post("/list-item", requireAuth(), listItem)
router.get("/search-items", searchItems)

export default router
