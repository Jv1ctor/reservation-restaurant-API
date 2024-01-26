import z from "zod"

class ValidatorData {
  private getMessage = (error: z.ZodError) => {
    const errors = error.errors[0]
    return { code: errors.code, message: errors.message }
  }

  public async handle<T extends z.ZodRawShape>(schema: z.ZodObject<T>, obj: object) {
    const schemaParse = await schema.safeParseAsync(obj)
    if (schemaParse.success) {
      return { data: schemaParse.data }
    }
    return { error: this.getMessage(schemaParse.error) }
  }
}

export const validator = new ValidatorData()
