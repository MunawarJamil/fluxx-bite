export interface MenuCategory {
    id: string;
    name: string;
}

export interface MenuItem {
    id: string;

    name: string;

    description?: string;

    price: number;

    imageUrl?: string;

    isAvailable: boolean;

    createdAt: string;

    category: MenuCategory;
}

export interface GetRestaurantMenuItemsResponse {
    success: boolean;

    message: string;

    data: MenuItem[];

    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface CreateMenuItemResponse {
    success: boolean;

    message: string;

    data: MenuItem;
}


export interface UpdateMenuItemResponse {
    success: boolean;

    message: string;

    data: MenuItem;
}

export interface DeleteMenuItemResponse {
    success: boolean;

    message: string;
}

export interface ToggleAvailabilityResponse {
    success: boolean;

    message: string;

    data: {
        id: string;

        name: string;

        isAvailable: boolean;

        updatedAt: string;
    };
}