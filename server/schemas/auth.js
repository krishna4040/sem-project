import { z } from "zod"
import {
  DOCUMENT_TYPE,
  ORGANIZATION_TYPE,
  USER_ROLE,
  USER_TYPE,
} from "../constants"

export const addUserDetailsSchema = z
  .object({
    role: z.enum(USER_ROLE, { required_error: "Role is required" }),
    userType: z.enum(USER_TYPE, { required_error: "User type is required" }),
    organizationType: z.enum(ORGANIZATION_TYPE).optional(),
    document_urls: z.array(z.string().url("Invalid URL format")).optional(),
    documentType: z.enum(DOCUMENT_TYPE).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.userType === "organization") {
      // Check for organizationType
      if (!data.organizationType) {
        ctx.addIssue({
          path: ["organizationType"],
          message: "Organization type is required for organizations",
        })
      }

      // Check for document_urls
      if (!data.document_urls || data.document_urls.length === 0) {
        ctx.addIssue({
          path: ["document_urls"],
          message: "At least one document URL is required for organizations",
        })
      }

      // Check for documentType
      if (!data.documentType) {
        ctx.addIssue({
          path: ["documentType"],
          message: "Document type is required for organizations",
        })
      }
    }
  })
