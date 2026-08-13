import { Router } from "express";
import { AuthController } from "./auth.controller"
import { validateCreateAccount, validateLogin, validatePassword, validateRegisterGoogle, validateToken, validateTokenParam } from "./validators/auth.validator"
import { validateRequest } from "../../middleware/validation"
import { authenticate } from "../auth/auth.middleware";
import { emailBodyValidator, emailQueryValidator } from "../../mails/email.validator";

const router = Router()

router.post('/create-account', validateCreateAccount, validateRequest, AuthController.createAccount)
router.post('/google', validateRegisterGoogle, validateRequest, AuthController.googleAuth)

router.post('/confirm-account', validateToken, validateRequest, AuthController.confirmAccount)

router.post('/resend-confirmation', emailBodyValidator, validateRequest, AuthController.resendConfirmation)

router.post('/login', validateLogin, validateRequest, AuthController.login)

router.post('/forgot-password', emailBodyValidator, validateRequest, AuthController.forgotPassword)

router.post('/request-code', emailBodyValidator, validateRequest, AuthController.requestConfirmationCode)

router.post('/validate-token', validateToken, validateRequest, AuthController.validateToken)

router.post('/update-password/:token', validateTokenParam, validatePassword, AuthController.updatePasswordWithToken)

router.get('/email-exists', emailQueryValidator, validateRequest, AuthController.checkEmailExists)

router.get('/user', authenticate, AuthController.user)


export default router

