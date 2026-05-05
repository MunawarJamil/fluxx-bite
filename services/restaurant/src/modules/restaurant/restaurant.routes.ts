import express from "express";
import { createRestaurant, getMyRestaurant } from "./restaurant.controller.js";
import { isAuth } from "../../middleware/isAuth.js";
import { authorize } from "../../middleware/authorize.js";

const router = express.Router();

router.post("/", isAuth, authorize("seller"), createRestaurant);
router.get("/me", isAuth, authorize("seller"), getMyRestaurant);

export default router;