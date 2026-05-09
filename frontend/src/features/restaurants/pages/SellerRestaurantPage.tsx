import { Link, useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import { useGetCategories } from "../../categories/hooks/useCategories";
import CategoryList from "../../categories/components/CategoryList";
import CategorySkeleton from "../../categories/components/CategorySkeleton";
import {
    useDeleteRestaurant,
    useOwnerRestaurant,
} from "../hooks/useRestaurants";
import { useRestaurantMenuItems } from "../../menu-items/hooks/useMenu";



import MenuItemList from "../../menu-items/components/MenuItemList";
import MenuItemSkeleton from "../../menu-items/components/MenuItemSkeleton";



const SellerRestaurantPage = () => {
    const navigate = useNavigate();

    const {
        restaurant,

        isLoading,

        isError,
    } = useOwnerRestaurant();

    const restaurantId =
        restaurant?.id;


    const {
        menuItems,
        isLoading:
        isLoadingMenuItems,
    } =
        useRestaurantMenuItems(
            restaurantId!
        );

    const {
        categories,
    } =
        useGetCategories(
            restaurantId!,
            1,
            20
        );


    const {
        deleteRestaurant,

        isLoading: isDeleting,
    } = useDeleteRestaurant();

    const handleDelete = async () => {
        if (!restaurant) return;

        const confirmed = window.confirm(
            "Are you sure you want to delete this restaurant?"
        );

        if (!confirmed) return;

        try {
            const response =
                await deleteRestaurant(
                    restaurant.id
                );

            toast.success(
                response.message ||
                "Restaurant deleted successfully"
            );

            navigate("/owner/restaurant");

        } catch (error: any) {
            console.error(error);

            toast.error(
                error?.data?.message ||
                "Failed to delete restaurant"
            );
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 w-48 bg-slate-200 rounded-xl" />
                    <div className="h-40 bg-white rounded-2xl border border-slate-200" />
                    <div className="h-32 bg-white rounded-2xl border border-slate-200" />
                    <div className="h-48 bg-white rounded-2xl border border-slate-200" />
                </div>
            </div>
        );
    }

    if (!restaurant) {
        return (
            <div className="max-w-lg mx-auto px-4 py-16 sm:px-6 text-center">
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">🍽️</span>
                </div>
                <h1 className="text-2xl font-bold text-slate-900 mb-3">No Restaurant Yet</h1>
                <p className="text-slate-500 text-sm mb-8">
                    Create your restaurant to start selling on Fluxx-Bite.
                </p>
                <Link
                    to="/restaurants/create"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-colors"
                >
                    Create Restaurant
                </Link>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                    <p className="text-red-600 font-medium">Failed to load your restaurant.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Seller Dashboard</h1>
                <p className="text-slate-500 text-sm mt-1">Manage your restaurant, categories, and menu.</p>
            </div>

            {/* Restaurant info card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="h-24 bg-linear-to-br from-indigo-50 to-slate-100 flex items-center px-6">
                    <span className="text-5xl font-black text-indigo-200 select-none">
                        {restaurant.name.charAt(0).toUpperCase()}
                    </span>
                </div>
                <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-semibold text-slate-900">{restaurant.name}</h2>
                            <p className="text-slate-500 text-sm mt-1">{restaurant.address}</p>
                        </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2.5">
                        <Link
                            to={`/restaurants/${restaurant.id}`}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
                        >
                            View Page
                        </Link>
                        <Link
                            to={`/restaurants/${restaurant.id}/edit`}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
                        >
                            Edit Restaurant
                        </Link>
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Categories section */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">Categories</h2>
                        <p className="text-slate-500 text-sm">Organize your menu into sections.</p>
                    </div>
                    <Link
                        to="/categories/create"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
                    >
                        Add Category
                    </Link>
                </div>

                {isLoading ? (
                    <CategorySkeleton />
                ) : categories && categories.length > 0 ? (
                    <CategoryList categories={categories} />
                ) : (
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center">
                        <p className="text-slate-500 text-sm font-medium">No categories yet.</p>
                        <p className="text-slate-400 text-xs mt-1">Create one to organize your menu items.</p>
                    </div>
                )}
            </div>

            {/* Menu Items section */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">Menu Items</h2>
                        <p className="text-slate-500 text-sm">Add and manage your menu offerings.</p>
                    </div>
                    <Link
                        to="/menu-items/create"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
                    >
                        Add Item
                    </Link>
                </div>

                {isLoadingMenuItems ? (
                    <div className="space-y-3">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <MenuItemSkeleton key={index} />
                        ))}
                    </div>
                ) : (
                    <MenuItemList menuItems={menuItems} />
                )}
            </div>
        </div>
    );
};

export default SellerRestaurantPage;