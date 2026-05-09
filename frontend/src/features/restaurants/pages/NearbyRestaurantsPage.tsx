import { useNearbyRestaurants } from "../hooks/useRestaurants";
import { Navigation, UtensilsCrossed, ChevronLeft, ChevronRight } from "lucide-react";
import RestaurantCard from "./RestaurantCard";

const NearbyRestaurantsPage = () => {
    const { pagination, restaurants, isLoading, isError, error } = useNearbyRestaurants({
        lat: 31.5204,
        lng: 74.3587,
        page: 1,
        limit: 10,
    });

    if (isLoading) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <div className="h-7 w-52 bg-slate-200 rounded-xl animate-pulse mb-2" />
                    <div className="h-4 w-40 bg-slate-100 rounded-xl animate-pulse" />
                </div>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse">
                            <div className="h-36 bg-slate-100" />
                            <div className="p-5 space-y-3">
                                <div className="h-4 bg-slate-200 rounded w-3/4" />
                                <div className="h-3 bg-slate-100 rounded w-full" />
                                <div className="h-8 bg-slate-100 rounded-xl mt-4" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (isError) {
        console.error(error);
        return (
            <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                    <p className="text-red-600 font-medium">Failed to load nearby restaurants.</p>
                    <p className="text-red-400 text-sm mt-1">Please try again later.</p>
                </div>
            </div>
        );
    }

    if (!restaurants.length) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-16 text-center">
                    <UtensilsCrossed className="w-10 h-10 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-slate-700 font-semibold">No restaurants nearby</h3>
                    <p className="text-slate-400 text-sm mt-1">No restaurants found near your location.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-1">
                    <Navigation className="w-5 h-5 text-indigo-600" />
                    <h1 className="text-2xl font-bold text-slate-900">Nearby Restaurants</h1>
                </div>
                <p className="text-slate-500 text-sm">
                    {pagination?.total ?? restaurants.length} restaurants near your location
                </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {restaurants.map((restaurant) => (
                    <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                ))}
            </div>

            {pagination && pagination.totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-3">
                    <button
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-40"
                        disabled
                    >
                        <ChevronLeft className="w-4 h-4" /> Prev
                    </button>
                    <span className="text-sm text-slate-500">
                        Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors">
                        Next <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default NearbyRestaurantsPage;