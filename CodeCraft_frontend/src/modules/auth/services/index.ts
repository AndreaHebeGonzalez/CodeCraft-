import api from "@/lib/axios"
import { EmailExistsResponseSchema } from "../schemas"
import type {  ApiResponse, LoginDataResponse } from "@/shared/types"
import type { LoginFormData, EmailFormData, RegisterFormData, TokenFormData, SendNewPasswordData } from "../types"
import { handleAppError } from "@/shared/error/handleAppError"
import { isAxiosError } from "axios"



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

export async function createAccount (formData : RegisterFormData) : Promise<ApiResponse<never>['message']>{
  try {
    const { data } = await api.post<ApiResponse<never>>('/auth/create-account', formData)
    return data.message
  } catch (error) {
    handleAppError(error)
  }
} 

export async function confirmAccount(formData: TokenFormData) : Promise<ApiResponse<never>['message']> {
  try {
    const { data } = await api.post<ApiResponse<never>>('auth/confirm-account', formData)
    return data.message
  } catch (error) {
    handleAppError(error)
  }
}

export async function requestConfirmationCode(formData: EmailFormData) : Promise<ApiResponse<never>['message']> {
  try {
    const { data } = await api.post<ApiResponse<never>>('auth/request-code', formData)
    return data.message
  } catch (error) {
    handleAppError(error)
  }
}

export async function authenticateUser(formData: LoginFormData) : Promise<ApiResponse<LoginDataResponse>> {
  try {
    const { data } = await api.post<ApiResponse<LoginDataResponse>>('auth/login', formData)

    return data
  } catch (error) {
    handleAppError(error)
  }
}

export async function forgotPassword(formData: EmailFormData) : Promise<ApiResponse<never>['message']> {
  try {
    console.log(formData)
    const { data } = await api.post<ApiResponse<never>>('auth/forgot-password', formData)
    console.log(data)
    return data.message
  } catch (error) {
    handleAppError(error)
  }
}

export async function validateCode(formData: TokenFormData) : Promise<ApiResponse<never>['message']> {
  try {
    const { data } = await api.post<ApiResponse<never>>('auth/validate-token', formData)
    return data.message
  } catch (error) {
    handleAppError(error)
  }
}

export async function sendNewPassword({ formData, token } : SendNewPasswordData) : Promise<ApiResponse<never>['message']> {
  try {
    const { data } = await api.post<ApiResponse<never>>(`auth/update-password/${token}`, formData)
    return data.message
  } catch (error) {
    handleAppError(error)
  }
}

