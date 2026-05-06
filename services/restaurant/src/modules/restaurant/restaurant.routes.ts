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

router.get("/nearby", getNearbyRestaurants);//tested
router.post("/", isAuth, authorize("seller"), createRestaurant);//tested
router.get("/me", isAuth, authorize("seller"), getMyRestaurant);//tested
router.get("/", getAllRestaurants);//tested
router.get("/:id", getRestaurantById);//tested
router.patch("/:id", isAuth, authorize("seller"), updateRestaurant);//tested
router.delete("/:id", isAuth, authorize("seller"), deleteRestaurantById);//tested


export default router;
