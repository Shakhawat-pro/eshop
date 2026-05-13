import { Router } from "express";
import multer from "multer";
import { createDiscountCodes, deleteDiscountCode, deleteProductImage, getCategories, getDiscountCodes, uploadProductImage } from "../controller/product.controller";
import isAuthenticated from "../../../../packages/middleware/isAuthenticated";
import { isSeller } from "../../../../packages/middleware/authorizeRoles";

const router: Router = Router();
const upload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 10 * 1024 * 1024 }
});

router.get("/get-categories", getCategories);

// Discount Codes
router.post("/create-discount-codes", isAuthenticated, isSeller, createDiscountCodes);
router.get("/get-discount-codes", isAuthenticated, getDiscountCodes);
router.delete("/delete-discount-code/:id", isAuthenticated, deleteDiscountCode);

// Product Images
router.post("/upload-product-image", isAuthenticated, upload.single("image"), uploadProductImage);
router.delete("/delete-product-image", isAuthenticated, deleteProductImage);


export default router;
