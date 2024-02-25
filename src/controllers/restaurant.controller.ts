import { Request,Response, NextFunction } from "express"
import { BadRequestError } from "../helpers/apiErros"
import restaurantService from "../services/restaurant.service"
import { logger } from "../infra/logger"

export class RestaurantController {
  listAll = async (req: Request , res: Response, next: NextFunction) => {
    const restaurant = await restaurantService.listAll(req.query)
    if (!restaurant.success) {
      if (restaurant.error instanceof Error) return next(restaurant.error)

      return next(new BadRequestError(restaurant.error))
    }

    res.json({ success: true, restaurants: restaurant.restaurants })
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    const restaurant = req.user.id && await restaurantService.register(req.body, req.user.id)
    
    if(restaurant && !restaurant.success){
      if(restaurant.error instanceof Error) return next(restaurant.error)
      
      return next(new BadRequestError({
        message: restaurant.error.message,
        codeError: restaurant.error.code
      }))
    }

    if(restaurant) return res.status(201).json({ success: true, message: "successfully registered restaurant"})
  }
}
