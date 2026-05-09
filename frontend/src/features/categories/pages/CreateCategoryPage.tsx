import { useNavigate } from "react-router-dom";

import { toast } from "react-hot-toast";

import CategoryForm from "../components/CategoryForm";

import {
    useCreateCategory,
} from "../hooks/useCategories";

import {
    useOwnerRestaurant,
} from "../../restaurants/hooks/useRestaurants";

const CreateCategoryPage = () => {

    const navigate =
        useNavigate();

    const {
        createCategory,
        isLoading,
    } = useCreateCategory();

    const {
        restaurant,
        isLoading: restaurantLoading,
    } = useOwnerRestaurant();

    const restaurantId =
        restaurant?.id;

    const handleCreateCategory =
        async (data: any) => {

            if (!restaurantId) {
                toast.error(
                    "Restaurant not found"
                );

                return;
            }

            try {

                await createCategory(
                    restaurantId,
                    data
                );

                toast.success(
                    "Category created successfully"
                );

                navigate(
                    "/owner/restaurant"
                );

            } catch (error: any) {

                toast.error(
                    error?.data?.message ||
                    "Failed to create category"
                );
            }
        };

    if (restaurantLoading) {
        return (
            <div className="p-10">
                Loading...
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto py-10 px-4">

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold">
                    Create Category
                </h1>

                <p className="text-gray-500 mt-2">
                    Organize your menu
                    items with categories.
                </p>
            </div>

            {/* Form Card */}
            <div
                className="
          rounded-2xl
          border
          border-gray-200
          bg-white
          p-6
          shadow-sm
        "
            >
                <CategoryForm
                    onSubmit={
                        handleCreateCategory
                    }

                    isLoading={
                        isLoading
                    }
                />
            </div>
        </div>
    );
};

export default
    CreateCategoryPage;