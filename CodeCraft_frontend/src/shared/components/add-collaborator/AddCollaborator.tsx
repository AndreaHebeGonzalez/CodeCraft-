import { Cancel, Add } from "@/assets/icon"
import Avatar from "../avatar/Avatar"
import { FormInput } from "../form"
import './AddCollaborator.scss'


const AddCollaborator = () => {
  
  return (
    <div className="add-collaborator">
      <div className="add-collaborator__wrapper">
        <FormInput
          id = 'collaborator'
        />
      </div>

      {
        <div className="add-collaborator__users-box">
          <div className="add-collaborator__users-email-box">
            <div className="add-collaborator__user-email-box">
              <Avatar 
                text="RM"
                variant='#044DBC'

              />
              <p className="add-collaborator__email">gz5691015rz@gmail.com</p>
              <Cancel
                width={15}
                height={15}
                onClick={() => {}}
                className="add-collaborator__member-remove"
              />
            </div>
            <div className="add-collaborator__user-email-box">
              <Avatar 
                text="CG"
                variant='#7cbc04ff'

              />
              <p className="add-collaborator__email">gz5691015rz@gmail.com</p>
              <Cancel
                width={15}
                height={15}
                onClick={() => {}}
                className="add-collaborator__member-remove"
              />
            </div>
            <div className="add-collaborator__link-add">
              <Add 
                width={20}
                height={20}
              />
              <p className="add-collaborator__link-text">
                Invitar a compañeros de equipo por email
              </p>
            </div>
          </div>
          <div>

          </div>
        </div>
      }
      
    </div>
  )
}

export default AddCollaborator