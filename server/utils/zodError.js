export const zodError = (error) =>
  error.errors.map((e) => ({ path: e.path, message: e.message }))
