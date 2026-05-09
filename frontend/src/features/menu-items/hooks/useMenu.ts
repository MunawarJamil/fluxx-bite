import {
    useDeleteMenuItemMutation,
    useGetRestaurantMenuItemsQuery,
    useToggleMenuItemAvailabilityMutation,
} from "../api/menuItem.api";

import type {
    GetRestaurantMenuItemsQuery,
} from "../schemas/menuItem.schema";

import {
    useCreateMenuItemMutation,
} from "../api/menuItem.api";

import type {
    CreateMenuItemPayload,
} from "../schemas/menuItem.schema";

import {
    useUpdateMenuItemMutation,
} from "../api/menuItem.api";

import type {
    UpdateMenuItemPayload,
} from "../schemas/menuItem.schema";


export const useRestaurantMenuItems = (
    restaurantId: string,

    query?: GetRestaurantMenuItemsQuery
) => {

    const {
        data,
        isLoading,
        isFetching,
        isError,
        error,
        refetch,
    } =
        useGetRestaurantMenuItemsQuery(
            {
                restaurantId,
                query,
            },

            {
                skip: !restaurantId,
            }
        );

    return {
        menuItems:
            data?.data ?? [],

        pagination:
            data?.pagination,

        isLoading,

        isFetching,

        isError,

        error,

        refetch,
    };
};


export const useCreateMenuItem = () => {

    const [
        createMenuItem,
        query,
    ] =
        useCreateMenuItemMutation();

    const handleCreateMenuItem =
        async (
            restaurantId: string,

            payload: CreateMenuItemPayload
        ) => {

            return await createMenuItem({
                restaurantId,
                payload,
            }).unwrap();
        };

    return {
        createMenuItem:
            handleCreateMenuItem,

        isLoading:
            query.isLoading,

        isError:
            query.isError,

        error:
            query.error,

        isSuccess:
            query.isSuccess,
    };
};


export const useUpdateMenuItem = () => {

    const [
        updateMenuItem,
        query,
    ] =
        useUpdateMenuItemMutation();

    const handleUpdateMenuItem =
        async (
            menuItemId: string,

            payload: UpdateMenuItemPayload
        ) => {

            return await updateMenuItem({
                menuItemId,
                payload,
            }).unwrap();
        };

    return {
        updateMenuItem:
            handleUpdateMenuItem,

        isLoading:
            query.isLoading,

        isError:
            query.isError,

        error:
            query.error,

        isSuccess:
            query.isSuccess,
    };
};


export const useDeleteMenuItem = () => {

    const [
        deleteMenuItem,
        query,
    ] =
        useDeleteMenuItemMutation();

    const handleDeleteMenuItem =
        async (
            menuItemId: string
        ) => {

            return await deleteMenuItem(
                menuItemId
            ).unwrap();
        };

    return {
        deleteMenuItem:
            handleDeleteMenuItem,

        isLoading:
            query.isLoading,

        isError:
            query.isError,

        error:
            query.error,

        isSuccess:
            query.isSuccess,
    };
};



export const useToggleMenuItemAvailability = () => {

    const [
        toggleAvailability,
        query,
    ] =
        useToggleMenuItemAvailabilityMutation();

    const handleToggleAvailability =
        async (
            menuItemId: string,

            isAvailable: boolean
        ) => {

            return await toggleAvailability({
                menuItemId,

                payload: {
                    isAvailable,
                },
            }).unwrap();
        };

    return {
        toggleAvailability:
            handleToggleAvailability,

        isLoading:
            query.isLoading,

        isError:
            query.isError,

        error:
            query.error,

        isSuccess:
            query.isSuccess,
    };
};