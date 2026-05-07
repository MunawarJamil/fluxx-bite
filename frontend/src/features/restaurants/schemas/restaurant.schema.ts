import { z } from "zod";

export const getNearbyRestaurantsSchema =
    z.object({
        lat: z.coerce.number(),

        lng: z.coerce.number(),

        radius: z.coerce
            .number()
            .positive()
            .optional(),

        page: z.coerce
            .number()
            .int()
            .min(1)
            .optional(),

        limit: z.coerce
            .number()
            .int()
            .min(1)
            .max(50)
            .optional(),
    });


export type GetNearbyRestaurantsParamsSchemaType =
    z.infer<typeof getNearbyRestaurantsSchema>;

// For create restaurant (registered user)
export const createRestaurantSchema =
    z.object({
        name: z
            .string()
            .min(3)
            .max(100),

        address: z
            .string()
            .min(5)
            .max(255),

        latitude: z.coerce.number(),

        longitude: z.coerce.number(),
    });

export type CreateRestaurantPayloadSchemaType =
    z.infer<typeof createRestaurantSchema>;


// For get restaurant by id
export const getRestaurantByIdSchema =
    z.object({
        id: z.string(),
    });

export type GetRestaurantByIdParamsSchemaType =
    z.infer<typeof getRestaurantByIdSchema>;

export const updateRestaurantSchema =
    createRestaurantSchema.partial();


export const getAllRestaurantsSchema =
    z.object({
        page: z.coerce
            .number()
            .int()
            .min(1)
            .optional(),

        limit: z.coerce
            .number()
            .int()
            .min(1)
            .max(50)
            .optional(),
    });