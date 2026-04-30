import { Router } from "express";
import { createDiscountCodes, deleteDiscountCode, getCategories, getDiscountCodes } from "../controller/product.controller";
import isAuthenticated from "../../../../packages/middleware/isAuthenticated";

const router: Router = Router();

router.get("/get-categories", getCategories);

// Discount Codes
router.post("/create-discount-codes", createDiscountCodes);
router.get("/get-discount-codes", isAuthenticated, getDiscountCodes);
router.delete("/delete-discount-code/:id", isAuthenticated, deleteDiscountCode);


export default router;
