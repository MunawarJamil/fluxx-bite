import express from "express";
import { createRestaurant, getMyRestaurant } from "./restaurant.controller.js";
import { isAuth } from "../../middleware/isAuth.js";

const router = express.Router();

router.post("/", isAuth, createRestaurant);
router.get("/me", isAuth, getMyRestaurant);

export default router;