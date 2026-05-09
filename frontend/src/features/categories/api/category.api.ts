import { baseApi } from "../../../store/services/baseApi";

import { categoryService } from "../services/category.service";
import type { CreateCategoryPayload, CreateCategoryResponse, DeleteCategoryResponse, GetCategoriesResponse, UpdateCategoryPayload, UpdateCategoryResponse } from "../types/category.types";


export const categoryApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // Create category
        createCategory: builder.mutation<
            CreateCategoryResponse,
            {
                restaurantId: string;
                payload: CreateCategoryPayload;
            }
        >({
            queryFn: async ({
                restaurantId,
                payload,
            }) => {

                try {

                    const data =
                        await categoryService.createCategory(
                            restaurantId,
                            payload
                        );

                    return { data };

                } catch (error: any) {

                    return {
                        error: {
                            status:
                                error.response?.status || 500,

                            data:
                                error.response?.data ||
                                "Something went wrong",
                        },
                    };
                }
            },

            invalidatesTags: [
                "Category",
            ],
        }),


        // Get restaurant categories
        getCategories: builder.query<
            GetCategoriesResponse,
            {
                restaurantId: string;
                page?: number;
                limit?: number;
            }
        >({
            queryFn: async ({
                restaurantId,
                page = 1,
                limit = 10,
            }) => {

                try {

                    const data =
                        await categoryService.getRestaurantCategories(
                            restaurantId,
                            page,
                            limit
                        );

                    return { data };

                } catch (error: any) {

                    return {
                        error: {
                            status:
                                error.response?.status || 500,

                            data:
                                error.response?.data ||
                                "Something went wrong",
                        },
                    };
                }
            },

            providesTags: ["Category"],
        }),

        // Update category
        updateCategory: builder.mutation<
            UpdateCategoryResponse,
            {
                categoryId: string;
                payload: UpdateCategoryPayload;
            }
        >({
            queryFn: async ({
                categoryId,
                payload,
            }) => {

                try {

                    const data =
                        await categoryService.updateCategory(
                            categoryId,
                            payload
                        );

                    return { data };

                } catch (error: any) {

                    return {
                        error: {
                            status:
                                error.response?.status || 500,

                            data:
                                error.response?.data ||
                                "Something went wrong",
                        },
                    };
                }
            },

            invalidatesTags: ["Category"],
        }),

        // Delete category
        deleteCategory: builder.mutation<
            DeleteCategoryResponse,
            string
        >({
            queryFn: async (
                categoryId
            ) => {

                try {

                    const data =
                        await categoryService.deleteCategory(
                            categoryId
                        );

                    return { data };

                } catch (error: any) {

                    return {
                        error: {
                            status:
                                error.response?.status || 500,

                            data:
                                error.response?.data ||
                                "Something went wrong",
                        },
                    };
                }
            },

            invalidatesTags: ["Category"],
        }),





    }),
});

export const {
    useCreateCategoryMutation,
    useGetCategoriesQuery,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} = categoryApi;