import { ParamErrorType } from "./apiErros"

export enum EnumErrosService {
  INVALID_DATA,
  EXIST_USER,
  CREDENCIALS_ERROR,
  INVALID_TOKEN,
  UNKNOW_ERROR,
}

export type returnServiceError = {
  success: false
  error_name: EnumErrosService
  error: Error | ParamErrorType 
}

class ServiceErros {
  public handleError = (errorName: EnumErrosService) => {
    return (error: ParamErrorType | Error): returnServiceError => ({
      success: false,
      error_name: errorName,
      error: error,
    })
  }
}


export default new ServiceErros()