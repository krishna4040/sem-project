import {
  listItemSchema,
  itemSearchFiltersSchema,
  createPickupRequestSchema,
} from "../schemas/item.js"
import db from "../utils/db.js"
import { zodError } from "../utils/zodError.js"

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

    const user = await db.user.findUnique({
      where: {
        clerkUserId: req.auth.userId,
      },
    })

    // Create the base item listing
    const newItem = await db.itemListing.create({
      data: {
        title,
        description,
        category,
        latitude,
        longitude,
        address,
        producerId: user.id,
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

export const searchItems = async (req, res) => {
  try {
    const encodedQuery = req.query.filters
    if (!encodedQuery) {
      return res
        .status(400)
        .json({ success: false, message: "Missing query parameter" })
    }

    const decodedQuery = JSON.parse(decodeURIComponent(encodedQuery))

    const filters = itemSearchFiltersSchema.parse(decodedQuery)

    const {
      title,
      category,
      latitude,
      longitude,
      maxDistance,
      producerId,
      createdAt,
      specificDetails,
      limit = 10,
      offset = 0,
    } = filters

    const where = {
      receiverId: null,
    }

    // Add filters to the where clause
    if (title) where.title = { contains: title, mode: "insensitive" }
    if (category) where.category = category
    if (producerId) where.producerId = producerId

    // Filter by creation date
    if (createdAt) {
      where.createdAt = {}
      if (createdAt.from) where.createdAt.gte = new Date(createdAt.from)
      if (createdAt.to) where.createdAt.lte = new Date(createdAt.to)
    }

    // Specific details filter
    if (specificDetails) {
      where.specificDetails = {
        some: specificDetails,
      }
    }

    // Geospatial query for max distance (if latitude and longitude provided)
    let geoFilter = {}
    if (
      latitude !== undefined &&
      longitude !== undefined &&
      maxDistance !== undefined
    ) {
      geoFilter = {
        AND: [
          {
            latitude: { gte: latitude - maxDistance / 111.12 },
          },
          {
            latitude: { lte: latitude + maxDistance / 111.12 },
          },
          {
            longitude: {
              gte: longitude - maxDistance / (111.12 * Math.cos(latitude)),
            },
          },
          {
            longitude: {
              lte: longitude + maxDistance / (111.12 * Math.cos(latitude)),
            },
          },
        ],
      }
    }

    // Combine filters
    const combinedFilters = {
      ...where,
      ...geoFilter,
    }

    // Query the database
    const items = await db.itemListing.findMany({
      where: combinedFilters,
      include: {
        producer: true, // Including producer details (if needed)
        specificDetails: true, // Including specific item details
      },
      take: limit,
      skip: offset,
      orderBy: { createdAt: "desc" },
    })

    const totalCount = await db.itemListing.count({
      where: combinedFilters,
    })

    return res.status(200).json({
      success: true,
      data: {
        paginatedItems: items,
        total: totalCount,
      },
    })
  } catch (error) {
    console.error("Error searching items:", error)

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: zodError(error),
      })
    }

    // Handle other errors
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

export const getItem = async (req, res) => {
  const { itemId } = req.params

  // Ensure `itemId` is provided
  if (!itemId || typeof itemId !== "string") {
    return res
      .status(400)
      .json({ error: "Invalid or missing itemId parameter." })
  }

  try {
    // Fetch the item details along with all related data
    const item = await db.itemListing.findUnique({
      where: { id: itemId },
      include: {
        producer: true,
        eWaste: true,
        plastic: true,
        stationary: true,
        clothes: true,
        furniture: true,
        food: true,
        other: true,
      },
    })

    if (!item) {
      return res.status(404).json({ error: "Item not found." })
    }

    return res.status(200).json({ item })
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ error: "An error occurred while retrieving the item." })
  }
}

