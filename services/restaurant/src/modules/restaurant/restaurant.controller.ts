import type { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../middleware/isAuth.js";
import { createRestaurantSchema } from "./restaurant.validation.js";
import * as restaurantService from "./restaurant.service.js";
import ErrorResponse from "../../utils/ErrorResponse.js";




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



export const getMyRestaurant = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.user?.id) {
            return next(new ErrorResponse("User not authenticated", 401));
        }

        const restaurant = await restaurantService.getRestaurantByOwnerId(req.user.id);

        if (!restaurant) {
            return res.status(200).json({
                success: true,
                message: "No restaurant found for this owner",
                data: null
            });
        }

        res.status(200).json({
            success: true,
            data: restaurant
        });
    } catch (error) {
        next(error);
    }
};