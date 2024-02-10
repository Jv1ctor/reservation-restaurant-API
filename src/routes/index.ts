import { Router } from "express";
import { userRouter } from "./user.routes";
import authMiddleware from "../middleware/auth.middleware";

const router = Router()

router.use("/user", userRouter)
router.get("/teste", authMiddleware.authenticate, (req, res) => {
  res.send("ok")
})

export default router