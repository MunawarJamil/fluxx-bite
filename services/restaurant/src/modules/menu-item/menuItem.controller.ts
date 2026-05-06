import type { Response, NextFunction } from "express";

import type { AuthenticatedRequest } from "../../middleware/isAuth.js";

import logger from "../../utils/logger.js";
import ErrorResponse from "../../utils/ErrorResponse.js";
import { createMenuItemSchema, getMenuItemsQuerySchema, menuItemParamsSchema, menuParamsSchema, toggleAvailabilitySchema, updateMenuItemSchema } from "./menuItem.validation.js";
import * as menuItemService from "./menuItem.service.js"
import { restaurantParamsSchema } from "../category/category.validation.js";

export const createMenuItem = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {

    const ownerId = req.user?.id;

    try {

        // 🔐 Auth guard
        if (!ownerId) {

            logger.warn("Unauthorized menu item creation attempt", {
                route: "POST /restaurants/:restaurantId/menu-items",
            });

            return next(new ErrorResponse("Unauthorized", 401));
        }

        // 🧾 Validate params
        const { restaurantId } =
            menuParamsSchema.parse(req.params);

        // 🧾 Validate body
        const validatedData =
            createMenuItemSchema.parse(req.body);

        // 📌 Intent log
        logger.info("Creating menu item", {
            ownerId,
            restaurantId,
            categoryId: validatedData.categoryId,
            menuItemName: validatedData.name,
        });

        // ⚙️ Service call
        const menuItem =
            await menuItemService.createMenuItem(
                validatedData,
                restaurantId,
                ownerId
            );

        // ✅ Success log
        logger.info("Menu item created successfully", {
            ownerId,
            restaurantId,
            menuItemId: menuItem.id,
        });

        // 📤 Response
        return res.status(201).json({
            success: true,
            message: "Menu item created successfully",
            data: menuItem,
        });

    } catch (error: any) {

        logger.error("Create menu item failed", {
            ownerId,
            error: error.message,
        });

        return next(error);
    }
};


export const getRestaurantMenuItems = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {

    try {

        // 🧾 Validate params
        const { restaurantId } =
            restaurantParamsSchema.parse(req.params);

        // 🧾 Validate query
        const validatedQuery =
            getMenuItemsQuerySchema.parse(req.query);

        // 📌 Intent log
        logger.info("Fetching restaurant menu items", {
            restaurantId,
            ...validatedQuery,
        });

        // ⚙️ Service call
        const result =
            await menuItemService.getRestaurantMenuItems({
                restaurantId,
                ...validatedQuery,
            });

        // ✅ Success log
        logger.info("Restaurant menu items fetched successfully", {
            restaurantId,
            total: result.pagination.total,
        });

        // 📤 Response
        return res.status(200).json({
            success: true,
            message: "Menu items fetched successfully",
            data: result.menuItems,
            pagination: result.pagination,
        });

    } catch (error: any) {

        logger.error("Fetch menu items failed", {
            error: error.message,
        });

        return next(error);
    }
};


export const updateMenuItem = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {

    const ownerId = req.user?.id;

    try {

        // 🔐 Auth guard
        if (!ownerId) {

            logger.warn("Unauthorized menu item update attempt", {
                route: "PATCH /menu-items/:menuItemId",
            });

            return next(new ErrorResponse("Unauthorized", 401));
        }

        // 🧾 Validate params
        const { menuItemId } =
            menuItemParamsSchema.parse(req.params);

        // 🧾 Validate body
        const validatedData =
            updateMenuItemSchema.parse(req.body);

        // Prevent empty updates
        if (Object.keys(validatedData).length === 0) {

            return next(
                new ErrorResponse(
                    "At least one field is required for update",
                    400
                )
            );
        }

        // 📌 Intent log
        logger.info("Updating menu item", {
            ownerId,
            menuItemId,
        });

        // ⚙️ Service call
        const updatedMenuItem =
            await menuItemService.updateMenuItem(
                validatedData,
                menuItemId,
                ownerId
            );

        // ✅ Success log
        logger.info("Menu item updated successfully", {
            ownerId,
            menuItemId,
        });

        // 📤 Response
        return res.status(200).json({
            success: true,
            message: "Menu item updated successfully",
            data: updatedMenuItem,
        });

    } catch (error: any) {

        logger.error("Update menu item failed", {
            ownerId,
            error: error.message,
        });

        return next(error);
    }
};


export const deleteMenuItem = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {

    const ownerId = req.user?.id;

    try {

        // 🔐 Auth guard
        if (!ownerId) {

            logger.warn("Unauthorized menu item deletion attempt", {
                route: "DELETE /menu-items/:menuItemId",
            });

            return next(new ErrorResponse("Unauthorized", 401));
        }

        // 🧾 Validate params
        const { menuItemId } =
            menuItemParamsSchema.parse(req.params);

        // 📌 Intent log
        logger.info("Deleting menu item", {
            ownerId,
            menuItemId,
        });

        // ⚙️ Service call
        await menuItemService.deleteMenuItem(
            menuItemId,
            ownerId
        );

        // ✅ Success log
        logger.info("Menu item deleted successfully", {
            ownerId,
            menuItemId,
        });

        // 📤 Response
        return res.status(200).json({
            success: true,
            message: "Menu item deleted successfully",
        });

    } catch (error: any) {

        logger.error("Delete menu item failed", {
            ownerId,
            error: error.message,
        });

        return next(error);
    }
};

export const toggleMenuItemAvailability = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {

    const ownerId = req.user?.id;

    try {

        // 🔐 Auth guard
        if (!ownerId) {

            logger.warn("Unauthorized menu item availability update attempt", {
                route: "PATCH /menu-items/:menuItemId/toggle-availability",
            });

            return next(new ErrorResponse("Unauthorized", 401));
        }

        // 🧾 Validate params
        const { menuItemId } =
            menuItemParamsSchema.parse(req.params);

        // 🧾 Validate body
        const validatedData =
            toggleAvailabilitySchema.parse(req.body);

        // 📌 Intent log
        logger.info("Updating menu item availability", {
            ownerId,
            menuItemId,
            isAvailable: validatedData.isAvailable,
        });

        // ⚙️ Service call
        const updatedMenuItem =
            await menuItemService.toggleMenuItemAvailability(
                validatedData,
                menuItemId,
                ownerId
            );

        // ✅ Success log
        logger.info("Menu item availability updated successfully", {
            ownerId,
            menuItemId,
            isAvailable: updatedMenuItem.isAvailable,
        });

        // 📤 Response
        return res.status(200).json({
            success: true,
            message: "Menu item availability updated successfully",
            data: updatedMenuItem,
        });

    } catch (error: any) {

        logger.error("Toggle menu item availability failed", {
            ownerId,
            error: error.message,
        });

        return next(error);
    }
};