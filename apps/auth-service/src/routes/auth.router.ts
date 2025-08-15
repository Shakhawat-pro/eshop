import { Router } from "express"
import { authController } from "../controller/auth.controller"
// import { LoginUser, resetUserPassword, userForgotPassword, userRegistration, verifyForgotPassword, verifyUser } from "../controller/auth.controller"


const router = Router()

router.post("/user-registration", authController.userRegistration)
router.post("/verify-user", authController.verifyUser)
router.post("/login-user", authController.LoginUser)
router.post("/forgot-password-user", authController.userForgotPassword)
router.post("/verify-forgot-password-otp", authController.verifyForgotPassword)
router.post("/reset-password-user", authController.resetUserPassword)


export default router
