import { listItemSchema, itemSearchFiltersSchema } from "../schemas/item.js"
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

    const where = {}

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

    const totalCount = await prisma.itemListing.count({
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
