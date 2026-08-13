import { Router } from "express"
import { InvitationController } from "./invitations.controller"
import { authenticate } from "../auth/auth.middleware"
import { invitationExistByToken } from "./middleware/invitation.loader"


const router = Router()

router.use(authenticate)
router.param('token', invitationExistByToken)

router.post('/:token/accept', InvitationController.acceptInvitation)
router.post('/:token/rejected', InvitationController.rejectInvitation)
router.get('/:token', InvitationController.getInvitationByToken)

export default router