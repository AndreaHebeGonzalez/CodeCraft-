import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Navigate, Outlet, useParams } from 'react-router-dom'
import { getProjectById, updateProjectField } from '../../services'
import ProjectNavBar from '../../components/project-navbar/ProjectNavbar'
import ProjectStatus from '@/shared/components/tags/project-status/ProjectStatus'
import EditableField  from '@/shared/components/form/editable-field/EditableField'
import './ProjectDetails.scss'

const ProjectDetails = () => {

  const { projectId } = useParams<{ projectId: string }>()


  if (!projectId) {
    // Esta vista no existe sin projectId, MANEJAR CON ERROR BOUNDARY
    throw new Error('Parámetro de ruta faltante: projectId. Esta vista depende de /projects/:projectId')
  }

  
  const [editingTitle, setEditingTitle] = useState(false)
  const [newTitle, setNewTitle] = useState('')

  const queryClient = useQueryClient()

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['project', projectId], 
    queryFn: () => getProjectById(projectId!),
    retry: 2
  })

  const { mutate } = useMutation({
    mutationFn: updateProjectField,
    onError: (error) => {
      console.log(error)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['project', projectId]})
      queryClient.invalidateQueries({queryKey: ['projects']})
    }
  })

  const onSave = (field: string, value: string | {
      from?: Date | undefined;
      to?: Date | undefined;
    }) => {
    
    if(field === 'projectName' && value === '') {
      return
    }

    console.log(field + ': ', value)
    
    const data = {
      projectId: projectId,
      field,
      value
    }

    mutate(data)
  }

  const handleSetTitle = (value: string) => {
    setNewTitle(value)
  }
  
  const handleSetEditing = (value: boolean) => {
    setEditingTitle(value)
  }


  if(isLoading) return 'Cargando...'

  if(isError && error) { 
    //evaluar diferentes errores
    return <Navigate to='/404'/> 
  }
  
  if (data) 
    return (
      <div className='project-details'>
        <div className='project-details__headers'>
          <div className='project-details__wrapper'>
            <ProjectStatus 
              text='En curso'
              variant='inProgress'
            />
            {
              editingTitle ? 
              <EditableField 
                value={data.projectName}
                field='projectName'
                onSave={onSave}
                className='project-details__name'
                setEditing={handleSetEditing}
                setNewValue={handleSetTitle}
              /> :
              <h2 
                className='project-details__name'
                onClick={() => setEditingTitle(true)}
              >
                { newTitle || data.projectName }
              </h2>
            }
          </div>
          
          <div className='project-details__summary'>
            <EditableField 
              className='project-details__description'
              value={data.description || ''}
              field= 'description'
              placeholder={'Agrega una descripcion para mayor información'}
              onSave={onSave}
              shouldTruncateText={true}
              MAX_HEIGHT={90}
            />
          </div>
        </div>

        <ProjectNavBar />
        
        <div className='project-details__content'>
          <Outlet />
        </div>
      </div>
    )
  }


export default ProjectDetails