import { Link } from "react-router-dom";

import type {
    Restaurant,
} from "../types/restaurant.types";

interface RestaurantCardProps {
    restaurant: Restaurant;

    showActions?: boolean;

    onDelete?: (
        id: string
    ) => void;
}

const RestaurantCard = ({
    restaurant,

    showActions = false,

    onDelete,
}: RestaurantCardProps) => {
    return (
        <div className="border rounded-2xl p-5 shadow-sm hover:shadow-md transition">
            {/* Header */}
            <div className="mb-3">
                <h2 className="text-xl font-semibold">
                    {restaurant.name}
                </h2>

                <p className="text-gray-600 text-sm mt-1">
                    {restaurant.address}
                </p>
            </div>

            {/* Distance */}
            {restaurant.distance !==
                undefined && (
                    <p className="text-sm text-gray-500 mb-4">
                        Distance:{" "}
                        {restaurant.distance} km
                    </p>
                )}

            {/* Actions */}
            <div className="flex items-center gap-3">
                <Link
                    to={`/restaurants/${restaurant.id}`}
                    className="px-4 py-2 rounded-lg border text-sm"
                >
                    View Details
                </Link>

                {showActions && (
                    <>
                        <Link
                            to={`/restaurants/${restaurant.id}/edit`}
                            className="px-4 py-2 rounded-lg bg-black text-white text-sm"
                        >
                            Edit
                        </Link>

                        <button
                            onClick={() =>
                                onDelete?.(
                                    restaurant.id
                                )
                            }
                            className="px-4 py-2 rounded-lg border border-red-500 text-red-500 text-sm"
                        >
                            Delete
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default RestaurantCard;