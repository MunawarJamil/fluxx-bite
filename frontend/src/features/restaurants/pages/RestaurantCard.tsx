import { Link } from "react-router-dom";
import { MapPin, Navigation } from "lucide-react";
import type { Restaurant } from "../types/restaurant.types";

interface RestaurantCardProps {
    restaurant: Restaurant;
    showActions?: boolean;
    onDelete?: (id: string) => void;
}

const RestaurantCard = ({ restaurant, showActions = false, onDelete }: RestaurantCardProps) => {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col">
            {/* Image placeholder */}
            <div className="h-36 bg-linear-to-br from-indigo-50 to-slate-100 flex items-center justify-center shrink-0">
                <span className="text-5xl font-black text-indigo-200 select-none">
                    {restaurant.name.charAt(0).toUpperCase()}
                </span>
            </div>

            <div className="p-5 flex flex-col flex-1">
                <h2 className="font-semibold text-slate-900 text-base leading-snug line-clamp-1">
                    {restaurant.name}
                </h2>

                <p className="flex items-center gap-1.5 text-slate-500 text-sm mt-1.5 line-clamp-1">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    {restaurant.address}
                </p>

                {restaurant.distance !== undefined && (
                    <p className="flex items-center gap-1.5 text-indigo-600 text-xs font-medium mt-2">
                        <Navigation className="w-3 h-3" />
                        {restaurant.distance} km away
                    </p>
                )}

                <div className="flex items-center gap-2 mt-auto pt-4">
                    <Link
                        to={`/restaurants/${restaurant.id}`}
                        className="flex-1 text-center px-3 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-50 transition-colors"
                    >
                        View Details
                    </Link>

                    {showActions && (
                        <>
                            <Link
                                to={`/restaurants/${restaurant.id}/edit`}
                                className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition-colors"
                            >
                                Edit
                            </Link>
                            <button
                                onClick={() => onDelete?.(restaurant.id)}
                                className="px-3 py-2 rounded-xl border border-red-200 text-red-600 text-xs font-medium hover:bg-red-50 transition-colors"
                            >
                                Delete
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RestaurantCard;