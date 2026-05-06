import express from "express";

import { isAuth } from "../../middleware/isAuth.js";

import {
    createMenuItem,
    getRestaurantMenuItems,
    updateMenuItem,
    deleteMenuItem,
    toggleMenuItemAvailability
} from "./menuItem.controller.js";

const router = express.Router();

/**
 * @route   POST /restaurants/:restaurantId/menu-items
 * @desc    Create menu item
 * @access  Private (Restaurant Owner)
 */
router.post(
    "/restaurants/:restaurantId/menu-items",
    isAuth,
    createMenuItem
);

/**
 * @route   GET /restaurants/:restaurantId/menu-items
 * @desc    Get restaurant menu items
 * @access  Public
 */
router.get(
    "/restaurants/:restaurantId/menu-items",
    getRestaurantMenuItems
);

/**
 * @route   PATCH /menu-items/:menuItemId
 * @desc    Update menu item
 * @access  Private (Restaurant Owner)
 */
router.patch(
    "/menu-items/:menuItemId",
    isAuth,
    updateMenuItem
);

/**
 * @route   DELETE /menu-items/:menuItemId
 * @desc    Delete menu item
 * @access  Private (Restaurant Owner)
 */
router.delete(
    "/menu-items/:menuItemId",
    isAuth,
    deleteMenuItem
);

/**
 * @route   PATCH /menu-items/:menuItemId/toggle-availability
 * @desc    Toggle menu item availability
 * @access  Private (Restaurant Owner)
 */
router.patch(
    "/menu-items/:menuItemId/toggle-availability",
    isAuth,
    toggleMenuItemAvailability
);

export default router;