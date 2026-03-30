import './ProjectName.scss'


type ProjectNameProps = {
  text: string
  variant: string
}
const ProjectName = ({ text, variant } : ProjectNameProps) => {
  return (
    <div className='project'>
      <div className='project__color' style={{backgroundColor: `${variant}`}}></div>
      <p className='project__name'>{text}</p>
    </div>
    
  )
}

export default ProjectName