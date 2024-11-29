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
