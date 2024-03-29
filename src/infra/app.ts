import express from "express"
import "dotenv/config"
import helmet from "helmet"
import { loggerHttp } from "./logger"
import cors from "cors"
import errorMiddleware from "../middleware/error.middleware"
import routers from "../routes"

const app = express()

app.use(loggerHttp)
app.use(helmet())
app.use(
  cors({
    origin: false,
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/v1", routers)

app.use(errorMiddleware.error404Middleware)
app.use(errorMiddleware.handleErrorMiddleware)
export { app }
