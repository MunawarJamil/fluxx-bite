import { z } from "zod";

export const createMenuItemSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Menu item name must be at least 2 characters")
        .max(100, "Menu item name cannot exceed 100 characters"),

    description: z
        .string()
        .trim()
        .max(500, "Description cannot exceed 500 characters")
        .optional(),

    price: z
        .coerce.number()
        .positive("Price must be greater than 0")
        .max(999999, "Price exceeds allowed limit"),

    categoryId: z
        .uuid("Invalid category ID"),

    imageUrl: z
        .url("Invalid image URL")
        .optional(),

    isAvailable: z
        .boolean()
        .optional(),
});

export const menuParamsSchema = z.object({
    restaurantId: z.string().uuid("Invalid restaurant ID"),
});


export const getMenuItemsQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),

    limit: z.coerce.number().min(1).max(50).default(10),

    categoryId: z
        .string()
        .uuid("Invalid category ID")
        .optional(),

    isAvailable: z
        .enum(["true", "false"])
        .optional(),
});


export const menuItemParamsSchema = z.object({
    menuItemId: z.string().uuid("Invalid menu item ID"),
});

export const updateMenuItemSchema = z.object({

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
        .coerce.number()
        .positive()
        .max(999999)
        .optional(),

    categoryId: z
        .string()
        .uuid("Invalid category ID")
        .optional(),

    imageUrl: z
        .string()
        .url("Invalid image URL")
        .optional(),

    isAvailable: z
        .boolean()
        .optional(),
});


export const toggleAvailabilitySchema = z.object({
    isAvailable: z.boolean(),
});