import { Router } from "express"
import { authController } from "../controller/auth.controller"
import isAuthenticated from "../../../../packages/middleware/isAuthenticated"
import { isSeller } from "../../../../packages/middleware/authorizeRoles"


const router = Router()

// User Routes
router.post("/user-registration", authController.userRegistration)
router.post("/verify-user", authController.verifyUser)
router.post("/login-user", authController.LoginUser)
router.post("/refresh-token-user", authController.refreshToken)
router.get("/logged-in-user", isAuthenticated, authController.getUser)
router.post("/forgot-password-user", authController.userForgotPassword)
router.post("/reset-password-user", authController.resetUserPassword)
router.post("/verify-forgot-password-otp", authController.verifyForgotPassword)

// Seller Routes
router.post("/seller-registration", authController.registerSeller)
router.post("/verify-seller", authController.verifySeller)
router.post("/create-shop", authController.createShop)
router.post("/connect-stripe", authController.createStripeConnectLink)
router.post("/login-seller", authController.LoginSeller)
router.post("/refresh-token-seller", authController.refreshToken)
router.get("/logged-in-seller", isAuthenticated, isSeller, authController.getSeller)
// router.post("/forgot-password-seller", authController.handleForgetPassword.bind(null, "seller"))
// router.post("/reset-password-seller", authController.resetSellerPassword)

// Logout Route (common for both users and sellers)


export default router
