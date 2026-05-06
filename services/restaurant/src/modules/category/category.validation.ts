import { z } from "zod";



export const restaurantParamsSchema = z.object({
    restaurantId: z.string().uuid("Invalid restaurant ID"),
});


export const createCategorySchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Category name must be at least 2 characters")
        .max(50, "Category name cannot exceed 50 characters"),
});

export const categoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(50).default(10),
});

export const updateCategorySchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Category name must be at least 2 characters")
        .max(50, "Category name cannot exceed 50 characters"),
});

export const categoryParamsSchema = z.object({
    categoryId: z.string().uuid("Invalid category ID"),
});