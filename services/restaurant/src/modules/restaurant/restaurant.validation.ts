import { z } from "zod";

export const createRestaurantSchema = z.object({
    name: z.string().min(3),
    description: z.string().nullable().optional(),
    address: z.string().min(5),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
});

export type CreateRestaurantInput = z.infer<typeof createRestaurantSchema>;

export const updateRestaurantSchema = z.object({
    name: z.string().min(3).optional(),
    description: z.string().optional(),
    address: z.string().min(5).optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
});

export const getNearbyRestaurantsSchema = z.object({
    lat: z.string().transform(Number),
    lng: z.string().transform(Number),
    radius: z.string().transform(Number).optional(),
    page: z.string().transform(Number).optional(),
    limit: z.string().transform(Number).optional(),
});

export const searchRestaurantsSchema = z.object({
    q: z.string(),
    page: z.string().transform(Number).optional(),
    limit: z.string().transform(Number).optional(),
});

