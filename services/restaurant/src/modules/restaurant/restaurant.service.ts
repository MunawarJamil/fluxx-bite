import prisma from "../../config/prisma.js";
import { CreateRestaurantInput, GetNearbyRestaurantsInput } from "./restaurant.validation.js";
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
        where: { ownerId, isDeleted: false },
    });
};

/**
 * Get nearby restaurants using a bounding box approach (Index friendly)
 * @param params - lat, lng, radius (km), page, limit
 */
export const getNearbyRestaurants = async (params: GetNearbyRestaurantsInput) => {
    const { lat, lng, radius = 6, page = 1, limit = 10 } = params;

    // Bounding box
    const latDelta = radius / 111;
    const lngDelta = radius / (111 * Math.cos(lat * (Math.PI / 180)));

    const minLat = lat - latDelta;
    const maxLat = lat + latDelta;
    const minLng = lng - lngDelta;
    const maxLng = lng + lngDelta;

    // ✅ Step 1: Get ALL candidates (no pagination here)
    const candidates = await prisma.restaurant.findMany({
        where: {
            isOpen: true,
            isDeleted: false,
            latitude: { gte: minLat, lte: maxLat },
            longitude: { gte: minLng, lte: maxLng },
        },
    });

    // ✅ Step 2: Haversine function
    const getDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
        const R = 6371;
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLng = ((lng2 - lng1) * Math.PI) / 180;

        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLng / 2) ** 2;

        return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
    };

    // ✅ Step 3: Filter + attach distance
    const filtered = candidates
        .map(r => ({
            ...r,
            distance: getDistance(lat, lng, r.latitude, r.longitude),
        }))
        .filter(r => r.distance <= radius)
        .sort((a, b) => a.distance - b.distance);

    // ✅ Step 4: Pagination AFTER filtering
    const total = filtered.length;
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    return {
        restaurants: paginated,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
};


export const getRestaurantById = async (id: string) => {
    const restaurant = await prisma.restaurant.findUnique({
        where: { id, isDeleted: false },
        select: {
            id: true,
            name: true,
            description: true,
            address: true,
            latitude: true,
            longitude: true,
            createdAt: true,
            // future: rating, images, etc.
        },
    });

    return restaurant;
};

// restaurant.service.ts

export const updateRestaurant = async (
    restaurantId: string,
    userId: string,
    data: any
) => {
    const existing = await prisma.restaurant.findUnique({
        where: { id: restaurantId },
        select: { ownerId: true },
    });

    if (!existing) return null;

    if (existing.ownerId !== userId) {
        throw new ErrorResponse("Forbidden", 403);
    }

    const updated = await prisma.restaurant.update({
        where: { id: restaurantId },
        data,
    });

    return updated;
};

export const deleteRestaurantById = async (
    restaurantId: string,
    userId: string
) => {
    const existing = await prisma.restaurant.findUnique({
        where: { id: restaurantId },
        select: { ownerId: true },
    });

    if (!existing) return null;

    if (existing.ownerId !== userId) {
        throw new ErrorResponse("Forbidden", 403);
    }

    await prisma.restaurant.update({
        where: { id: restaurantId },
        data: { isDeleted: true },
    });

    return true;
};


export const getAllRestaurants = async ({
    page,
    limit,
}: {
    page: number;
    limit: number;
}) => {
    const skip = (page - 1) * limit;

    const [restaurants, total] = await Promise.all([
        prisma.restaurant.findMany({
            where: { isDeleted: false },
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                name: true,
                address: true,
                latitude: true,
                longitude: true,
                createdAt: true,
            },
        }),
        prisma.restaurant.count({
            where: { isDeleted: false },
        }),
    ]);

    return {
        restaurants,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
};

