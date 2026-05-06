import prisma from "../../config/prisma.js";
// import { Prisma } from "../../generated/client/index.js";
import ErrorResponse from "../../utils/ErrorResponse.js";
import logger from "../../utils/logger.js";

interface CreateCategoryInput {
    name: string;
}


interface UpdateCategoryInput {
    name: string;
}

export const createCategory = async (
    data: CreateCategoryInput,
    restaurantId: string,
    ownerId: string
) => {

    // 1. Verify restaurant ownership
    const restaurant = await prisma.restaurant.findFirst({
        where: {
            id: restaurantId,
            ownerId,
            isDeleted: false,
        },
        select: {
            id: true,
            name: true,
        },
    });

    if (!restaurant) {

        logger.warn("Restaurant not found for category creation", {
            ownerId,
            restaurantId,
        });

        throw new ErrorResponse(
            "Restaurant not found or unauthorized",
            404
        );
    }

    try {

        // 2. Create category
        const category = await prisma.category.create({
            data: {
                restaurantId,
                name: data.name,
            },
        });

        return category;

    } catch (error: any) {

        // // 3. Handle duplicate category
        // if (
        //     error instanceof Prisma.PrismaClientKnownRequestError &&
        //     error.code === "P2002"
        // ) {

        //     logger.warn("Duplicate category creation blocked", {
        //         ownerId,
        //         restaurantId,
        //         categoryName: data.name,
        //     });

        //     throw new ErrorResponse(
        //         "Category already exists for this restaurant",
        //         409
        //     );
        // }

        logger.error("Database error while creating category", {
            ownerId,
            restaurantId,
            error: error.message,
        });

        throw error;
    }
};

interface GetRestaurantCategoriesInput {
    restaurantId: string;
    page: number;
    limit: number;
}


export const getRestaurantCategories = async ({
    restaurantId,
    page,
    limit,
}: GetRestaurantCategoriesInput) => {

    // Pagination math
    const skip = (page - 1) * limit;

    // Verify restaurant exists
    const restaurantExists = await prisma.restaurant.findFirst({
        where: {
            id: restaurantId,
            isDeleted: false,
        },
        select: {
            id: true,
        },
    });

    if (!restaurantExists) {

        logger.warn("Restaurant not found while fetching categories", {
            restaurantId,
        });

        throw new ErrorResponse("Restaurant not found", 404);
    }

    // Fetch categories
    const [categories, total] = await Promise.all([

        prisma.category.findMany({
            where: {
                restaurantId,
            },
            orderBy: {
                createdAt: "desc",
            },
            skip,
            take: limit,
        }),

        prisma.category.count({
            where: {
                restaurantId,
            },
        }),
    ]);

    return {
        categories,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
};



export const updateCategory = async (
    data: UpdateCategoryInput,
    categoryId: string,
    ownerId: string
) => {

    // 1. Verify ownership through relational query
    const existingCategory = await prisma.category.findFirst({
        where: {
            id: categoryId,
            restaurant: {
                ownerId,
                isDeleted: false,
            },
        },
        select: {
            id: true,
            name: true,
            restaurantId: true,
        },
    });

    if (!existingCategory) {

        logger.warn("Unauthorized category update attempt", {
            ownerId,
            categoryId,
        });

        throw new ErrorResponse(
            "Category not found or unauthorized",
            404
        );
    }

    // 2. Prevent unnecessary DB write
    if (existingCategory.name === data.name) {

        logger.info("Category update skipped (same name)", {
            categoryId,
            ownerId,
        });

        return existingCategory;
    }

    try {

        // 3. Update category
        const updatedCategory = await prisma.category.update({
            where: {
                id: categoryId,
            },
            data: {
                name: data.name,
            },
        });

        return updatedCategory;

    } catch (error: any) {

        // // 4. Handle duplicate category name
        // if (
        //     error instanceof Prisma.PrismaClientKnownRequestError &&
        //     error.code === "P2002"
        // ) {

        //     logger.warn("Duplicate category update blocked", {
        //         ownerId,
        //         categoryId,
        //         categoryName: data.name,
        //     });

        //     throw new ErrorResponse(
        //         "Category with this name already exists",
        //         409
        //     );
        // }

        logger.error("Update category database error", {
            ownerId,
            categoryId,
            error: error.message,
        });

        throw error;
    }
};



export const deleteCategory = async (
    categoryId: string,
    ownerId: string
) => {

    // 1. Verify ownership + count menu items
    const existingCategory = await prisma.category.findFirst({
        where: {
            id: categoryId,
            restaurant: {
                ownerId,
                isDeleted: false,
            },
        },
        include: {
            _count: {
                select: {
                    menuItems: true,
                },
            },
        },
    });

    if (!existingCategory) {

        logger.warn("Unauthorized category delete attempt", {
            ownerId,
            categoryId,
        });

        throw new ErrorResponse(
            "Category not found or unauthorized",
            404
        );
    }

    // 2. Prevent deletion if menu items exist
    if (existingCategory._count.menuItems > 0) {

        logger.warn("Category deletion blocked (menu items exist)", {
            ownerId,
            categoryId,
            menuItemsCount: existingCategory._count.menuItems,
        });

        throw new ErrorResponse(
            "Cannot delete category with existing menu items",
            400
        );
    }

    // 3. Delete category
    await prisma.category.delete({
        where: {
            id: categoryId,
        },
    });

    return true;
};