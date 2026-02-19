const express = require("express");
const router = express.Router();

<<<<<<< HEAD
const { register, login } = require("../controllers/auth.controller");

router.post("/register", register);
router.post("/login", login);
=======
const { register, login, getMe } = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, getMe);
>>>>>>> 649a4f5627c18cda61aed714307f2bc5c61773d4

module.exports = router;
