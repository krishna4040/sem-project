import { listItemSchema } from "../schemas/item"
import db from "../utils/db"
import { zodError } from "../utils/zodError"

export const listItem = async (req, res) => {
  try {
    // Validate the request body with Zod schema
    const data = listItemSchema.parse(req.body)

    const {
      title,
      description,
      category,
      latitude,
      longitude,
      address,
      specificDetails,
    } = data

    const userId = req.user.id // Assuming the user ID is attached to req.user

    // Create the base item listing
    const newItem = await db.itemListing.create({
      data: {
        title,
        description,
        category,
        latitude,
        longitude,
        address,
        producerId: userId,
      },
    })

    // Handle category-specific details
    if (specificDetails) {
      const categorySpecificData = { ...specificDetails, itemId: newItem.id }

      switch (category) {
        case "EWASTE":
          await db.eWaste.create({ data: categorySpecificData })
          break
        case "PLASTIC":
          await db.plastic.create({ data: categorySpecificData })
          break
        case "STATIONARY":
          await db.stationary.create({ data: categorySpecificData })
          break
        case "CLOTHES":
          await db.clothes.create({ data: categorySpecificData })
          break
        case "FURNITURE":
          await db.furniture.create({ data: categorySpecificData })
          break
        case "FOOD":
          await db.food.create({ data: categorySpecificData })
          break
        case "OTHER":
          await db.other.create({ data: categorySpecificData })
          break
        default:
          throw new Error("Unsupported category")
      }
    }

    // Return the newly created item listing
    return res.status(201).json({ success: true, data: newItem.id })
  } catch (error) {
    console.error("Error creating item listing:", error)

    // Custom error handling for Zod validation errors
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: zodError(error),
      })
    }

    // Handle other errors (e.g., database issues)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}
