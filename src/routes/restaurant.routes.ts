import { Router } from "express"
import { RestaurantController } from "../controllers/restaurant.controller"
import authMiddleware from "../middleware/auth.middleware"

const router = Router()
const restaurantController = new RestaurantController()

router.get("/", restaurantController.listAll)
router.post("/", authMiddleware.authenticate, restaurantController.register)

export { router as restaurantRouter }
