const express = require("express");
const { getAllUsers, createUser, getUserById, updateUserById, deleteUserById } = require("../controllers/userController");

const router = express.Router();

// const { protect, authorize } = require("../middlewares/auth");

// router.use(protect);
// router.use(authorize("admin"));

router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").get(getUserById).put(updateUserById).delete(deleteUserById);


module.exports = router;