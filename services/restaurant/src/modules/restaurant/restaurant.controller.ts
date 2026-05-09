import type { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../middleware/isAuth.js";
import { createRestaurantSchema, getAllRestaurantsSchema, getNearbyRestaurantsSchema, getRestaurantByIdSchema, updateRestaurantSchema } from "./restaurant.validation.js";
import * as restaurantService from "./restaurant.service.js";
import ErrorResponse from "../../utils/ErrorResponse.js";
import logger from "../../utils/logger.js";




export const createRestaurant = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    const userId = req.user?.id;

    try {
        // 🔐 1. Auth guard
        if (!userId) {
            logger.warn("Unauthorized restaurant creation attempt", {
                route: "POST /restaurants",
            });
            return next(new ErrorResponse("Unauthorized", 401));
        }

        // 🧾 2. Validate input
        const validatedData = createRestaurantSchema.parse(req.body);

        // 3. Log intent (safe fields only)
        logger.info("Creating restaurant", {
            userId,
            name: validatedData.name,
        });

        // 4. Service call
        const restaurant = await restaurantService.createRestaurant(
            validatedData,
            userId
        );

        // ✅ 5. Success log
        logger.info("Restaurant created successfully", {
            userId,
            restaurantId: restaurant.id,
        });

        // 📤 6. Response
        return res.status(201).json({
            success: true,
            message: "Restaurant created successfully",
            data: restaurant,
        });

    } catch (error: any) {
        // ❌ 7. Error log
        logger.error("Create restaurant failed", {
            userId,
            error: error.message,
        });

        return next(error);
    }
};



export const getMyRestaurant = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return next(new ErrorResponse("User not authenticated", 401));
        }

        const restaurant = await restaurantService.getRestaurantByOwnerId(userId);

        if (!restaurant) {
            return next(new ErrorResponse("Restaurant not found", 404));
        }

        return res.status(200).json({
            success: true,
            data: restaurant
        });

    } catch (error) {
        next(error);
    }
};

export const getNearbyRestaurants = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const validatedData = getNearbyRestaurantsSchema.parse(req.query);

        const result = await restaurantService.getNearbyRestaurants(validatedData);

        if (!result.restaurants.length) {
            logger.info("No restaurants found near location", {
                user: req.user?.id,
                lat: validatedData.lat,
                lng: validatedData.lng,
                radius: validatedData.radius
            });

            return res.status(200).json({
                success: true,
                message: "No restaurants found near your location",
                data: [],
                pagination: result.pagination
            });
        }

        logger.info("Nearby restaurants fetched successfully", {
            user: req.user?.id,
            count: result.restaurants.length
        });

        return res.status(200).json({
            success: true,
            message: "Nearby restaurants fetched successfully",
            data: result.restaurants,
            pagination: result.pagination
        });

    } catch (error) {
        next(error);
    }
};

// restaurant.controller.ts

export const getRestaurantById = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        // 🧾 1. Validate params
        const { id } = getRestaurantByIdSchema.parse(req.params);

        // 📞 2. Service call
        const restaurant = await restaurantService.getRestaurantById(id);

        // ❌ 3. Not found
        if (!restaurant) {
            logger.warn("Restaurant not found", { restaurantId: id });
            return next(new ErrorResponse("Restaurant not found", 404));
        }

        // ✅ 4. Success log
        logger.info("Restaurant fetched", { restaurantId: id });

        // 📤 5. Response
        return res.status(200).json({
            success: true,
            data: restaurant,
        });

    } catch (error: any) {
        logger.error("Get restaurant by ID failed", {
            error: error.message,
            params: req.params,
        });

        next(error);
    }
};

export const updateRestaurant = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    const userId = req.user?.id;

    try {
        if (!userId) {
            return next(new ErrorResponse("Unauthorized", 401));
        }

        const { id } = getRestaurantByIdSchema.parse(req.params);
        const validatedData = updateRestaurantSchema.parse(req.body);

        const restaurant = await restaurantService.updateRestaurant(
            id,
            userId,
            validatedData
        );

        if (!restaurant) {
            return next(new ErrorResponse("Restaurant not found", 404));
        }

        logger.info("Restaurant updated", { restaurantId: id, userId });

        return res.status(200).json({
            success: true,
            message: "Restaurant updated successfully",
            data: restaurant,
        });

    } catch (error: any) {
        logger.error("Update restaurant failed", {
            error: error.message,
            userId,
        });
        next(error);
    }
};

export const deleteRestaurantById = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    const userId = req.user?.id;

    try {
        if (!userId) {
            return next(new ErrorResponse("Unauthorized", 401));
        }

        const { id } = getRestaurantByIdSchema.parse(req.params);

        const deleted = await restaurantService.deleteRestaurantById(
            id,
            userId
        );

        if (!deleted) {
            return next(new ErrorResponse("Restaurant not found", 404));
        }

        logger.info("Restaurant deleted", { restaurantId: id, userId });

        return res.status(200).json({
            success: true,
            message: "Restaurant deleted successfully",
        });

    } catch (error: any) {
        logger.error("Delete restaurant failed", {
            error: error.message,
            userId,
        });
        next(error);
    }
};

// restaurant.controller.ts

export const getAllRestaurants = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    const userId = req.user?.id;

    try {
        const validated = getAllRestaurantsSchema.parse(req.query);

        const result = await restaurantService.getAllRestaurants(validated);

        // Log admin-only action
        logger.info("All restaurants fetched", {
            user: userId,
            count: result.restaurants.length,
        });

        return res.status(200).json({
            success: true,
            message: "Restaurants fetched successfully",
            data: result.restaurants,
            pagination: result.pagination,

        });

    } catch (error: any) {
        logger.error("Get all restaurants failed", {
            error: error.message,
            userId,
        });
        next(error);
    }
};

