import { Router } from "express"
import { userRouter } from "./user.routes"
import { restaurantRouter } from "./restaurant.routes"
import authMiddleware from "../middleware/auth.middleware"

const router = Router()

router.use("/user", userRouter)
router.use("/restaurant", restaurantRouter)

export default router
