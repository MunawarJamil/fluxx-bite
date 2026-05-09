import { useNavigate, useParams, Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import RestaurantForm from "../components/RestaurantForm";
import { useRestaurant, useUpdateRestaurant } from "../hooks/useRestaurants";
import type { CreateRestaurantPayload } from "../types/restaurant.types";

const UpdateRestaurantPage = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { restaurant, isLoading: isRestaurantLoading, isError } = useRestaurant(id || "");
    const { updateRestaurant, isLoading: isUpdating } = useUpdateRestaurant();

    const handleSubmit = async (values: CreateRestaurantPayload) => {
        if (!id) return;
        try {
            const response = await updateRestaurant(id, values);
            toast.success(response.message || "Restaurant updated successfully");
            navigate("/restaurants");
        } catch (error: any) {
            console.error(error);
            toast.error(error?.data?.message || "Failed to update restaurant");
        }
    };

    if (isRestaurantLoading) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-8 sm:px-6">
                <div className="animate-pulse space-y-6">
                    <div className="h-4 w-48 bg-slate-200 rounded-xl" />
                    <div className="h-8 w-56 bg-slate-200 rounded-xl" />
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="space-y-1.5">
                                <div className="h-3.5 w-28 bg-slate-200 rounded" />
                                <div className="h-10 bg-slate-100 rounded-xl" />
                            </div>
                        ))}
                        <div className="h-10 bg-slate-200 rounded-xl" />
                    </div>
                </div>
            </div>
        );
    }

    if (isError || !restaurant) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-8 sm:px-6">
                <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                    <p className="text-red-600 font-medium">Failed to load restaurant.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-8 sm:px-6">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-sm text-slate-500 mb-8">
                <Link to="/owner/restaurant" className="hover:text-slate-700 transition-colors">
                    Dashboard
                </Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-slate-900 font-medium">Edit Restaurant</span>
            </nav>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Edit Restaurant</h1>
                <p className="text-slate-500 text-sm mt-1">
                    Update the details for <span className="font-medium text-slate-700">{restaurant.name}</span>.
                </p>
            </div>

            {/* Form card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <RestaurantForm
                    defaultValues={{
                        name: restaurant.name,
                        address: restaurant.address,
                        latitude: restaurant.latitude,
                        longitude: restaurant.longitude,
                    }}
                    onSubmit={handleSubmit}
                    isLoading={isUpdating}
                />
            </div>
        </div>
    );
};

export default UpdateRestaurantPage;