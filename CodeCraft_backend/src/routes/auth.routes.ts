import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validateCreateAccount, validateEmail, validateEmailQuery, validateLogin, validatePassword, validateRegisterGoogle, validateToken, validateTokenParam } from "../validators/auth.validator";
import { validateRequest } from "../middleware/validation";

const router = Router()

router.post('/create-account', validateCreateAccount, validateRequest, AuthController.createAccount)
router.post('/google', validateRegisterGoogle, validateRequest, AuthController.googleAuth)

router.post('/confirm-account', validateToken, validateRequest, AuthController.confirmAccount)

router.post('/resend-confirmation', validateEmail, validateRequest, AuthController.resendConfirmation)

router.post('/login', validateLogin, validateRequest, AuthController.login)

router.post('/forgot-password', validateEmail, validateRequest, AuthController.forgotPassword)

router.post('/request-code', validateEmail, validateRequest, AuthController.requestConfirmationCode)

router.post('/validate-token', validateToken, validateRequest, AuthController.validateToken)

router.post('/update-password/:token', validateTokenParam, validatePassword, AuthController.updatePasswordWithToken)

router.get('/email-exists', validateEmailQuery, validateRequest, AuthController.checkEmailExists)

export default router

