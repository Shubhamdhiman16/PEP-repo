const express = require("express");
const router = express.Router();
<<<<<<< HEAD
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
=======
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");

// Create a new product
router.post("/", createProduct);

// Get all products
router.get("/", getAllProducts);

// Get product by ID
router.get("/:id", getProductById);

// Update product
router.put("/:id", updateProduct);

// Delete product
router.delete("/:id", deleteProduct);
>>>>>>> be81d74981367e8fa3244dce181999b810509a0a

module.exports = router;
