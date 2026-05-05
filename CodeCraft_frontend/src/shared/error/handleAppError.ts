import { isAxiosError } from "axios";
import { AppError } from "./AppError";


export function handleAppError(error : unknown) : never {
  
  /* Error axios */
  if (isAxiosError(error)) {

    // Sin respuesta

    if (!error.response) {
      throw new AppError({
        kind: "network",
        userMessage: "Sin conexión con el servidor",
        technicalMessage: "Axios: request made but no response received"
      })
    }

    if (!error.request && !error.response) {

      throw new AppError({
        kind: "unexpected",
        userMessage: "Ocurrió un error inesperado",
        technicalMessage: "Axios: error setting up request"
      })
    }

    // Con respuesta 

    const { status, data } = error.response

    console.log(data)

    if (status === 400) {
      throw new AppError({
        kind: "validation",
        userMessage: data?.message || "Datos inválidos",
        technicalMessage: `400 response: ${JSON.stringify(data)}`,
        status,
        details: data?.errors || data
      })
    }

    if(status === 401 || status === 403 ) {
      throw new AppError({
        kind: "auth",
        status,
        userMessage: data?.message || "No estás autorizado",
        technicalMessage: `Auth error ${status}: ${JSON.stringify(data)}`
      })
    }

    if (status === 409) {
      throw new AppError({
        kind: "http",
        status,
        userMessage: data?.message || "Conflicto en los datos",
        technicalMessage: `409 conflict: ${JSON.stringify(data)}`,
        details: data
      })
    }

    throw new AppError({
      kind: "http",
      userMessage: "Ocurrió un problema en el servidor",
      technicalMessage: `HTTP ${status}: ${JSON.stringify(data)}`,
      details: data
    })
  }

  /* No axis Error */
  // validation frontend (Zod)

  if (error instanceof Error && error.name === "ZodError") {
    throw new AppError({
      kind: "validation",
      userMessage: "Ocurrió un error al procesar los datos",
      technicalMessage: error.message,
      details: error
    })
  }

  /* fallback */

  throw new AppError({
    kind: "unexpected",
    userMessage: "Ocurrió un error inesperado",
    technicalMessage: String(error)
  })
}