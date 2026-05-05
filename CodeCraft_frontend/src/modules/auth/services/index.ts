import api from "@/lib/axios"
import { EmailExistsResponseSchema } from "../schemas"
import type {  ApiResponse } from "@/shared/types"
import type { RegisterFormData } from "../types"
import { handleAppError } from "@/shared/error/handleAppError"
import { isAxiosError } from "axios"



export async function checkEmailExist( email : RegisterFormData['email']) {
  try {
    const { data } = await api('/auth/email-exists', { params: { email }})

    const result = EmailExistsResponseSchema.safeParse(data)

    if(!result.success) {
      console.error("Ocurrió un error al procesar los datos", result.error)
      return undefined
    }

    return result.data.exist

  } catch (error) {

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

export async function createAccount (formData : RegisterFormData) : Promise<ApiResponse<never>>{
  try {
    const { data } = await api.post<ApiResponse<never>>('/auth/create-account', formData)
    console.log(data)
    return data

  } catch (error) {
    handleAppError(error)
  }
}