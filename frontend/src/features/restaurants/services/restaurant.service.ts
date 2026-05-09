import api from "../../../api/axios";
import type { CreateRestaurantPayload, CreateRestaurantResponse, DeleteRestaurantResponse, GetAllRestaurantsParams, GetNearbyRestaurantsParams, NearbyRestaurantsResponse, RestaurantResponse, UpdateRestaurantPayload } from "../types/restaurant.types";

const BASE_URL = "http://localhost:5001/api/v1/restaurant";

export const restaurantService = {

    /**
     * Create a new restaurant (for registered users)
     */
    createRestaurant: async (
        payload: CreateRestaurantPayload
    ): Promise<CreateRestaurantResponse> => {
        const response =
            await api.post<CreateRestaurantResponse>(
                BASE_URL,
                payload
            );

        return response.data;
    },


    /**
     * Get nearby restaurants
     */
    getNearbyRestaurants: async ({
        lat,
        lng,
        radius = 6,
        page = 1,
        limit = 10,
    }: GetNearbyRestaurantsParams): Promise<NearbyRestaurantsResponse> => {
        const response =
            await api.get<NearbyRestaurantsResponse>(
                `${BASE_URL}/nearby`,
                {
                    params: {
                        lat,
                        lng,
                        radius,
                        page,
                        limit,
                    },
                }
            );

        return response.data;
    },

    // For get  restaurant of seller
    getMyRestaurant:
        async (): Promise<RestaurantResponse> => {
            const response =
                await api.get<RestaurantResponse>(
                    `${BASE_URL}/owner`
                );

            return response.data;
        },




    getRestaurantById: async (
        id: string
    ): Promise<RestaurantResponse> => {
        const response =
            await api.get<RestaurantResponse>(
                `${BASE_URL}/${id}`
            );

        return response.data;
    },


    updateRestaurant: async (
        id: string,
        payload: UpdateRestaurantPayload
    ): Promise<RestaurantResponse> => {
        const response =
            await api.patch<RestaurantResponse>(
                `${BASE_URL}/${id}`,
                payload
            );

        return response.data;
    },

    /**
     * Delete restaurant
     */
    deleteRestaurant: async (
        id: string
    ): Promise<DeleteRestaurantResponse> => {
        const response =
            await api.delete<DeleteRestaurantResponse>(
                `${BASE_URL}/${id}`
            );

        return response.data;
    },

    getAllRestaurants: async ({
        page = 1,
        limit = 10,
    }: GetAllRestaurantsParams): Promise<NearbyRestaurantsResponse> => {
        const response =
            await api.get<NearbyRestaurantsResponse>(
                BASE_URL,
                {
                    params: {
                        page,
                        limit,
                    },
                }
            );

        return response.data;
    },

};



