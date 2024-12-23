import { z } from "zod"

export const listItemSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long." })
    .max(100, { message: "Title must be less than 100 characters." }),

  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters long." })
    .max(1000, { message: "Description must be less than 1000 characters." }),

  category: z.enum(
    [
      "EWASTE",
      "PLASTIC",
      "STATIONARY",
      "CLOTHES",
      "FURNITURE",
      "FOOD",
      "OTHER",
    ],
    {
      errorMap: () => ({
        message:
          "Category must be one of the following: EWASTE, PLASTIC, STATIONARY, CLOTHES, FURNITURE, FOOD, OTHER.",
      }),
    },
  ),

  latitude: z
    .number()
    .optional()
    .refine((val) => val >= -90 && val <= 90, {
      message: "Latitude must be between -90 and 90.",
    }),

  longitude: z
    .number()
    .optional()
    .refine((val) => val >= -180 && val <= 180, {
      message: "Longitude must be between -180 and 180.",
    }),

  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters long." })
    .max(255, { message: "Address must be less than 255 characters." })
    .optional(),

  specificDetails: z
    .union([
      // EWaste schema
      z
        .object({
          brand: z
            .string()
            .min(2, { message: "Brand name must be at least 2 characters." }),
          model: z
            .string()
            .min(2, { message: "Model name must be at least 2 characters." }),
          condition: z.string(),
          warranty: z.boolean(),
          quantity: z
            .number()
            .min(1, { message: "Quantity must be at least 1." }),
          images: z.array(
            z.string().url({ message: "Each image must be a valid URL." }),
          ),
          donated: z.boolean(),
          amount: z
            .number()
            .positive({ message: "Amount must be a positive number." })
            .optional(),
        })
        .optional(),

      // Plastic schema
      z
        .object({
          type: z.string(),
          weight: z
            .number()
            .positive({ message: "Weight must be a positive number." }),
          recyclable: z.boolean(),
          images: z.array(
            z.string().url({ message: "Each image must be a valid URL." }),
          ),
          donated: z.boolean(),
          amount: z
            .number()
            .positive({ message: "Amount must be a positive number." })
            .optional(),
        })
        .optional(),

      // Stationary schema
      z
        .object({
          type: z.string(),
          quantity: z
            .number()
            .min(1, { message: "Quantity must be at least 1." }),
          new: z.boolean(),
          images: z.array(
            z.string().url({ message: "Each image must be a valid URL." }),
          ),
          donate: z.boolean(),
          amount: z
            .number()
            .positive({ message: "Amount must be a positive number." })
            .optional(),
        })
        .optional(),

      // Clothes schema
      z
        .object({
          size: z.string(),
          gender: z.string(),
          material: z.string(),
          condition: z.string(),
          quantity: z
            .number()
            .min(1, { message: "Quantity must be at least 1." }),
          images: z.array(
            z.string().url({ message: "Each image must be a valid URL." }),
          ),
          donate: z.boolean(),
          amount: z
            .number()
            .positive({ message: "Amount must be a positive number." })
            .optional(),
        })
        .optional(),

      // Furniture schema
      z
        .object({
          type: z.string(),
          material: z.string(),
          condition: z.string(),
          dimensions: z.string(),
          images: z.array(
            z.string().url({ message: "Each image must be a valid URL." }),
          ),
          donate: z.boolean(),
          amount: z
            .number()
            .positive({ message: "Amount must be a positive number." })
            .optional(),
        })
        .optional(),

      // Food schema
      z
        .object({
          type: z.string(),
          expiryDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
            message: "Expiry date must be a valid date in ISO format.",
          }),
          weight: z
            .number()
            .positive({ message: "Weight must be a positive number." }),
          images: z.array(
            z.string().url({ message: "Each image must be a valid URL." }),
          ),
          donate: z.boolean(),
          amount: z
            .number()
            .positive({ message: "Amount must be a positive number." })
            .optional(),
        })
        .optional(),

      // Other schema
      z
        .object({
          details: z.array(
            z.string().min(1, { message: "Details must not be empty." }),
          ),
          condition: z.string(),
          images: z.array(
            z.string().url({ message: "Each image must be a valid URL." }),
          ),
          donate: z.boolean(),
          amount: z
            .number()
            .positive({ message: "Amount must be a positive number." })
            .optional(),
        })
        .optional(),
    ])
    .optional(),
})

export const itemSearchFiltersSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title filter must be at least 1 character long." })
    .optional(),

  category: z
    .enum([
      "EWASTE",
      "PLASTIC",
      "STATIONARY",
      "CLOTHES",
      "FURNITURE",
      "FOOD",
      "OTHER",
    ])
    .optional(),

  latitude: z
    .number()
    .optional()
    .refine((val) => val >= -90 && val <= 90, {
      message: "Latitude must be between -90 and 90.",
    }),

  longitude: z
    .number()
    .optional()
    .refine((val) => val >= -180 && val <= 180, {
      message: "Longitude must be between -180 and 180.",
    }),

  maxDistance: z
    .number()
    .positive({ message: "Max distance must be a positive number." })
    .optional(),

  producerId: z
    .string()
    .uuid({ message: "Producer ID must be a valid UUID." })
    .optional(),

  createdAt: z
    .object({
      from: z
        .string()
        .datetime({ message: "From date must be a valid ISO string." })
        .optional(),
      to: z
        .string()
        .datetime({ message: "To date must be a valid ISO string." })
        .optional(),
    })
    .optional(),

  specificDetails: z
    .object({
      brand: z.string().optional(),
      condition: z.string().optional(),
      material: z.string().optional(),
      recyclable: z.boolean().optional(),
    })
    .optional(),

  limit: z
    .number()
    .positive({ message: "Limit must be a positive number." })
    .optional(),
  offset: z
    .number()
    .min(0, { message: "Offset must be zero or a positive number." })
    .optional(),
})

export const updateItemSchema = z.object({
  itemId: z.string().nonempty("Item ID is required."), // Required to identify the item
  title: z.string().optional(),
  description: z.string().optional(),
  category: z
    .enum([
      "EWASTE",
      "PLASTIC",
      "STATIONARY",
      "CLOTHES",
      "FURNITURE",
      "FOOD",
      "OTHER",
    ])
    .optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  address: z.string().optional(),
  status: z.enum(["AVAILABLE", "PENDING", "DONATED", "RESERVED"]).optional(),
  // Category-specific fields
  categoryDetails: z
    .object({
      brand: z.string().optional(),
      model: z.string().optional(),
      condition: z.string().optional(),
      warranty: z.boolean().optional(),
      quantity: z.number().optional(),
      weight: z.number().optional(),
      recyclable: z.boolean().optional(),
      type: z.string().optional(),
      expiryDate: z.date().optional(),
      size: z.string().optional(),
      gender: z.string().optional(),
      material: z.string().optional(),
      dimensions: z.string().optional(),
      details: z.array(z.string()).optional(),
      images: z.array(z.string()).optional(),
      donate: z.boolean().optional(),
      amount: z.number().optional(),
    })
    .optional(),
})

export const createPickupRequestSchema = z.object({
  itemId: z.string().uuid().nonempty("Item ID is required."),
  pickupAddress: z.string().nonempty("Pickup address is required."),
  preferredPickupDate: z
    .string()
    .datetime({ message: "Invalid date format." })
    .optional(),
  notes: z.string().optional(), // Optional additional information
})
