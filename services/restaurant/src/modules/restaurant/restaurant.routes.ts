import express from "express";
import {
    createRestaurant,
    getMyRestaurant,
    getNearbyRestaurants,
    getRestaurantById,
    updateRestaurant,
    deleteRestaurantById,
    getAllRestaurants
} from "./restaurant.controller.js";
import { isAuth } from "../../middleware/isAuth.js";
import { authorize } from "../../middleware/authorize.js";

const router = express.Router();

router.get("/nearby", getNearbyRestaurants);
router.post("/", isAuth, authorize("seller"), createRestaurant);
router.get("/", getAllRestaurants);

router.get("/me", isAuth, authorize("seller"), getMyRestaurant);
router.get("/:id", getRestaurantById);
router.patch("/:id", isAuth, authorize("seller"), updateRestaurant);
router.delete("/:id", isAuth, authorize("seller"), deleteRestaurantById);


export default router;