export const updateItem = async (req, res) => {
  try {
    // Fetch the user based on `clerkUserId`
    const user = await db.user.findUnique({
      where: {
        clerkUserId: req.auth.userId,
      },
    })

    if (!user) {
      return res.status(404).json({ error: "User not found." })
    }

    // Parse and validate the request body using Zod
    const validation = updateItemSchema.safeParse(req.body)
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.errors })
    }

    const {
      itemId,
      title,
      description,
      category,
      latitude,
      longitude,
      address,
      status,
      categoryDetails,
    } = validation.data

    // Find the item to update and ensure the user owns it
    const item = await db.itemListing.findUnique({
      where: { id: itemId },
    })

    if (!item) {
      return res.status(404).json({ error: "Item not found." })
    }

    if (item.producerId !== user.id) {
      return res
        .status(403)
        .json({ error: "You are not authorized to update this item." })
    }

    // Update the general `ItemListing` fields
    const updatedItem = await db.itemListing.update({
      where: { id: itemId },
      data: {
        title,
        description,
        category,
        latitude,
        longitude,
        address,
        status,
      },
    })

    // Update the category-specific fields if provided
    if (categoryDetails && category) {
      const categoryModelMap = {
        EWASTE: "eWaste",
        PLASTIC: "plastic",
        STATIONARY: "stationary",
        CLOTHES: "clothes",
        FURNITURE: "furniture",
        FOOD: "food",
        OTHER: "other",
      }

      const categoryModel = categoryModelMap[category]

      if (categoryModel) {
        await db[categoryModel].update({
          where: { itemId },
          data: categoryDetails,
        })
      }
    }

    return res
      .status(200)
      .json({ message: "Item updated successfully.", item: updatedItem })
  } catch (error) {
    console.error("Error updating item:", error)
    return res
      .status(500)
      .json({ error: "An error occurred while updating the item." })
  }
}

export const deleteItem = async (req, res) => {
  try {
    const user = await db.user.findUnique({
      where: {
        clerkUserId: req.auth.userId,
      },
    })

    if (!user) {
      return res.status(404).json({ error: "User not found." })
    }

    const { itemId } = req.params

    if (!itemId) {
      return res.status(400).json({ error: "Item ID is required." })
    }

    const item = await db.itemListing.findUnique({
      where: { id: itemId },
    })

    if (!item) {
      return res.status(404).json({ error: "Item not found." })
    }

    if (item.producerId !== user.id) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this item." })
    }

    const categoryModelMap = {
      EWASTE: "eWaste",
      PLASTIC: "plastic",
      STATIONARY: "stationary",
      CLOTHES: "clothes",
      FURNITURE: "furniture",
      FOOD: "food",
      OTHER: "other",
    }

    const categoryModel = categoryModelMap[item.category]

    if (categoryModel) {
      await db[categoryModel].deleteMany({
        where: { itemId },
      })
    }

    await db.itemListing.delete({
      where: { id: itemId },
    })

    return res.status(200).json({ message: "Item deleted successfully." })
  } catch (error) {
    console.error("Error deleting item:", error)
    return res
      .status(500)
      .json({ error: "An error occurred while deleting the item." })
  }
}

export const createPickupRequest = async (req, res) => {
  try {
    const user = await db.user.findUnique({
      where: {
        clerkUserId: req.auth.userId,
      },
    })

    if (!user) {
      return res.status(404).json({ error: "User not found." })
    }

    const validation = createPickupRequestSchema.safeParse(req.body)

    if (!validation.success) {
      return res.status(400).json({ error: validation.error.errors })
    }

    const { itemId, pickupAddress, preferredPickupDate, notes } =
      validation.data

    const item = await db.itemListing.findUnique({
      where: { id: itemId },
    })

    if (!item) {
      return res.status(404).json({ error: "Item not found." })
    }

    if (item.producerId !== user.id) {
      return res.status(403).json({
        error: "You are not authorized to request a pickup for this item.",
      })
    }

    // Step 4: Create the pickup request
    const pickupRequest = await db.pickupRequest.create({
      data: {
        itemId,
        userId: user.id,
        pickupAddress,
        scheduledDate: preferredPickupDate || null,
        notes: notes || null,
      },
    })

    return res.status(201).json({
      message: "Pickup request created successfully.",
      pickupRequest,
    })
  } catch (error) {
    console.error("Error creating pickup request:", error)
    return res
      .status(500)
      .json({ error: "An error occurred while creating the pickup request." })
  }
}

export const giveFeedback = async (req, res) => {}
