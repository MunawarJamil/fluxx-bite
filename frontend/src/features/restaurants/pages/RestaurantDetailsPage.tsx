import { Link, useParams } from "react-router-dom";
import { MapPin, Navigation, Calendar, Edit, ArrowLeft } from "lucide-react";
import { useRestaurant } from "../hooks/useRestaurants";

const RestaurantDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const { restaurant, isLoading, isError } = useRestaurant(id || "");

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="animate-pulse space-y-6">
                    <div className="h-4 w-32 bg-slate-200 rounded-xl" />
                    <div className="h-52 bg-slate-200 rounded-2xl" />
                    <div className="h-8 w-64 bg-slate-200 rounded-xl" />
                    <div className="h-4 w-48 bg-slate-100 rounded-xl" />
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="h-28 bg-slate-100 rounded-2xl" />
                        <div className="h-28 bg-slate-100 rounded-2xl" />
                    </div>
                </div>
            </div>
        );
    }

    if (isError || !restaurant) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                    <p className="text-red-600 font-medium">Failed to load restaurant details.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            {/* Back */}
            <Link
                to="/restaurants"
                className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-700 text-sm font-medium mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" /> Back to Restaurants
            </Link>

            {/* Hero banner */}
            <div className="h-52 bg-linear-to-br from-indigo-100 via-indigo-50 to-slate-100 rounded-2xl flex items-center justify-center mb-8 border border-slate-200">
                <span className="text-8xl font-black text-indigo-200 select-none">
                    {restaurant.name.charAt(0).toUpperCase()}
                </span>
            </div>

            {/* Name and address */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">{restaurant.name}</h1>
                <p className="flex items-center gap-2 text-slate-500 mt-2 text-sm">
                    <MapPin className="w-4 h-4 shrink-0" />
                    {restaurant.address}
                </p>
            </div>

            {/* Info cards */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-white rounded-2xl border border-slate-200 p-5">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                        Coordinates
                    </p>
                    <div className="space-y-2.5">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500">Latitude</span>
                            <span className="font-medium text-slate-900 tabular-nums">{restaurant.latitude}</span>
                        </div>
                        <div className="h-px bg-slate-100" />
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500">Longitude</span>
                            <span className="font-medium text-slate-900 tabular-nums">{restaurant.longitude}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-5">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                        Details
                    </p>
                    <div className="space-y-2.5">
                        {restaurant.distance !== undefined && (
                            <>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="flex items-center gap-1.5 text-slate-500">
                                        <Navigation className="w-3.5 h-3.5 text-indigo-500" /> Distance
                                    </span>
                                    <span className="font-medium text-slate-900">{restaurant.distance} km</span>
                                </div>
                                <div className="h-px bg-slate-100" />
                            </>
                        )}
                        <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-1.5 text-slate-500">
                                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Listed
                            </span>
                            <span className="font-medium text-slate-900">
                                {new Date(restaurant.createdAt).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                })}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
                <Link
                    to={`/restaurants/${restaurant.id}/edit`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
                >
                    <Edit className="w-4 h-4" /> Edit Restaurant
                </Link>
            </div>
        </div>
    );
};

export default RestaurantDetailsPage;