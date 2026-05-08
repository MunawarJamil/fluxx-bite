import { useNavigate, useParams } from "react-router-dom";

import toast from "react-hot-toast";

import RestaurantForm from "../components/RestaurantForm";

import {
    useRestaurant,
    useUpdateRestaurant,
} from "../hooks/useRestaurants";

import type {
    CreateRestaurantPayload,
} from "../types/restaurant.types";

const UpdateRestaurantPage = () => {
    const navigate = useNavigate();

    const { id } = useParams<{
        id: string;
    }>();

    const {
        restaurant,

        isLoading:
        isRestaurantLoading,

        isError,
    } = useRestaurant(id || "");

    const {
        updateRestaurant,

        isLoading:
        isUpdating,
    } = useUpdateRestaurant();

    const handleSubmit = async (
        values: CreateRestaurantPayload
    ) => {
        if (!id) return;

        try {
            const response =
                await updateRestaurant(
                    id,
                    values
                );

            toast.success(
                response.message ||
                "Restaurant updated successfully"
            );

            navigate("/restaurants");

        } catch (error: any) {
            console.error(error);

            toast.error(
                error?.data?.message ||
                "Failed to update restaurant"
            );
        }
    };

    if (isRestaurantLoading) {
        return (
            <div className="p-6">
                <p>Loading restaurant...</p>
            </div>
        );
    }

    if (isError || !restaurant) {
        return (
            <div className="p-6">
                <p>
                    Failed to load restaurant.
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">
                    Update Restaurant
                </h1>

                <p className="text-gray-600 mt-2">
                    Edit your restaurant details
                </p>
            </div>

            <div className="border rounded-2xl p-6 shadow-sm">
                <RestaurantForm
                    defaultValues={{
                        name: restaurant.name,

                        address:
                            restaurant.address,

                        latitude:
                            restaurant.latitude,

                        longitude:
                            restaurant.longitude,
                    }}
                    onSubmit={handleSubmit}
                    isLoading={isUpdating}
                />
            </div>
        </div>
    );
};

export default UpdateRestaurantPage;