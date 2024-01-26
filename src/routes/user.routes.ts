import { Router } from "express";
import { UserController } from "../controllers/user.controller";

const router = Router()
const userController = new UserController()

router.post("/login")
router.post("/register", userController.register)
router.post("/refresh-token")



export { router as userRouter }