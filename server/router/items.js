import express from "express"
import {
  getItem,
  listItem,
  searchItems,
  createPickupRequest,
  deleteItem,
  giveFeedback,
  updateItem,
} from "../controller/item.js"
import { requireAuth } from "@clerk/express"

const router = express.Router()

router.post("/list-item", requireAuth(), listItem)
router.put("/update-item/:itemId", requireAuth(), updateItem)
router.delete("/delete-item/:itemId", requireAuth(), deleteItem)

router.get("/search-items", searchItems)
router.get("/get-item/:itemId", getItem)
router.post("/create-pickup-request", requireAuth(), createPickupRequest)
router.post("/create-feedback", requireAuth(), giveFeedback)

export default router
