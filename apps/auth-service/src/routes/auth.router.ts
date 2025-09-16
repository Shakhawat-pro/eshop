import { Router } from "express"
import { authController } from "../controller/auth.controller"
import isAuthenticated from "../../../../packages/middleware/isAuthenticated"
// import { LoginUser, resetUserPassword, userForgotPassword, userRegistration, verifyForgotPassword, verifyUser } from "../controller/auth.controller"


const router = Router()

router.post("/user-registration", authController.userRegistration)
router.post("/verify-user", authController.verifyUser)
router.post("/login-user", authController.LoginUser)
router.post("/refresh-token-user", authController.refreshToken)
router.get("/logged-in-user", isAuthenticated, authController.getUser)
router.post("/forgot-password-user", authController.userForgotPassword)
router.post("/reset-password-user", authController.resetUserPassword)
router.post("/verify-forgot-password-otp", authController.verifyForgotPassword)


export default router
