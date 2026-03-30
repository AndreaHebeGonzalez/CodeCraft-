import api from "@/lib/axios";
import type { Project, ProjectFormData, Projects } from "../types";
import { isAxiosError } from "axios";
import { ProjectsSchemaDTO, ProjectSchemaDTO } from "../schemas";
import { mapDTOToDomain } from "@/shared/utils/utils";
import type { ApiResponse } from "@/shared/types";

type ProjectApi = {
  projectId: Project['_id'],
  projectFormData: ProjectFormData
  field: string, 
  value: string | { from?: Date, to?: Date } 
}

export async function createProject(projectFormData : ProjectApi['projectFormData']) : Promise<ApiResponse>  {
  try {
    const { data } = await api.post<ApiResponse>('/projects', projectFormData )
    return data

  } catch (error) {
    if(isAxiosError(error)) {
      if(error.response) {
        console.error(error.response)
        throw new Error(error.response.data.message)
      } else if(error.request) {
        console.error('Se envió la petición pero no hubo respuesta:', error.request);
        throw new Error('Se envío la petición pero no hubo respuesta')
      } else {
        console.error('Error al configurar la petición:', error.message)
        throw new Error('Error al configurar la petición')
      }
    } else {
      console.error('Error inesperado:', error)
      throw new Error('Error inesperado')
    } 
  }
}

export async function getProjects() : Promise<Projects> {
  try {
    const { data: response } = await api('/projects')
    const result = ProjectsSchemaDTO.safeParse(response.data)

    if(!result.success) {
      console.error('Validación fallida:', result.error)
      throw new Error('Los datos del proyecto no son válidos')
    }
    return result.data.map((project) => mapDTOToDomain(project, ['startDate', 'dueDate']))

  } catch (error) {
    if(isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message)
    } else {
      console.error('Error inesperado:', error)
      throw new Error('Error inesperado')
    }
  }
}

export async function getProjectById(id : Project['_id']) : Promise<Project>{
  try {
    const { data: response } = await api(`/projects/${id}`) 
    const result = ProjectSchemaDTO.safeParse(response.data)
    if (!result.success) {
      console.error('Validación fallida:', result.error)
      throw new Error('Los datos del proyecto no son válidos')
    }
    return mapDTOToDomain(result.data, ['startDate', 'dueDate'])

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

export async function updateProjectField({ projectId, field, value } : Pick<ProjectApi, 'projectId'|'field'|'value'>) : Promise<ApiResponse>  {
  try {
    let formData
    /* Desarrollar valores de formData */
    if(field === 'rangeDate' && value instanceof Object && 'from' in value) {
      formData = {
        startDate: value.from ?? null,
        dueDate: value.to ?? null
      }
      console.log(formData)
    } else {
      formData = {
        [field]: value
      }
    }

    const { data } = await api.patch<ApiResponse>(`/projects/${projectId}`, formData )

    return data

  } catch (error) {
    if(isAxiosError(error)) {
      if(error.response) {
        console.error(error.response)
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

export async function deleteProject(id : Project['_id']) : Promise<ApiResponse> {
  try {
    const { data } = await api.delete<ApiResponse>(`/projects/${id}`) 
    return data
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

/* 
5. Servicios frontend (Axios):

5.1 Patrón repetido correcto, pero verboso

Ejemplo típico:

if (isAxiosError(error)) {
  if (error.response) {
    throw new Error(error.response.data.message)
  }
  ...
}

✔ Funciona
✔ Coherente
⚠ Duplicado en todos los servicios

Pendiente estructural (no obligatorio aún)

Extraer a un helper:

function handleAxiosError(error: unknown): never
  Eso:

  Elimina duplicación

  Evita inconsistencias futuras

  Facilita agregar errorKind


5.2 Suposición fuerte en error.response.data.message

  Ahora mismo TODO tu frontend asume:
  { message: string }
  Como ya corregiste el backend, esto está bien.
  Solo ten presente que los errores de validación traen errors extra.
  Si en algún momento haces:
  error.response.data.errors
  → deberás manejarlo explícitamente.
*/