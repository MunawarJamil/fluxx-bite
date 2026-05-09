import {
    useNavigate,
    useParams,
} from "react-router-dom";
import { useGetCategories } from "../../categories/hooks/useCategories";
import { useRestaurantMenuItems, useUpdateMenuItem } from "../hooks/useMenu";
import toast from "react-hot-toast";
import MenuItemForm from "../components/MenuItemForm";
import { useOwnerRestaurant } from "../../restaurants/hooks/useRestaurants";
const UpdateMenuItemPage =
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
            isLoadingCategories,
        } =
            useGetCategories(
                restaurantId!
            );

        const {
            menuItems,
            isLoading:
            isLoadingMenuItems,
        } =
            useRestaurantMenuItems(
                restaurantId!
            );

        const {
            updateMenuItem,
            isLoading,
        } =
            useUpdateMenuItem();

        const menuItem =
            menuItems.find(
                (item) =>
                    item.id === id
            );

        const handleUpdate =
            async (
                data: any
            ) => {

                if (!id) return;

                try {

                    await updateMenuItem(
                        id,
                        data
                    );

                    toast.success(
                        "Menu item updated successfully"
                    );

                    navigate(
                        "/owner/restaurant"
                    );

                } catch (error: any) {

                    toast.error(
                        error?.data?.message ||
                        "Failed to update menu item"
                    );
                }
            };

        if (
            isLoadingCategories ||
            isLoadingMenuItems
        ) {
            return (
                <div>
                    Loading...
                </div>
            );
        }

        if (!menuItem) {
            return (
                <div>
                    Menu item not found
                </div>
            );
        }

        return (
            <div className="max-w-2xl mx-auto py-10 px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">
                        Update Menu Item
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Edit menu item details.
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
                            handleUpdate
                        }

                        isLoading={
                            isLoading
                        }

                        isEdit
                        submitLabel="Update Menu Item"
                        defaultValues={{
                            name: menuItem.name,
                            description: menuItem.description ?? undefined,  // 👈 null → undefined
                            price: Number(menuItem.price),                   // 👈 in case API returns string
                            categoryId: menuItem.category.id,
                            imageUrl: menuItem.imageUrl ?? undefined,        // 👈 null → undefined
                            isAvailable: menuItem.isAvailable,
                        }}
                    />
                </div>
            </div>
        );
    };

export default UpdateMenuItemPage;