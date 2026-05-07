import { useNearbyRestaurants } from "../hooks/useRestaurants";

const RestaurantsPage = () => {
    const {
        restaurants,
        pagination,

        isLoading,
        isError,
        error,
    } = useNearbyRestaurants({
        lat: 31.5204,
        lng: 74.3587,

        page: 1,
        limit: 10,
    });

    if (isLoading) {
        return (
            <div className="p-6">
                <p>Loading restaurants...</p>
            </div>
        );
    }

    if (isError) {
        console.error(error);

        return (
            <div className="p-6">
                <p>
                    Failed to load nearby restaurants.
                </p>
            </div>
        );
    }

    if (!restaurants.length) {
        return (
            <div className="p-6">
                <p>
                    No restaurants found near your
                    location.
                </p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">
                Nearby Restaurants
            </h1>

            <div className="space-y-4">
                {restaurants.map((restaurant) => (
                    <div
                        key={restaurant.id}
                        className="border rounded-lg p-4"
                    >
                        <h2 className="text-lg font-semibold">
                            {restaurant.name}
                        </h2>

                        <p className="text-sm text-gray-600">
                            {restaurant.address}
                        </p>

                        <p className="text-sm mt-2">
                            Distance:{" "}
                            {restaurant.distance} km
                        </p>
                    </div>
                ))}
            </div>

            {pagination && (
                <div className="mt-6">
                    <p>
                        Page {pagination.page} of{" "}
                        {pagination.totalPages}
                    </p>
                </div>
            )}
        </div>
    );
};

export default RestaurantsPage;