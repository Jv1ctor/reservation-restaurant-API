import express from "express"
import "dotenv/config"
import morgan from "morgan"
import helmet from "helmet"

const app = express()
const port = process.env.PORT || 3333

app.use(morgan("dev"))
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))



app.listen(port, () => {
  console.log("server listening...")
})