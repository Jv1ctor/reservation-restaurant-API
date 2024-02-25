import { Users } from "@prisma/client"

declare global {
  namespace Express {
     interface Request {
      user: Partial<Users>
    }
  }
}
