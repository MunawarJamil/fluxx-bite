import { z } from "zod";

export const getRestaurantMenuItemsQuerySchema =
    z.object({
        page: z.number().optional(),

        limit: z.number().optional(),

        categoryId: z
            .string()
            .uuid()
            .optional(),

        isAvailable: z
            .boolean()
            .optional(),
    });

export type GetRestaurantMenuItemsQuery =
    z.infer<
        typeof getRestaurantMenuItemsQuerySchema
    >;



export const createMenuItemSchema =
    z.object({
        name: z
            .string()
            .trim()
            .min(2)
            .max(100),

        description: z
            .string()
            .trim()
            .max(500)
            .optional(),

        price: z
            .number()
            .positive()
            .max(999999),

        categoryId: z.string().uuid(),

        imageUrl: z
            .string()
            .url()
            .optional(),

        isAvailable:
            z.boolean().optional(),
    });

export type CreateMenuItemPayload =
    z.infer<
        typeof createMenuItemSchema
    >;

export const updateMenuItemSchema =
    z.object({
        name: z
            .string()
            .trim()
            .min(2)
            .max(100)
            .optional(),

        description: z
            .string()
            .trim()
            .max(500)
            .optional(),

        price: z
            .number()
            .positive()
            .max(999999)
            .optional(),

        categoryId: z
            .string()
            .uuid()
            .optional(),

        imageUrl: z
            .string()
            .url()
            .optional(),

        isAvailable:
            z.boolean().optional(),
    });

export type UpdateMenuItemPayload =
    z.infer<
        typeof updateMenuItemSchema
    >;

export const toggleAvailabilitySchema =
    z.object({
        isAvailable: z.boolean(),
    });

export type ToggleAvailabilityPayload =
    z.infer<
        typeof toggleAvailabilitySchema
    >;