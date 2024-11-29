import { Webhook } from "svix"

export const getWebhookData = ({ signingSecret, headers, payload }) => {
  if (!signingSecret) {
    throw new Error(
      "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env",
    )
  }

  // Create new Svix instance with secret
  const wh = new Webhook(signingSecret)

  // Get Svix headers for verification
  const svix_id = headers["svix-id"]
  const svix_timestamp = headers["svix-timestamp"]
  const svix_signature = headers["svix-signature"]

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return {
      success: false,
      message: "Error: Missing svix headers",
      webhook: null,
    }
  }

  let evt

  // Attempt to verify the incoming webhook
  // If successful, the payload will be available from 'evt'
  // If verification fails, error out and return error code
  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    })
  } catch (err) {
    return {
      success: false,
      message: err.message,
      webhook: null,
    }
  }

  return {
    success: true,
    message: "webhook verified",
    webhook: evt,
  }
}
