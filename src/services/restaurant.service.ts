import prisma from "../infra/database/prisma.db"
import { Restaurants } from "@prisma/client"
import { validator } from "../helpers/validator"
import serviceErros, { returnServiceError } from "../helpers/serviceErros"
import { z } from "zod"
import dateFormats from "../helpers/dateFormats"

const schemaListAll = z.object({
  take: z.number().int().positive().finite().default(0),
  skip: z.number().int().positive().finite().default(0),
})

const schemaRegister = z.object({
  name_restaurant: z.string().max(100),
  address: z.string().max(130),
  tel: z.string().length(11),
  kitchen: z.string(),
  minimum_price: z.number().positive(),
  maximus_price: z.number().positive(),
  description: z.string(),

  timetable: z.array(
    z.object({
      weekday: z.enum(["seg", "ter", "qua", "qui", "sex", "sab", "dom"]),
      opening_hours: z.string().regex(/[0-9:]+/),
      closing_hours: z.string().regex(/[0-9:]+/),
    })
  ),
})

type ReturnListAllType = {
  success: true
  restaurants: Restaurants[]
}

type ReturnRegisterRestaurantType = {
  success: true
}

interface IRestaurant {
  listAll: (query: any) => Promise<returnServiceError | ReturnListAllType>
  register: (
    body: any,
    userId: string
  ) => Promise<returnServiceError | ReturnRegisterRestaurantType>
}

class RestaurantService implements IRestaurant {
  listAll = async (query: any) => {
    try {
      const queryNumber = {
        take: parseInt(query.take),
        skip: parseInt(query.skip),
      }
      const { data, error } = await validator.handle(schemaListAll, queryNumber)
      if (error) return serviceErros.invalidDataError(error)

      const restaurants = await prisma.restaurants.findMany({
        take: data.take,
        skip: data.skip,
      })

      return { success: true as const, restaurants }
    } catch (error) {
      return serviceErros.unknowError(error as Error)
    }
  }

  register = async (body: any, userId: string) => {
    try {
      const registerData = {
        ...body,
        minimum_price: parseFloat(body.minimum_price),
        maximus_price: parseFloat(body.maximus_price),
      }

      const { data, error } = await validator.handle(
        schemaRegister,
        registerData
      )

      if (error) return serviceErros.invalidDataError(error)

      const existRestaurant = await prisma.restaurants.findFirst({
        where: {
          name_restaurant: data.name_restaurant,
          OR: [{ user_id: userId }],
        },
      })

      if (existRestaurant){
        return serviceErros.invalidRegisterRestaurant({
          message: "Invalid restaurant registration, user already has one or name already exists",
          code: "invalid_register_restaurant"
        })

      }

      const restaurant = await prisma.restaurants.create({
        data: {
          name_restaurant: data.name_restaurant,
          address: data.address,
          tel: data.tel,
          kitchen: data.kitchen,
          minimun_price: data.minimum_price,
          maximum_price: data.maximus_price,
          description: data.description,
          user_id: userId,
        },
      })

      const timeTableMany = data.timetable.map((item) => ({
        ...item,
        opening_hours: dateFormats.convertISO(item.opening_hours),
        closing_hours: dateFormats.convertISO(item.closing_hours),
        restaurant_id: restaurant.id,
      }))

      await prisma.timetable.createMany({
        data: timeTableMany,
      })

      return { success: true as const }
    } catch (error) {
      return serviceErros.unknowError(error as Error)
    }
  }
}

export default new RestaurantService()
