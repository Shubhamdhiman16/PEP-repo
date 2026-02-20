const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

// Protect all routes
router.use(authMiddleware);

// Only Admins can manage products
router.post("/", roleMiddleware(["admin"]), productController.createProduct);
router.put("/:id", roleMiddleware(["admin"]), productController.updateProduct);
router.delete("/:id", roleMiddleware(["admin"]), productController.deleteProduct);

// All authenticated users can view products
router.get("/", productController.getProducts);
router.get("/:id", productController.getProductById);

module.exports = router;
