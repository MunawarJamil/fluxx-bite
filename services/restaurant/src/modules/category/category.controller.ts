import type { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../middleware/isAuth.js";
import logger from "../../utils/logger.js";
import ErrorResponse from "../../utils/ErrorResponse.js";
import { categoryParamsSchema, categoryQuerySchema, createCategorySchema, restaurantParamsSchema, updateCategorySchema } from "./category.validation.js";

import * as categoryService from "./category.service.js";

export const createCategory = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {

    const ownerId = req.user?.id;

    try {

        // 🔐 1. Authentication guard
        if (!ownerId) {
            logger.warn("Unauthorized category creation attempt", {
                route: "POST /restaurants/:restaurantId/categories",
            });

            return next(new ErrorResponse("Unauthorized", 401));
        }

        // 🧾 2. Validate params
        const { restaurantId } = restaurantParamsSchema.parse(req.params);

        // 🧾 3. Validate request body
        const validatedData = createCategorySchema.parse(req.body);

        // 📌 4. Intent log
        logger.info("Creating category", {
            ownerId,
            restaurantId,
            categoryName: validatedData.name,
        });

        // ⚙️ 5. Service call
        const category = await categoryService.createCategory(
            validatedData,
            restaurantId,
            ownerId
        );

        // ✅ 6. Success log
        logger.info("Category created successfully", {
            ownerId,
            restaurantId,
            categoryId: category.id,
        });

        // 📤 7. Response
        return res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: category,
        });

    } catch (error: any) {

        // ❌ 8. Error log
        logger.error("Create category failed", {
            ownerId,
            error: error.message,
        });

        return next(error);
    }
};

export const getRestaurantCategories = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {

    try {

        // 🧾 1. Validate params
        const { restaurantId } =
            restaurantParamsSchema.parse(req.params);

        // 🧾 2. Validate query
        const { page, limit } =
            categoryQuerySchema.parse(req.query);

        // 📌 3. Intent log
        logger.info("Fetching restaurant categories", {
            restaurantId,
            page,
            limit,
        });

        // ⚙️ 4. Service call
        const result =
            await categoryService.getRestaurantCategories({
                restaurantId,
                page,
                limit,
            });

        // ✅ 5. Success log
        logger.info("Restaurant categories fetched successfully", {
            restaurantId,
            totalCategories: result.pagination.total,
        });

        // 📤 6. Response
        return res.status(200).json({
            success: true,
            message: "Categories fetched successfully",
            data: result.categories,
            pagination: result.pagination,
        });

    } catch (error: any) {

        // ❌ 7. Error log
        logger.error("Fetch restaurant categories failed", {
            error: error.message,
        });

        return next(error);
    }
};

export const updateCategory = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {

    const ownerId = req.user?.id;

    try {

        // 🔐 1. Auth guard
        if (!ownerId) {

            logger.warn("Unauthorized category update attempt", {
                route: "PATCH /categories/:categoryId",
            });

            return next(new ErrorResponse("Unauthorized", 401));
        }

        // 🧾 2. Validate params
        const { categoryId } =
            categoryParamsSchema.parse(req.params);

        // 🧾 3. Validate body
        const validatedData =
            updateCategorySchema.parse(req.body);

        // 📌 4. Intent log
        logger.info("Updating category", {
            ownerId,
            categoryId,
        });

        // ⚙️ 5. Service call
        const updatedCategory =
            await categoryService.updateCategory(
                validatedData,
                categoryId,
                ownerId
            );

        // ✅ 6. Success log
        logger.info("Category updated successfully", {
            ownerId,
            categoryId,
        });

        // 📤 7. Response
        return res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data: updatedCategory,
        });

    } catch (error: any) {

        logger.error("Update category failed", {
            ownerId,
            error: error.message,
        });

        return next(error);
    }
};


export const deleteCategory = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {

    const ownerId = req.user?.id;

    try {

        // 🔐 Auth guard
        if (!ownerId) {

            logger.warn("Unauthorized category deletion attempt", {
                route: "DELETE /categories/:categoryId",
            });

            return next(new ErrorResponse("Unauthorized", 401));
        }

        // 🧾 Validate params
        const { categoryId } =
            categoryParamsSchema.parse(req.params);

        logger.info("Deleting category", {
            ownerId,
            categoryId,
        });

        // ⚙️ Service call
        await categoryService.deleteCategory(
            categoryId,
            ownerId
        );

        logger.info("Category deleted successfully", {
            ownerId,
            categoryId,
        });

        // 📤 Response
        return res.status(200).json({
            success: true,
            message: "Category deleted successfully",
        });

    } catch (error: any) {

        logger.error("Delete category failed", {
            ownerId,
            error: error.message,
        });

        return next(error);
    }
};