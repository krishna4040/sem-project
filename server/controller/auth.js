import { addUserDetailsSchema } from "../schemas/auth.js"
import db from "../utils/db.js"
import { getWebhookData } from "../utils/getWebhookData.js"
import { zodError } from "../utils/zodError.js"

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
      const userId = webhook.data.id
      await db.user.delete({ where: { clerkUserId: userId } })
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
      const updateData = webhook.data

      const primaryEmail = updateData.email_addresses.find(
        (email) => email.id === updateData.primary_email_address_id,
      )?.email_address

      const phoneNumber = updateData.phone_numbers.find(
        (num) => num.id === updateData.primary_phone_number_id,
      )?.phone_number

      const fullName = `${updateData.first_name || ""} ${
        updateData.last_name || ""
      }`.trim()

      // Update user in the database
      await db.user.update({
        where: {
          clerkUserId: updateData.id,
        },
        data: {
          email: primaryEmail,
          name: fullName || null,
          profileImage: updateData.profile_image_url,
          phoneNumber: phoneNumber || null,
        },
      })

      res
        .status(200)
        .json({ success: true, message: "User profile updated successfully" })
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

export const addUserDetails = async (req, res) => {
  try {
    // Validate input using the Zod schema
    const validatedData = addUserDetailsSchema.parse(req.body)

    // Destructure validated data
    const { role, userType, organizationType, document_urls, documentType } =
      validatedData

    // Create user details object
    const userDetailsData = {
      role,
      userType,
      ...(userType === "organization" && {
        organizationType,
        document_urls: { set: document_urls }, // Assuming Prisma uses `set` for arrays
        documentType,
      }),
    }

    // Save to database
    const newUserDetails = await prisma.userDetails.create({
      data: userDetailsData,
    })

    // Respond with the newly created user details
    res.status(201).json({
      message: "User details added successfully",
      data: newUserDetails,
    })
  } catch (error) {
    // Handle validation errors
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Validation failed",
        errors: zodError(error),
      })
    }

    // Handle other errors
    console.error("Error adding user details:", error)
    res.status(500).json({
      message: "An error occurred while adding user details",
    })
  }
}
