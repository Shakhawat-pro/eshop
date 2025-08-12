import { Router } from "express"
import { LoginUser, userRegistration, verifyUser } from "../controller/auth.controller"


const router = Router()

router.post("/user-registration", userRegistration)
router.post("/verify-user", verifyUser)
router.post("/login-user", LoginUser)


export default router
