import {
    useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";

import MenuItemForm from "../components/MenuItemForm";
import { useGetCategories } from "../../categories/hooks/useCategories";
import { useCreateMenuItem } from "../hooks/useMenu";
import { useOwnerRestaurant } from "../../restaurants/hooks/useRestaurants";



const CreateMenuItemPage =
    () => {

        const navigate =
            useNavigate();

        const {
            restaurant,

        } = useOwnerRestaurant();

        const restaurantId =
            restaurant?.id;


        const {
            categories,
            isLoading:
            isLoadingCategories,
        } =
            useGetCategories(
                restaurantId!
            );

        const {
            createMenuItem,
            isLoading,
        } =
            useCreateMenuItem();

        const handleCreate =
            async (
                data: any
            ) => {

                try {

                    await createMenuItem(
                        restaurantId!,
                        data
                    );

                    toast.success(
                        "Menu item created successfully"
                    );

                    navigate(
                        "/owner/restaurant"
                    );

                } catch (error: any) {

                    toast.error(
                        error?.data?.message ||
                        "Failed to create menu item"
                    );
                }
            };

        if (
            isLoadingCategories
        ) {
            return (
                <div>
                    Loading categories...
                </div>
            );
        }

        return (
            <div className="max-w-2xl mx-auto py-10 px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">
                        Create Menu Item
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Add a new item to your menu.
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
                    <MenuItemForm
                        categories={
                            categories
                        }

                        onSubmit={
                            handleCreate
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
    CreateMenuItemPage;