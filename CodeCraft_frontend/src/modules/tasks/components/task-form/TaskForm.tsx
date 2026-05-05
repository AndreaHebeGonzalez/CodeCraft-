import { FormInput, FormTextArea } from '@/shared/components/form'
import { useForm } from 'react-hook-form'
import type { TaskFormData } from '../../types'
import { zodResolver } from '@hookform/resolvers/zod'
import { taskFormSchema } from '../../schemas'
import Button from '@/shared/components/buttons/button/Button'
import { cleanFormData } from '@/shared/utils/utils'
import { createTask } from '../../services'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import useAppStore from '@/shared/stores/useAppStore'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import './TaskForm.scss'

const defaultValue = (data? : TaskFormData ) => {
  return {
    taskName:  data?.taskName || '',
    description: data?.description || ''
  }
}
  const TaskForm = () => {

  const navigate = useNavigate()
  const location = useLocation()
  const { projectId } = useParams<{projectId: string}>()

  const { openNotification, closeModal } = useAppStore()
  
  const { handleSubmit, formState: { errors, isValid }, register } = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: defaultValue(),
    mode: 'onChange'
  })

  const handleCloseModal = () => {
    closeModal()
    navigate(location.pathname)
  }

  const queryClient = useQueryClient()

  const { mutate } = useMutation({
    mutationFn: createTask,
    onError: (error) => {
      openNotification(error.message, true)
      handleCloseModal()
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({queryKey: ['tasks', projectId]})
      openNotification(data.message)
      closeModal()
    }
  })

  const onSubmit = (formData: TaskFormData) => {
    const taskFormData = cleanFormData(formData)

    const data = {
      taskFormData,
      projectId: projectId!,
    }
    mutate(data)
  }

  return (
    <div className='task-form'>
      <h3>Nueva tarea</h3>
      <p className='task-form__text'>Llene el formulario y cree una <span className='task-form__highlighted'>tarea</span></p>
      <form 
        onSubmit={handleSubmit(onSubmit)}
        className='task-form__content'
      >
        <FormInput 
          id='taskName'
          label='Nombre'
          error={errors?.taskName?.message}
          {...register('taskName')}
        />
        <FormTextArea 
          id='description'
          label='Descripción'
          error= {errors?.description?.message}
          {...register('description')}
        />
      <Button 
        text='Crear tarea'
        type='submit'
        variant='form'
        disabled={!isValid}
      />
      </form>
    </div>
  )
}

export default TaskForm
