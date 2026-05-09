import {
    createApi,
    fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";


import {
    menuItemService,
} from "../services/menuItem.service";

import type {
    MenuItem,
    GetRestaurantMenuItemsResponse,
    CreateMenuItemResponse,
    UpdateMenuItemResponse,
    ToggleAvailabilityResponse,
    DeleteMenuItemResponse,
} from "../types/menuItem.types";

import type {
    CreateMenuItemPayload,
    GetRestaurantMenuItemsQuery,
    ToggleAvailabilityPayload,
    UpdateMenuItemPayload,
} from "../schemas/menuItem.schema";
import { baseApi } from "../../../store/services/baseApi";

export const menuItemApi =
    baseApi.injectEndpoints({




        endpoints: (builder) => ({

            /**
             * Get restaurant menu items
             */
            getRestaurantMenuItems:
                builder.query<
                    GetRestaurantMenuItemsResponse,

                    {
                        restaurantId: string;

                        query?: GetRestaurantMenuItemsQuery;
                    }
                >({
                    queryFn: async ({
                        restaurantId,
                        query,
                    }) => {

                        try {

                            const data =
                                await menuItemService.getRestaurantMenuItems(
                                    restaurantId,
                                    query
                                );

                            return { data };

                        } catch (error: any) {

                            return {
                                error: {
                                    status:
                                        error.response?.status ||
                                        500,

                                    data:
                                        error.response?.data ||
                                        "Something went wrong",
                                },
                            };
                        }
                    },

                    providesTags: (
                        result
                    ) =>

                        result?.data
                            ? [
                                ...result.data.map(
                                    (
                                        item: MenuItem
                                    ) => ({
                                        type: "MenuItem" as const,
                                        id: item.id,
                                    })
                                ),

                                {
                                    type: "MenuItem",
                                    id: "LIST",
                                },
                            ]
                            : [
                                {
                                    type: "MenuItem",
                                    id: "LIST",
                                },
                            ],
                }),

            /**
             * Create menu item
             */
            createMenuItem:
                builder.mutation<
                    CreateMenuItemResponse,

                    {
                        restaurantId: string;

                        payload: CreateMenuItemPayload;
                    }
                >({
                    queryFn: async ({
                        restaurantId,
                        payload,
                    }) => {

                        try {

                            const data =
                                await menuItemService.createMenuItem(
                                    restaurantId,
                                    payload
                                );

                            return { data };

                        } catch (error: any) {

                            return {
                                error: {
                                    status:
                                        error.response?.status ||
                                        500,

                                    data:
                                        error.response?.data ||
                                        "Something went wrong",
                                },
                            };
                        }
                    },

                    invalidatesTags: [
                        {
                            type: "MenuItem",
                            id: "LIST",
                        },
                    ],
                }),


            /**
             * Update menu item
             */
            updateMenuItem:
                builder.mutation<
                    UpdateMenuItemResponse,

                    {
                        menuItemId: string;

                        payload: UpdateMenuItemPayload;
                    }
                >({
                    queryFn: async ({
                        menuItemId,
                        payload,
                    }) => {

                        try {

                            const data =
                                await menuItemService.updateMenuItem(
                                    menuItemId,
                                    payload
                                );

                            return { data };

                        } catch (error: any) {

                            return {
                                error: {
                                    status:
                                        error.response?.status ||
                                        500,

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
                        arg
                    ) => [
                            {
                                type: "MenuItem",
                                id: arg.menuItemId,
                            },

                            {
                                type: "MenuItem",
                                id: "LIST",
                            },
                        ],
                }),




            /**
             * Delete menu item
             */
            deleteMenuItem:
                builder.mutation<
                    DeleteMenuItemResponse,

                    string
                >({
                    queryFn: async (
                        menuItemId
                    ) => {

                        try {

                            const data =
                                await menuItemService.deleteMenuItem(
                                    menuItemId
                                );

                            return { data };

                        } catch (error: any) {

                            return {
                                error: {
                                    status:
                                        error.response?.status ||
                                        500,

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
                        menuItemId
                    ) => [
                            {
                                type: "MenuItem",
                                id: menuItemId,
                            },

                            {
                                type: "MenuItem",
                                id: "LIST",
                            },
                        ],
                }),



            /**
     * Toggle menu item availability
     */
            toggleMenuItemAvailability:
                builder.mutation<
                    ToggleAvailabilityResponse,

                    {
                        menuItemId: string;

                        payload: ToggleAvailabilityPayload;
                    }
                >({
                    queryFn: async ({
                        menuItemId,
                        payload,
                    }) => {

                        try {

                            const data =
                                await menuItemService.toggleMenuItemAvailability(
                                    menuItemId,
                                    payload
                                );

                            return { data };

                        } catch (error: any) {

                            return {
                                error: {
                                    status:
                                        error.response?.status ||
                                        500,

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
                        arg
                    ) => [
                            {
                                type: "MenuItem",
                                id: arg.menuItemId,
                            },

                            {
                                type: "MenuItem",
                                id: "LIST",
                            },
                        ],
                }),


        }),
    });

export const {
    useGetRestaurantMenuItemsQuery,
    useCreateMenuItemMutation,
    useUpdateMenuItemMutation,
    useDeleteMenuItemMutation,
    useToggleMenuItemAvailabilityMutation,
} = menuItemApi;