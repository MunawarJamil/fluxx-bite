import { useNearbyRestaurants } from "../hooks/useRestaurants";
import RestaurantCard from "./RestaurantCard";

const NearbyRestaurantsPage = () => {
    const {
        pagination,
        restaurants,
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
                <div className="grid gap-4 md:grid-cols-2">
                    {restaurants.map((restaurant) => (
                        <RestaurantCard
                            key={restaurant.id}
                            restaurant={restaurant}
                        />
                    ))}
                </div>
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

export default NearbyRestaurantsPage;