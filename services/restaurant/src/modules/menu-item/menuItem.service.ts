import prisma from "../../config/prisma.js";
import ErrorResponse from "../../utils/ErrorResponse.js";

import logger from "../../utils/logger.js";


interface CreateMenuItemInput {
    name: string;
    description?: string | undefined;
    price: number;
    categoryId: string;
    imageUrl?: string | undefined;
    isAvailable?: boolean | undefined;
}


interface GetRestaurantMenuItemsInput {
    restaurantId: string;
    page: number;
    limit: number;
    categoryId?: string | undefined;
    isAvailable?: string | undefined;
}

interface UpdateMenuItemInput {
    name?: string | undefined;
    description?: string | undefined;
    price?: number | undefined;
    categoryId?: string | undefined;
    imageUrl?: string | undefined;
    isAvailable?: boolean | undefined;
}



export const createMenuItem = async (
    data: CreateMenuItemInput,
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
        },
    });

    if (!restaurant) {

        logger.warn("Unauthorized menu item creation attempt", {
            ownerId,
            restaurantId,
        });

        throw new ErrorResponse(
            "Restaurant not found or unauthorized",
            404
        );
    }

    // 2. Verify category belongs to same restaurant
    const category = await prisma.category.findFirst({
        where: {
            id: data.categoryId,
            restaurantId,
        },
        select: {
            id: true,
            name: true,
        },
    });

    if (!category) {

        logger.warn("Invalid category for menu item creation", {
            ownerId,
            restaurantId,
            categoryId: data.categoryId,
        });

        throw new ErrorResponse(
            "Category not found in this restaurant",
            404
        );
    }

    // 3. Create menu item



    const menuItem = await prisma.menuItem.create({
        data: {
            restaurantId,
            categoryId: data.categoryId,
            name: data.name,
            ...(data.description !== undefined && {
                description: data.description,
            }),

            ...(data.imageUrl !== undefined && {
                imageUrl: data.imageUrl,
            }),

            price: data.price,
            isAvailable: data.isAvailable ?? true,
        },
    });

    return menuItem;
};




export const getRestaurantMenuItems = async ({
    restaurantId,
    page,
    limit,
    categoryId,
    isAvailable,
}: GetRestaurantMenuItemsInput) => {

    // 1. Verify restaurant exists
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

        logger.warn("Restaurant not found while fetching menu items", {
            restaurantId,
        });

        throw new ErrorResponse("Restaurant not found", 404);
    }

    // 2. Pagination math
    const skip = (page - 1) * limit;

    // 3. Dynamic filters
    const whereClause: any = {
        restaurantId,
    };

    if (categoryId) {
        whereClause.categoryId = categoryId;
    }

    if (isAvailable !== undefined) {
        whereClause.isAvailable = isAvailable === "true";
    }

    // 4. Fetch menu items + count in parallel
    const [menuItems, total] = await Promise.all([

        prisma.menuItem.findMany({
            where: whereClause,

            orderBy: {
                createdAt: "desc",
            },

            skip,
            take: limit,

            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                imageUrl: true,
                isAvailable: true,
                createdAt: true,

                category: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        }),

        prisma.menuItem.count({
            where: whereClause,
        }),
    ]);

    return {
        menuItems,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
};




export const updateMenuItem = async (
    data: UpdateMenuItemInput,
    menuItemId: string,
    ownerId: string
) => {

    // 1. Verify ownership
    const existingMenuItem = await prisma.menuItem.findFirst({
        where: {
            id: menuItemId,

            restaurant: {
                ownerId,
                isDeleted: false,
            },
        },

        select: {
            id: true,
            restaurantId: true,
            categoryId: true,
        },
    });

    if (!existingMenuItem) {

        logger.warn("Unauthorized menu item update attempt", {
            ownerId,
            menuItemId,
        });

        throw new ErrorResponse(
            "Menu item not found or unauthorized",
            404
        );
    }

    // 2. Validate category ownership if category changing
    if (data.categoryId !== undefined) {

        const validCategory = await prisma.category.findFirst({
            where: {
                id: data.categoryId,
                restaurantId: existingMenuItem.restaurantId,
            },
            select: {
                id: true,
            },
        });

        if (!validCategory) {

            logger.warn("Invalid category update attempt", {
                ownerId,
                menuItemId,
                categoryId: data.categoryId,
            });

            throw new ErrorResponse(
                "Category does not belong to this restaurant",
                400
            );
        }
    }

    // 3. Update menu item
    const updatedMenuItem = await prisma.menuItem.update({
        where: {
            id: menuItemId,
        },

        data: {
            ...(data.name !== undefined && {
                name: data.name,
            }),

            ...(data.description !== undefined && {
                description: data.description,
            }),

            ...(data.price !== undefined && {
                price: data.price,
            }),

            ...(data.categoryId !== undefined && {
                categoryId: data.categoryId,
            }),

            ...(data.imageUrl !== undefined && {
                imageUrl: data.imageUrl,
            }),

            ...(data.isAvailable !== undefined && {
                isAvailable: data.isAvailable,
            }),
        },
    });

    return updatedMenuItem;
};


export const deleteMenuItem = async (
    menuItemId: string,
    ownerId: string
) => {

    // 1. Verify ownership
    const existingMenuItem = await prisma.menuItem.findFirst({
        where: {
            id: menuItemId,

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

    if (!existingMenuItem) {

        logger.warn("Unauthorized menu item deletion attempt", {
            ownerId,
            menuItemId,
        });

        throw new ErrorResponse(
            "Menu item not found or unauthorized",
            404
        );
    }

    // 2. Delete menu item
    await prisma.menuItem.delete({
        where: {
            id: menuItemId,
        },
    });

    return true;
};


interface ToggleAvailabilityInput {
    isAvailable: boolean;
}

export const toggleMenuItemAvailability = async (
    data: ToggleAvailabilityInput,
    menuItemId: string,
    ownerId: string
) => {

    // 1. Verify ownership
    const existingMenuItem = await prisma.menuItem.findFirst({
        where: {
            id: menuItemId,

            restaurant: {
                ownerId,
                isDeleted: false,
            },
        },

        select: {
            id: true,
            isAvailable: true,
        },
    });

    if (!existingMenuItem) {

        logger.warn("Unauthorized menu item availability update attempt", {
            ownerId,
            menuItemId,
        });

        throw new ErrorResponse(
            "Menu item not found or unauthorized",
            404
        );
    }

    // 2. Prevent unnecessary update
    if (existingMenuItem.isAvailable === data.isAvailable) {

        logger.info("Menu item availability unchanged", {
            ownerId,
            menuItemId,
            isAvailable: data.isAvailable,
        });

        return existingMenuItem;
    }

    // 3. Update availability
    const updatedMenuItem = await prisma.menuItem.update({
        where: {
            id: menuItemId,
        },

        data: {
            isAvailable: data.isAvailable,
        },

        select: {
            id: true,
            name: true,
            isAvailable: true,
            updatedAt: true,
        },
    });

    return updatedMenuItem;
};