import api from "@/lib/axios"
import { EmailExistsResponseSchema } from "../schemas"
import type {  ApiResponse, ApiResponseOnlyData, ApiResponseWithData, LoginDataResponse } from "@/shared/types"
import type { LoginFormData, EmailFormData, RegisterFormData, TokenFormData, SendNewPasswordData } from "../types"
import { handleAppError } from "@/shared/error/handleAppError"
import { isAxiosError } from "axios"
import type { User } from "@/modules/users/types"
import { UserSchema } from "@/modules/users/schema"



export async function checkEmailExist( email : RegisterFormData['email']) {
  console.log('se intento probar el email')
  try {
    const { data } = await api('/auth/email-exists', { params: { email }})

    const result = EmailExistsResponseSchema.safeParse(data)

    if(!result.success) {
      console.error("Ocurrió un error al procesar los datos", result.error)
      return undefined
    }

    return result.data.exist

  } catch (error) {
    console.log('hubo un error')
    if(isAxiosError(error)) {
      console.log(error)
      if(error.response) {
        const { data } = error.response
        console.error(data)
      } else {
        console.error(error)
      }
    } else {
      console.error(error)
    }
    return undefined
  }
}

export async function createAccount (formData : RegisterFormData) : Promise<ApiResponse['message']>{
  try {
    const { data } = await api.post<ApiResponse>('/auth/create-account', formData)
    return data.message
  } catch (error) {
    handleAppError(error)
  }
} 

export async function confirmAccount(formData: TokenFormData) : Promise<ApiResponse['message']> {
  try {
    const { data } = await api.post<ApiResponse>('auth/confirm-account', formData)
    return data.message
  } catch (error) {
    handleAppError(error)
  }
}

export async function requestConfirmationCode(formData: EmailFormData) : Promise<ApiResponse['message']> {
  try {
    const { data } = await api.post<ApiResponse>('auth/request-code', formData)
    return data.message
  } catch (error) {
    handleAppError(error)
  }
}

export async function authenticateUser(formData: LoginFormData) : Promise<ApiResponse['message']> {
  try {
    const { data } = await api.post<ApiResponseWithData<LoginDataResponse>>('auth/login', formData)
    localStorage.setItem('AUTH_TOKEN', data.data?.token)
    return data.message
  } catch (error) {
    handleAppError(error)
  }
}

export async function forgotPassword(formData: EmailFormData) : Promise<ApiResponse['message']> {
  try {
    console.log(formData)
    const { data } = await api.post<ApiResponse>('auth/forgot-password', formData)
    console.log(data)
    return data.message
  } catch (error) {
    handleAppError(error)
  }
}

export async function validateCode(formData: TokenFormData) : Promise<ApiResponse['message']> {
  try {
    const { data } = await api.post<ApiResponse>('auth/validate-token', formData)
    return data.message
  } catch (error) {
    handleAppError(error)
  }
}

export async function sendNewPassword({ formData, token } : SendNewPasswordData) : Promise<ApiResponse['message']> {
  try {
    const { data } = await api.post<ApiResponse>(`auth/update-password/${token}`, formData)
    return data.message
  } catch (error) {
    handleAppError(error)
  }
}


export async function getUser() : Promise<ApiResponseOnlyData<User>['data']> {
  //Repasar cuantas veces debe ejecutarse esto, porque la proteccion de rutas viene por otro lado, por el lado del token en la cabecera de cada solicitud
  try {
    const { data : response } = await api<ApiResponseOnlyData<User>>('auth/user')

    const result = UserSchema.safeParse(response.data)

    if(!result.success) {
      throw result.error
    }

    return response.data

  } catch (error) {
    handleAppError(error) //Manejar en AuthLayout el error de parsing
  }
} 

