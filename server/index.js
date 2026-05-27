const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")

dotenv.config()

const connectDB = require("./config/db")
const commentRoutes = require("./routes/commentRoutes")
const authRoutes = require("./routes/authRoutes")
const paymentRoutes = require("./routes/paymentRoutes")
const downloadRoutes =
  require("./routes/downloadRoutes")


connectDB()

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/comments", commentRoutes)
app.use("/api/payment", paymentRoutes)
app.use("/api/downloads", downloadRoutes)
app.get("/", (req, res) => {
  res.send("Backend Running")
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})