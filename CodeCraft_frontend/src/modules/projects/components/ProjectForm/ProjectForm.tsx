import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import type { ProjectFormData } from '../../types'
import { ProjectFormSchema } from '../../schemas'
import Button from '@/shared/components/Buttons/Button/Button'
import { FormInput, FormTextarea } from '@/shared/components/Form'
import HoverTooltip from '@/shared/components/Tooltips/HoverTooltip/HoverTooltip'
import useAppStore from '@/shared/stores/useAppStore'
import { createProject } from '../../services'

import './ProjectForm.scss'


const buildInitialValues = () : ProjectFormData=> {
    return {
      projectName: '',
      clientName: '',
      description: ''
  }
}

const ProjectForm = () => {

  const {openNotification, closeModal } = useAppStore()
  
  const location = useLocation()
  const navigate = useNavigate()
  const queryParams = new URLSearchParams(location.search)
  const projectId = queryParams.get('projectId')


  const handleCloseModal = () => {
    closeModal()
    navigate(location.pathname)
  }


  const [messageTooltip, setMessageTooltip] = useState('Es necesario un nombre para el proyecto')

  const methods = useForm<ProjectFormData>({
    resolver: zodResolver(ProjectFormSchema),
    mode: 'onChange',
    defaultValues : buildInitialValues() 
  })

  const { register, handleSubmit, formState: { errors, isValid } } = methods
  
  const queryClient = useQueryClient()

  const { mutate } = useMutation({
    mutationFn: createProject,
    onError: (error) => {
      openNotification(error.message || 'Error inesperado', true)
      handleCloseModal()
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({queryKey: ['projects']})
      if(!!projectId) {
        queryClient.invalidateQueries({queryKey: ['project', projectId]})
      }   
      openNotification(data.message)
      handleCloseModal()
    }
  })

  const onSubmit = (formData: ProjectFormData) =>  {
    mutate(formData)
  } 

  const handleMessageError = () => {
    const arrayMessage = Object.entries(errors)
    if(arrayMessage.length > 1) {
      setMessageTooltip('Revisa los campos por favor')
    } else if(arrayMessage.length === 1) {
      setMessageTooltip(arrayMessage[0][1].message || 'Revisa los campos por favor' )
    } else {
      setMessageTooltip('Es necesario un nombre para el proyecto')
    }
  }

  useEffect(() => {
    handleMessageError()
  }, [Object.values(errors)])

    return (
      <div className='project-form'>
        <h3>Crear proyecto</h3>
        <FormProvider {...methods}>
          <form 
            className='project-form__content'
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <div className='project-form__wrapper'>
              <div className='project-form__first-column'>
                <FormInput
                  id='projectName'
                  label= 'Nombre del proyecto'
                  type="text"
                  error={errors?.projectName?.message}
                  {...register('projectName')}
                />

                <FormInput
                  id='clientName'
                  label= 'Nombre del cliente'
                  type="text"
                  error={errors?.clientName?.message}
                  {...register('clientName')}
                />

                <FormTextarea 
                  id='description'
                  label='Descripción'
                  error={errors.description?.message}
                  {...register('description')}
                />

              </div>
            </div>

            <HoverTooltip text={messageTooltip} showTooltip= {!isValid}>
              <Button 
                text = 'Crear proyecto' 
                type = 'submit'
                variant = 'form'
                disabled= {!isValid}
              />
            </HoverTooltip>
          </form>
        </FormProvider>
      </div>
    )
}

export default ProjectForm