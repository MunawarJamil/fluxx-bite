import prisma from "../../config/prisma.js";
import { CreateRestaurantInput } from "./restaurant.validation.js";
import { cleanData } from "../../utils/objectUtils.js";
import ErrorResponse from "../../utils/ErrorResponse.js";
import logger from "../../utils/logger.js";

export const createRestaurant = async (
    data: CreateRestaurantInput,
    ownerId: string
) => {
    if (!ownerId) {
        throw new ErrorResponse("Owner ID is required", 400);
    }

    const cleanedData = cleanData(data);

    logger.info("Creating restaurant", {
        ownerId,
        payload: cleanedData,
    });

    try {
        const restaurant = await prisma.restaurant.create({
            data: {
                ...cleanedData,
                ownerId,
            },
        });

        logger.info("Restaurant created successfully", {
            ownerId,
            restaurantId: restaurant.id,
        });

        return restaurant;

    } catch (error: any) {
        logger.error("Create restaurant failed", {
            ownerId,
            error,
        });

        // Optional safety (not critical in your setup)
        if (error.code === "P2003") {
            throw new ErrorResponse("Invalid owner reference", 400);
        }

        throw new ErrorResponse("Failed to create restaurant", 500);
    }
};

export const getRestaurantByOwnerId = async (ownerId: string) => {
    return prisma.restaurant.findFirst({
        where: { id: ownerId },
    });
};