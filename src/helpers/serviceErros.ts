enum EnumErrosService {
  INVALID_DATA,
  EXIST_USER,
  CREDENCIALS_ERROR,
  INVALID_TOKEN,
  UNKNOW_ERROR,
  INVALID_REGISTER_RESTAURANT
}

export type returnServiceError = {
  success: false
  error_name: EnumErrosService
  error: Error | { message: string, code: string }
}

class ServiceErros {
  private handleError = (errorName: EnumErrosService) => {
    return (error: { message: string, code: string} | Error): returnServiceError => ({
      success: false,
      error_name: errorName,
      error: error,
    })
  }

  public invalidDataError = this.handleError(EnumErrosService.INVALID_DATA)
  public existUserError = this.handleError(EnumErrosService.EXIST_USER)
  public unknowError = this.handleError(EnumErrosService.UNKNOW_ERROR)
  public credencialsError = this.handleError(EnumErrosService.CREDENCIALS_ERROR)
  public invalidTokenError = this.handleError(EnumErrosService.INVALID_TOKEN)
  public invalidRegisterRestaurant = this.handleError(EnumErrosService.INVALID_REGISTER_RESTAURANT)
}

export default new ServiceErros()
