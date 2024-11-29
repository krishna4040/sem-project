import db from "../utils/db.js"
import { getWebhookData } from "../utils/getWebhookData.js"

export const createUser = async (req, res) => {
  const SIGNING_SECRET = process.env.CREATE_USER_SIGNING_SECRET

  const { success, message, webhook } = getWebhookData({
    headers: req.headers,
    payload: req.body,
    signingSecret: SIGNING_SECRET,
  })

  try {
    if (success) {
      const signupData = webhook.data
      await db.user.create({
        data: {
          email: signupData.email_addresses.find(
            (email) => email.id === primary_phone_number_id,
          ).email_address,
          name: `${signupData.first_name} ${signupData.last_name}`,
          clerkUserId: signupData.id,
          phoneNumber: signupData.phone_numbers.find(
            (num) => num.id === primary_phone_number_id,
          ).phone_number,
          profileImage: signupData.profile_image_url,
        },
      })

      res
        .status(200)
        .json({ success: true, message: "user sign up successful" })
    } else {
      res.status(404).json({ success, message })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
}

export const deleteUser = async (req, res) => {
  const SIGNING_SECRET = process.env.DELETE_USER_SIGNING_SECRET

  const { success, message, webhook } = getWebhookData({
    headers: req.headers,
    payload: req.body,
    signingSecret: SIGNING_SECRET,
  })

  try {
    if (success) {
      // delete successful
      // database call goes here

      res
        .status(200)
        .json({ success: true, message: "user profile deleted successfully" })
    } else {
      res.status(404).json({ success, message })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
}

export const updateUser = async (req, res) => {
  const SIGNING_SECRET = process.env.UPDATE_USER_SIGNING_SECRET

  const { success, message, webhook } = getWebhookData({
    headers: req.headers,
    payload: req.body,
    signingSecret: SIGNING_SECRET,
  })

  try {
    if (success) {
      // update successful
      // database call goes here

      res
        .status(200)
        .json({ success: true, message: "user profile updated successfully" })
    } else {
      res.status(404).json({ success, message })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
}
