export interface Category {
    id: string;

    restaurantId: string;

    name: string;

    createdAt: string;
}

export interface CreateCategoryPayload {
    name: string;
}

export interface CreateCategoryResponse {
    success: boolean;

    message: string;

    data: Category;
}



// Get Categories types

export interface Pagination {
    total: number;

    page: number;

    limit: number;

    totalPages: number;
}

export interface GetCategoriesResponse {
    success: boolean;

    message: string;

    data: Category[];

    pagination: Pagination;
}

export interface UpdateCategoryPayload {
    name: string;
}

export interface UpdateCategoryResponse {
    success: boolean;

    message: string;

    data: Category;
}

export interface DeleteCategoryResponse {
    success: boolean;

    message: string;
}