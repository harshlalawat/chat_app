import express from "express";
import { protectRoute  } from "../middlewares/auth.middleware.js";
import { updateProfile, getAllUsers } from "../controllers/user.controller.js";

const router = express.Router();

router.put("/update-profile", protectRoute, updateProfile);
router.get("/", protectRoute, getAllUsers);

export default router;