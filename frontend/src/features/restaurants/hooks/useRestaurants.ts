import { useMemo } from "react";

import { useCreateRestaurantMutation, useDeleteRestaurantMutation, useGetAllRestaurantsQuery, useGetMyRestaurantQuery, useGetNearbyRestaurantsQuery, useGetRestaurantByIdQuery, useUpdateRestaurantMutation, } from "../api/restaurant.api";
import type { CreateRestaurantPayload, GetAllRestaurantsParams, UpdateRestaurantPayload } from "../types/restaurant.types";

interface UseNearbyRestaurantsParams {
    lat: number;
    lng: number;

    radius?: number;

    page?: number;
    limit?: number;
}

export const useNearbyRestaurants = ({
    lat,
    lng,
    radius = 6,
    page = 1,
    limit = 10,
}: UseNearbyRestaurantsParams) => {
    const query =
        useGetNearbyRestaurantsQuery({
            lat,
            lng,
            radius,
            page,
            limit,
        });

    const restaurants = useMemo(
        () => query.data?.data || [],
        [query.data]
    );

    const pagination = useMemo(
        () => query.data?.pagination,
        [query.data]
    );

    return {
        restaurants,
        pagination,

        isLoading: query.isLoading,

        isFetching: query.isFetching,

        isError: query.isError,

        error: query.error,

        refetch: query.refetch,
    };
};



export const useCreateRestaurant = () => {
    const [
        createRestaurant,
        query,
    ] = useCreateRestaurantMutation();

    const handleCreateRestaurant =
        async (
            payload: CreateRestaurantPayload
        ) => {
            return await createRestaurant(
                payload
            ).unwrap();
        };

    return {
        createRestaurant:
            handleCreateRestaurant,

        isLoading: query.isLoading,

        isError: query.isError,

        error: query.error,

        isSuccess: query.isSuccess,
    };
};


export const useMyRestaurant = () => {
    const query = useGetMyRestaurantQuery();

    return {
        restaurant:
            query.data?.data || null,

        isLoading: query.isLoading,

        isFetching: query.isFetching,

        isError: query.isError,

        error: query.error,

        refetch: query.refetch,
    };
};

export const useRestaurant = (
    id: string
) => {
    const query =
        useGetRestaurantByIdQuery(id, {
            skip: !id,
        });

    return {
        restaurant:
            query.data?.data || null,

        isLoading: query.isLoading,

        isFetching: query.isFetching,

        isError: query.isError,

        error: query.error,

        refetch: query.refetch,
    };
};


export const useUpdateRestaurant = () => {
    const [
        updateRestaurant,
        query,
    ] = useUpdateRestaurantMutation();

    const handleUpdateRestaurant =
        async (
            id: string,
            payload: UpdateRestaurantPayload
        ) => {
            return await updateRestaurant({
                id,
                payload,
            }).unwrap();
        };

    return {
        updateRestaurant:
            handleUpdateRestaurant,

        isLoading: query.isLoading,

        isError: query.isError,

        error: query.error,

        isSuccess: query.isSuccess,
    };
};

export const useDeleteRestaurant = () => {
    const [
        deleteRestaurant,
        query,
    ] = useDeleteRestaurantMutation();

    const handleDeleteRestaurant =
        async (id: string) => {
            return await deleteRestaurant(
                id
            ).unwrap();
        };

    return {
        deleteRestaurant:
            handleDeleteRestaurant,

        isLoading: query.isLoading,

        isError: query.isError,

        error: query.error,

        isSuccess: query.isSuccess,
    };
};


export const useRestaurants = ({
    page = 1,
    limit = 10,
}: GetAllRestaurantsParams = {}) => {
    const query =
        useGetAllRestaurantsQuery({
            page,
            limit,
        });

    return {
        restaurants:
            query.data?.data || [],

        pagination:
            query.data?.pagination,

        isLoading: query.isLoading,

        isFetching: query.isFetching,

        isError: query.isError,

        error: query.error,

        refetch: query.refetch,
    };
};