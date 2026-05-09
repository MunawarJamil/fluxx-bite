import {
    useNavigate,
    useParams,
} from "react-router-dom";

import toast from "react-hot-toast";

import CategoryForm from "../components/CategoryForm";

import {
    useGetCategories,
    useUpdateCategory,
} from "../hooks/useCategories";
import { useOwnerRestaurant } from "../../restaurants/hooks/useRestaurants";


const UpdateCategoryPage =
    () => {

        const navigate =
            useNavigate();

        const { id } =
            useParams();

        const { restaurant } = useOwnerRestaurant();

        const restaurantId = restaurant?.id;



        const {
            categories,
            isLoading:
            isFetchingCategory,
        } =
            useGetCategories(
                restaurantId!
            );

        const {
            updateCategory,
            isLoading,
        } =
            useUpdateCategory();

        const category =
            categories.find(
                (cat) =>
                    cat.id === id
            );

        const handleUpdate =
            async (
                data: any
            ) => {

                if (!id) return;

                try {

                    await updateCategory(
                        id,
                        data
                    );

                    toast.success(
                        "Category updated successfully"
                    );

                    navigate(
                        "/owner/restaurant"
                    );

                } catch (error: any) {

                    toast.error(
                        error?.data?.message ||
                        "Failed to update category"
                    );
                }
            };

        if (
            isFetchingCategory
        ) {
            return (
                <div>
                    Loading...
                </div>
            );
        }

        if (!category) {
            return (
                <div>
                    Category not found
                </div>
            );
        }

        return (
            <div className="max-w-xl mx-auto py-10 px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">
                        Update Category
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Edit category details.
                    </p>
                </div>

                {/* Form */}
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
                            handleUpdate
                        }

                        isLoading={
                            isLoading
                        }

                        defaultValues={{
                            name:
                                category.name,
                        }}
                    />
                </div>
            </div>
        );
    };

export default
    UpdateCategoryPage;