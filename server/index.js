import express from "express"
import path, { dirname } from "path"
import { fileURLToPath } from "url"
import dotenv from "dotenv"
import authRouter from "./router/auth.js"
import itemsRouter from "./router/items.js"

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const app = express()

app.use(express.static(path.join(__dirname, "../frontend/dist")))

app.use("/api/auth", express.raw({ type: "application/json" }), authRouter)
app.use("/api/items", express.json(), itemsRouter)

app.get("/api", (req, res) => res.json({ message: "Hello from express BE!" }))
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "../frontend/dist", "index.html")),
)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`http://127.0.0.1:${PORT}`))
