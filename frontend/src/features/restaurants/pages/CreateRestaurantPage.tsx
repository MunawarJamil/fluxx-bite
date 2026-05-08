import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import RestaurantForm from "../components/RestaurantForm";

import { useCreateRestaurant } from "../hooks/useRestaurants";

import type {
    CreateRestaurantPayload,
} from "../types/restaurant.types";

const CreateRestaurantPage = () => {
    const navigate = useNavigate();

    const {
        createRestaurant,

        isLoading,
    } = useCreateRestaurant();

    const handleSubmit = async (
        values: CreateRestaurantPayload
    ) => {
        try {
            const response =
                await createRestaurant(values);

            toast.success(
                response.message ||
                "Restaurant created successfully"
            );

            navigate("/restaurants");

        } catch (error: any) {
            console.error(error);

            toast.error(
                error?.data?.message ||
                "Failed to create restaurant"
            );
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">
                    Create Restaurant
                </h1>

                <p className="text-gray-600 mt-2">
                    Add your restaurant details
                </p>
            </div>

            <div className="border rounded-2xl p-6 shadow-sm">
                <RestaurantForm
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
};

export default CreateRestaurantPage;