import { app } from "./infra/app"
import { logger } from "./logger"
const port = process.env.PORT || 3333

app.listen(port, () => {
  logger.info("server listening...")
})