import { Link, useParams } from "react-router-dom";

import { useRestaurant } from "../hooks/useRestaurants";

const RestaurantDetailsPage = () => {
    const { id } = useParams<{
        id: string;
    }>();

    const {
        restaurant,

        isLoading,

        isError,
    } = useRestaurant(id || "");

    if (isLoading) {
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
                    Failed to load restaurant details.
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold">
                    {restaurant.name}
                </h1>

                <p className="text-gray-600 mt-3">
                    {restaurant.address}
                </p>
            </div>

            {/* Coordinates */}
            <div className="border rounded-2xl p-5 mb-6">
                <h2 className="text-xl font-semibold mb-3">
                    Location
                </h2>

                <div className="space-y-2 text-sm">
                    <p>
                        <span className="font-medium">
                            Latitude:
                        </span>{" "}
                        {restaurant.latitude}
                    </p>

                    <p>
                        <span className="font-medium">
                            Longitude:
                        </span>{" "}
                        {restaurant.longitude}
                    </p>
                </div>
            </div>

            {/* Distance */}
            {restaurant.distance !==
                undefined && (
                    <div className="border rounded-2xl p-5 mb-6">
                        <h2 className="text-xl font-semibold mb-2">
                            Distance
                        </h2>

                        <p>
                            {restaurant.distance} km away
                        </p>
                    </div>
                )}

            {/* Actions */}
            <div className="flex gap-3">
                <Link
                    to={`/restaurants/${restaurant.id}/edit`}
                    className="px-5 py-3 rounded-xl bg-black text-white"
                >
                    Edit Restaurant
                </Link>

                <Link
                    to="/restaurants"
                    className="px-5 py-3 rounded-xl border"
                >
                    Back to Restaurants
                </Link>
            </div>
        </div>
    );
};

export default RestaurantDetailsPage;