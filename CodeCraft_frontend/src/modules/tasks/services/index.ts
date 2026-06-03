import api from "@/lib/axios";
import type { Task, TaskFormDataNormalized, GetTaskByIdResponseDomain, TasksByProjectResponseDomain } from "../types";
import { isAxiosError } from "axios";
import type { Project } from "@/modules/projects/types";
import { GetTaskByIdResponseSchema, GetTasksByProjectResponseSchema } from "../schemas";
import { mapTaskPropertyToDomain } from "@/shared/utils/utils";
import type { ApiResponse } from "@/shared/types";

type TaskApi = {
  projectId: Project['_id'],
  taskId: Task['_id']
  taskFormData: TaskFormDataNormalized,
  field: string, 
  value: string | { from?: Date, to?: Date } 
}

export const createTask = async({ taskFormData, projectId } : Pick<TaskApi, 'taskFormData'|'projectId' >) : Promise<ApiResponse> => {
  try {
    const { data } = await api.post<ApiResponse>(`/projects/${projectId}/tasks`, taskFormData)
    return data
  } catch (error) {
    if(isAxiosError(error)) {
      if(error.response) {
        if(error.response.status === 404) {
          console.log(error)
          throw new Error('Recurso no encontrado')
        } else {
          console.log(error)
          throw new Error(error.response.data.message)
        }
      } else if(error.request) {
        console.log('Se realizó la peticion pero no hubo respuesta', error.message)
        throw new Error('Se realizó la peticion pero no hubo respuesta')
      } else {
        console.log(error.message)
        throw new Error('Error al configurar la petición')
      }
    } else {
      console.log('Error inesperado:', error)
      throw new Error('Ocurrió un error inesperado, vuelva a intentarlo más tarde')
    }
  }
}

export const getTaskById = async (projectId : Project['_id'],  taskId : Task['_id']) : Promise<GetTaskByIdResponseDomain> => {
  try {
    const { data : response } = await api(`/projects/${projectId}/tasks/${taskId}`)

    const result = GetTaskByIdResponseSchema.safeParse(response.data)
    
    if(!result.success) {
      console.error('Validación fallida', result.error)
      throw new Error('Datos inválidos')
    }

    return mapTaskPropertyToDomain(result.data)

  } catch (error) {
    if(isAxiosError(error)) {
      if(error.response) {
        if(error.response.status === 404) {
          console.error(error)
          throw new Error('Recurso no encontrado')
        } else {
          console.error(error)
          throw new Error(error.response.data.message)
        }
      } else if(error.request) {
        console.error('Se realizó la petición pero no hubo respuesta', error)
        throw new Error('No hubo respuesta')
      } else {
        throw new Error('Error al configurar la petición')
      }
    } else {
      throw new Error('Ocurrió un error inesperado, vuelva a intentarlo más tarde')
    }
  }
}

export const getTasksByProject = async (projectId : string) : Promise<TasksByProjectResponseDomain> => {
  try {
    const  { data : response } = await api(`/projects/${projectId}/tasks`) 

    const result = GetTasksByProjectResponseSchema.safeParse(response.data)

    if(!result.success) {
      console.log('Validacion fallida', result.error)
      throw new Error('Datos inválidos')
    }

    return result.data.map(mapTaskPropertyToDomain)

  } catch (error) {
    if(isAxiosError(error)) {
      if(error.response) {
        if(error.response.status === 404) {
          console.error(error)
          throw new Error('Recurso no encontrado')
        } else {
          console.error(error)
          throw new Error(error.response.data.message)
        }
      } else if(error.request) {
        console.error('Se realizó la petición pero no hubo respuesta', error)
        throw new Error('No hubo respuesta')
      } else {
        throw new Error('Error al configurar la petición')
      }
    } else {
      throw new Error('Ocurrió un error inesperado, vuelva a intentarlo más tarde')
    }
  }
}

export const updateTaskField = async ({ projectId, taskId, field, value } : Pick<TaskApi, 'projectId'|'taskId'|'field'|'value'>) => {
  
  try {
    let formData
    if(field === 'rangeDate' && value instanceof Object) {
      formData = {
        startDate: value.from ?? null,
        dueDate: value.to ?? null
      }
    } else {
      formData = {
        [field]: value
      }
    }
    const data = await api.patch<ApiResponse>(`/projects/${projectId}/tasks/${taskId}`, formData)

    return data

  } catch (error) {
    if(isAxiosError(error)) {
      if(error.response) {
        if(error.response.status === 404) {
          console.error('Recurso no encontrado', error)
          throw new Error('Recurso no encontrado')
        } else {
          console.error(error)
          throw new Error(error.response.data.message)
        }
      } else if(error.request) {
        console.error('Se realizó la solicitud pero no hubo respuesta', error)
        throw new Error('No hubo respuesta')
      } else {
        console.error(error)
        throw new Error('Error al configurar la petición')
      }
    } else {
      console.log('Error inesperado', error)
      throw new Error('Error inesperado') 
    }
  }
}

export const deleteTask = async ({ projectId,  taskId } : Pick<TaskApi, 'projectId'|'taskId'>) : Promise<ApiResponse> => {
  try {
    const { data } = await api.delete<ApiResponse>(`/projects/${projectId}/tasks/${taskId}`)
    return data
    
  } catch (error) {
    if(isAxiosError(error)) {
      if(error.response) {
        if(error.response.status === 404) {
          console.error(error)
          throw new Error('Recurso no encontrado')
        } else {
          console.error(error)
          throw new Error(error.response.data.message)
        }
      } else if(error.request) {
        console.error('Se realizó la petición pero no hubo respuesta', error)
        throw new Error('No hubo respuesta')
      } else {
        throw new Error('Error al configurar la petición')
      }
    } else {
      throw new Error('Ocurrió un error inesperado, vuelva a intentarlo más tarde')
    }
  }
}