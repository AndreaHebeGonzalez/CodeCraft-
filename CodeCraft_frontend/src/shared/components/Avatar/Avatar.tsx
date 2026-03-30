import './Avatar.scss'

 /* Assignee Avatar */

type AvatarProps = {
  nameDev?: string
  text: string
  variant: string
  width?: string
  height?: string
}
const Avatar = ({ text, variant, width, height, nameDev } : AvatarProps) => {

  return (
    <div className='dev-card'>
      <div className='dev-card__avatar' style={{backgroundColor: `${variant}`, width: width ?? '2.1rem', height: height ?? '2.1rem'}}>
        <p className='dev-card__initials'>{text}</p>
      </div>
      {
        nameDev && <span className="dev-card__name">{nameDev}</span>
      }
      
    </div>
    
  )
}

export default Avatar