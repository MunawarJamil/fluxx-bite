import express from "express";
import { isAuth } from "../../middleware/isAuth.js";
import { createCategory, deleteCategory, getRestaurantCategories, updateCategory } from "./category.controller.js";



const router = express.Router();

/**
 * @route   POST /restaurants/:restaurantId/categories
 * @desc    Create category for restaurant
 * @access  Private (Restaurant Owner)
 */
router.post(
    "/restaurants/:restaurantId/categories",
    isAuth,
    createCategory
);

/**
 * @route   GET /restaurants/:restaurantId/categories
 * @desc    Get restaurant categories
 * @access  Public
 */
router.get(
    "/restaurants/:restaurantId/categories",
    getRestaurantCategories
);

/**
 * @route   PATCH /categories/:categoryId
 * @desc    Update category
 * @access  Private (Restaurant Owner)
 */
router.patch(
    "/categories/:categoryId",
    isAuth,
    updateCategory
);

/**
 * @route   DELETE /categories/:categoryId
 * @desc    Delete category
 * @access  Private (Restaurant Owner)
 */
router.delete(
    "/categories/:categoryId",
    isAuth,
    deleteCategory
);

export default router;