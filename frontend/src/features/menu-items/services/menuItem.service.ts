import { restaurantApi as api } from "../../../api/restaurantApi/restaurant-api";

import type {
    CreateMenuItemResponse,
    DeleteMenuItemResponse,
    GetRestaurantMenuItemsResponse,
    ToggleAvailabilityResponse,
    UpdateMenuItemResponse,
} from "../types/menuItem.types";

import type {
    CreateMenuItemPayload,
    GetRestaurantMenuItemsQuery,
    ToggleAvailabilityPayload,
    UpdateMenuItemPayload,
} from "../schemas/menuItem.schema";

const BASE_URL = "/restaurants";

export const menuItemService = {
    /**
     * Get restaurant menu items
     */
    getRestaurantMenuItems: async (
        restaurantId: string,

        query?: GetRestaurantMenuItemsQuery
    ): Promise<GetRestaurantMenuItemsResponse> => {

        const response =
            await api.get<
                GetRestaurantMenuItemsResponse
            >(
                `${BASE_URL}/${restaurantId}/menu-items`,
                {
                    params: query,
                }
            );

        return response.data;
    },


    /**
 * Create menu item
 */
    createMenuItem: async (
        restaurantId: string,

        payload: CreateMenuItemPayload
    ): Promise<CreateMenuItemResponse> => {

        const response =
            await api.post<
                CreateMenuItemResponse
            >(
                `/restaurants/${restaurantId}/menu-items`,
                payload
            );

        return response.data;
    },

    /**
     * Update menu item
     */
    updateMenuItem: async (
        menuItemId: string,

        payload: UpdateMenuItemPayload
    ): Promise<UpdateMenuItemResponse> => {

        const response =
            await api.patch<
                UpdateMenuItemResponse
            >(
                `/menu-items/${menuItemId}`,
                payload
            );

        return response.data;
    },

    /**
     * Delete menu item
     */
    deleteMenuItem: async (
        menuItemId: string
    ): Promise<DeleteMenuItemResponse> => {

        const response =
            await api.delete<
                DeleteMenuItemResponse
            >(
                `/menu-items/${menuItemId}`
            );

        return response.data;
    },

    /**
     * Toggle menu item availability
     */
    toggleMenuItemAvailability:
        async (
            menuItemId: string,

            payload: ToggleAvailabilityPayload
        ): Promise<ToggleAvailabilityResponse> => {

            const response =
                await api.patch<
                    ToggleAvailabilityResponse
                >(
                    `/menu-items/${menuItemId}/toggle-availability`,
                    payload
                );

            return response.data;
        },

};



