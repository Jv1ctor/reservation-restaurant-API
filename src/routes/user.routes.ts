import { Router } from "express"
import { UserController } from "../controllers/user.controller"

const router = Router()
const userController = new UserController()

router.post("/login", userController.login)
router.post("/register", userController.register)
router.post("/refresh-token", userController.refreshToken)

export { router as userRouter }
