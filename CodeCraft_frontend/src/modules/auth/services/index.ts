import api from "@/lib/axios";
import { EmailExistsResponseSchema } from "../schemas";
import { isAxiosError } from "axios";


type AuthApi = {
  name: string,
  email: string,
  passwod: string,
  repeatPassword: string
}

export async function checkEmailExist( email : AuthApi['email']) {
  try {
    const { data } = await api('/auth/email-exists', { params: { email }})
    const result = EmailExistsResponseSchema.safeParse(data)

    if(!result.success) {
      console.error('Validación fallida')
      throw new Error('Respuesta inválida')
    }

    console.log(result.data)
    return result.data.exist
  } catch (error) {
    if(isAxiosError(error)) {
      if(error.response) {
        throw new Error(error.response.data.message)
      } else if(error.request) {
        console.error('Se envió la petición pero no hubo respuesta:', error.request);
        throw new Error('Se envío la petición pero no hubo respuesta')
      } else {
        console.log('Error al configurar la petición:', error.message)
        throw new Error('Error al configurar la petición')
      }
    } else {
      console.log('Error inesperado:', error)
      throw new Error('Error inesperado')
    } 
  }
}

export async function register() {
  try {
    
  } catch (error) {
    
  }
}