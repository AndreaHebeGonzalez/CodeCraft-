import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validateCreateAccount, validateEmail, validateEmailQuery, validateLogin, validateRegisterGoogle, validateToken } from "../validators/auth.validator";
import { validateRequest } from "../middleware/validation";

const router = Router()

router.post('/create-account', validateCreateAccount, validateRequest, AuthController.createAccount)
router.post('/google', validateRegisterGoogle, validateRequest, AuthController.googleAuth)

router.post('/confirm-account', validateToken, validateRequest, AuthController.confirmAccount)

router.post('/resend-confirmation', validateEmail, validateRequest, AuthController.resendConfirmation)

router.post('login', validateLogin, validateRequest, AuthController.login)

router.get('/email-exists', validateEmailQuery, validateRequest, AuthController.checkEmailExists)

export default router