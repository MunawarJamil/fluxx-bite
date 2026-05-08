import { Link, useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import {
    useDeleteRestaurant,
    useMyRestaurant,
} from "../hooks/useRestaurants";

const SellerRestaurantPage = () => {
    const navigate = useNavigate();

    const {
        restaurant,

        isLoading,

        isError,
    } = useMyRestaurant();

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

            navigate("/restaurants");

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
            <div className="p-6">
                <p>Loading restaurant...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-6">
                <p>
                    Failed to load seller
                    restaurant.
                </p>
            </div>
        );
    }

    /**
     * Empty state
     */
    if (!restaurant) {
        return (
            <div className="max-w-2xl mx-auto p-6">
                <div className="border rounded-2xl p-8 text-center">
                    <h1 className="text-3xl font-bold mb-4">
                        No Restaurant Found
                    </h1>

                    <p className="text-gray-600 mb-6">
                        Create your restaurant to
                        start selling on Fluxx-Bite.
                    </p>

                    <Link
                        to="/restaurants/create"
                        className="inline-block px-6 py-3 rounded-xl bg-black text-white"
                    >
                        Create Restaurant
                    </Link>
                </div>
            </div>
        );
    }

    /**
     * Seller dashboard
     */
    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">
                        Seller Dashboard
                    </h1>

                    <p className="text-gray-600 mt-2">
                        Manage your restaurant
                    </p>
                </div>
            </div>

            {/* Restaurant Card */}
            <div className="border rounded-2xl p-6 shadow-sm">
                <h2 className="text-2xl font-semibold">
                    {restaurant.name}
                </h2>

                <p className="text-gray-600 mt-2">
                    {restaurant.address}
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                        to={`/restaurants/${restaurant.id}`}
                        className="px-5 py-3 rounded-xl border"
                    >
                        View Details
                    </Link>

                    <Link
                        to={`/restaurants/${restaurant.id}/edit`}
                        className="px-5 py-3 rounded-xl bg-black text-white"
                    >
                        Edit Restaurant
                    </Link>

                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="px-5 py-3 rounded-xl border border-red-500 text-red-500 disabled:opacity-50"
                    >
                        {isDeleting
                            ? "Deleting..."
                            : "Delete Restaurant"}
                    </button>

                    {/* Future */}
                    <button
                        disabled
                        className="px-5 py-3 rounded-xl border opacity-50 cursor-not-allowed"
                    >
                        Manage Menu (Coming Soon)
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SellerRestaurantPage;