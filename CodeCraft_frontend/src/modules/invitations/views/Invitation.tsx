import { useParams } from "react-router-dom"


const Invitation = () => {
  
  const { token } = useParams()

  console.log(token)
  
  return (
    <div>Vista de invitaciones</div>
  )
}

export default Invitation