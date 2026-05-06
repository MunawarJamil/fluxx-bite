import { z } from "zod";

export const createRestaurantSchema = z.object({
    name: z.string().min(3),
    description: z.string().nullable().optional(),
    address: z.string().min(5),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
});

export type CreateRestaurantInput = z.infer<typeof createRestaurantSchema>;


export const getNearbyRestaurantsSchema = z.object({
    lat: z.string().transform(Number),
    lng: z.string().transform(Number),
    radius: z.string().transform(Number).optional(),
    page: z.string().transform(Number).optional(),
    limit: z.string().transform(Number).optional(),
});

export type GetNearbyRestaurantsInput = z.infer<typeof getNearbyRestaurantsSchema>;

export const searchRestaurantsSchema = z.object({
    q: z.string(),
    page: z.string().transform(Number).optional(),
    limit: z.string().transform(Number).optional(),
});

export const getRestaurantByIdSchema = z.object({
    id: z.string().uuid("Invalid restaurant ID"),
});



export const updateRestaurantSchema = z.object({
    name: z.string().min(2).optional(),
    description: z.string().optional(),
    address: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
});



export const getAllRestaurantsSchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(50).default(10),
});
