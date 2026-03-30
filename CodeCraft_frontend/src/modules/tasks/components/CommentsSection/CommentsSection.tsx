import Avatar from '@/shared/components/Avatar/Avatar'
import './CommentsSection.scss'
import Button from '@/shared/components/Buttons/Button/Button'

export const CommentsSection = () => {
  return (
    <div className='comments-section'>
      <div className='comments-section__list'>
        <div className='comments-section__comment'>
          <div className='comments-section__comment-meta'>
            <Avatar 
              text='BV'
              variant='#04BC41'
              nameDev= 'Bruno Vidales'
            />
            <span>-</span>
            <span className='comments-section__comment-time'>hace 5 min</span>
          </div>
          <div className='comments-section__comment-text'>
            Deben terminar la subtarea dos antes del viernes
          </div>
        </div>
        <div className='comments-section__comment'>
          <div className='comments-section__comment-meta'>
            <Avatar 
              text='BV'
              variant='#04BC41'
              nameDev= 'Bruno Vidales'
            />
            <span>-</span>
            <span className='comments-section__comment-time'>hace 5 min</span>
          </div>
          <div className='comments-section__comment-text'>
            Está muy dificil esta tarea necesito más tiempo
          </div>
        </div>
      </div>
      <form className='comments-section__form'>
        <div className='comments-section__field-box'>
          <Avatar 
            text='AG'
            variant='#044DBC'
          />
          <textarea 
            className='comments-section__field'
            name="comment" 
            id='comment'
            maxLength={150}
            placeholder='Agregar un comentario'
          />
        </div>
        <div className='comments-section__button-submit'>
          <Button 
            text = 'Comentar'
            type = 'submit'
            variant = 'form'
          />
        </div>
        
      </form>
    </div>
  )
}
