import express from "express"
import {
  addAccountNumber,
  createWorkshop,
  getDashboardData,
  getItemsListed,
  getMyProfile,
  getPickupRequests,
  getUserDetails,
  getWorkshop,
  getWorkshopsHeld,
  handlePickupRequest,
  updateAccountNumber,
} from "../controller/dashboard.js"
import { requireAuth } from "@clerk/express"

const router = express.Router()

router.get("/get-dashboard-data", requireAuth(), getDashboardData)
router.get("/get-items-listed", requireAuth(), getItemsListed)
router.get("/get-pickup-requests", requireAuth(), getPickupRequests)
router.post("/handle-pickup-request", requireAuth(), handlePickupRequest)

router.get("/get-workshops-held", requireAuth(), getWorkshopsHeld)
router.get("/get-workshop-details/:workshopId", getWorkshop)
router.post("/create-workshop", requireAuth(), createWorkshop)
router.post("/add-account-number", requireAuth(), addAccountNumber)
router.put("/update-account-number", requireAuth(), updateAccountNumber)

router.get("/get-user-details", getUserDetails)
router.get("/get-my-profile", requireAuth(), getMyProfile)

export default router
