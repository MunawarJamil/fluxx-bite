import { baseApi } from "../../../store/services/baseApi";

import { restaurantService } from "../services/restaurant.service";
import type { CreateRestaurantPayload, CreateRestaurantResponse, DeleteRestaurantResponse, GetAllRestaurantsParams, GetNearbyRestaurantsParams, NearbyRestaurantsResponse, RestaurantResponse, RestaurantsListResponse, UpdateRestaurantPayload } from "../types/restaurant.types";


export const restaurantApi =
    baseApi.injectEndpoints({
        endpoints: (builder) => ({

            // For nearby restaurants
            getNearbyRestaurants: builder.query<
                NearbyRestaurantsResponse,
                GetNearbyRestaurantsParams>
                ({
                    queryFn: async (params) => {
                        try {
                            const data =
                                await restaurantService.getNearbyRestaurants(
                                    params
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

                    providesTags: ["Restaurant"],
                }),

            // For create restaurant (registered user)
            createRestaurant: builder.mutation<
                CreateRestaurantResponse,
                CreateRestaurantPayload
            >({
                queryFn: async (payload) => {
                    try {
                        const data =
                            await restaurantService.createRestaurant(
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

                invalidatesTags: ["Restaurant"],
            }),

            // get restaurant by owner id
            getMyRestaurant: builder.query<
                RestaurantResponse,
                void
            >({
                queryFn: async () => {
                    try {
                        const data =
                            await restaurantService.getMyRestaurant();

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

                providesTags: ["Restaurant"],
            }),



            // get all restaurants 
            getAllRestaurants: builder.query<
                RestaurantsListResponse,
                GetAllRestaurantsParams
            >({
                queryFn: async (params = {}) => {
                    try {
                        const data =
                            await restaurantService.getAllRestaurants(
                                params
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

                providesTags: ["Restaurant"],
            }),

            // get restaurant by id
            getRestaurantById: builder.query<
                RestaurantResponse,
                string
            >({
                queryFn: async (id) => {
                    try {
                        const data =
                            await restaurantService.getRestaurantById(
                                id
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

                providesTags: (
                    result,
                    error,
                    id
                ) => [
                        {
                            type: "Restaurant",
                            id,
                        },
                    ],
            }),

            // Update restaurant
            updateRestaurant: builder.mutation<
                RestaurantResponse,
                {
                    id: string;
                    payload: UpdateRestaurantPayload;
                }
            >({
                queryFn: async ({
                    id,
                    payload,
                }) => {
                    try {
                        const data =
                            await restaurantService.updateRestaurant(
                                id,
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

                invalidatesTags: (
                    result,
                    error,
                    { id }
                ) => [
                        {
                            type: "Restaurant",
                            id,
                        },

                        "Restaurant",
                    ],
            }),


            // Delete restaurant
            deleteRestaurant: builder.mutation<
                DeleteRestaurantResponse,
                string
            >({
                queryFn: async (id) => {
                    try {
                        const data =
                            await restaurantService.deleteRestaurant(
                                id
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

                invalidatesTags: (
                    result,
                    error,
                    id
                ) => [
                        {
                            type: "Restaurant",
                            id,
                        },

                        "Restaurant",
                    ],
            }),



        }),
    });

export const {
    useGetNearbyRestaurantsQuery,
    useCreateRestaurantMutation,
    useGetMyRestaurantQuery,
    useGetRestaurantByIdQuery,
    useUpdateRestaurantMutation,
    useDeleteRestaurantMutation,
    useGetAllRestaurantsQuery,

} = restaurantApi;