import express from "express"
import { listItem, searchItems } from "../controller/item.js"

const router = express.Router()

router.post("/list-item", listItem)
router.get("/search-items", searchItems)

export default router
