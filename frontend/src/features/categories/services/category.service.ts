import { restaurantApi as api } from "../../../api/restaurantApi/restaurant-api";

import type {
    CreateCategoryPayload,
    CreateCategoryResponse,
    DeleteCategoryResponse,
    GetCategoriesResponse,
    UpdateCategoryPayload,
    UpdateCategoryResponse
} from "../types/category.types";

const BASE_URL = "/restaurants";

export const categoryService = {
    /**
     * Create category
    //  */
    createCategory: async (
        restaurantId: string,
        payload: CreateCategoryPayload
    ): Promise<CreateCategoryResponse> => {

        const response =
            await api.post<CreateCategoryResponse>(
                `${BASE_URL}/${restaurantId}/categories`,
                payload
            );

        return response.data;
    },


    /**
     * Get restaurant categories
     */
    getRestaurantCategories: async (
        restaurantId: string,
        page = 1,
        limit = 10
    ): Promise<GetCategoriesResponse> => {

        const safePage =
            Math.max(Number(page) || 1, 1);

        const safeLimit =
            Math.min(
                Math.max(Number(limit) || 10, 1),
                50
            );

        const response =
            await api.get<GetCategoriesResponse>(
                `/restaurants/${restaurantId}/categories`,
                {
                    params: {
                        page: safePage,
                        limit: safeLimit,
                    },
                }
            );

        return response.data;
    },

    /**
     * Update category
     */
    updateCategory: async (
        categoryId: string,
        payload: UpdateCategoryPayload
    ): Promise<UpdateCategoryResponse> => {

        const response =
            await api.patch<UpdateCategoryResponse>(
                `/categories/${categoryId}`,
                payload
            );

        return response.data;
    },

    /**
     * Delete category
     */
    deleteCategory: async (
        categoryId: string
    ): Promise<DeleteCategoryResponse> => {

        const response =
            await api.delete<DeleteCategoryResponse>(
                `/categories/${categoryId}`
            );

        return response.data;
    },






};