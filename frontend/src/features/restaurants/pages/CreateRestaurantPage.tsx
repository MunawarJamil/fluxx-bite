import { useNavigate, Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import RestaurantForm from "../components/RestaurantForm";
import { useCreateRestaurant } from "../hooks/useRestaurants";
import type { CreateRestaurantPayload } from "../types/restaurant.types";

const CreateRestaurantPage = () => {
    const navigate = useNavigate();
    const { createRestaurant, isLoading } = useCreateRestaurant();

    const handleSubmit = async (values: CreateRestaurantPayload) => {
        try {
            const response = await createRestaurant(values);
            toast.success(response.message || "Restaurant created successfully");
            navigate("/restaurants");
        } catch (error: any) {
            console.error(error);
            toast.error(error?.data?.message || "Failed to create restaurant");
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8 sm:px-6">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-sm text-slate-500 mb-8">
                <Link to="/owner/restaurant" className="hover:text-slate-700 transition-colors">
                    Dashboard
                </Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-slate-900 font-medium">Create Restaurant</span>
            </nav>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Create Restaurant</h1>
                <p className="text-slate-500 text-sm mt-1">
                    Fill in the details to list your restaurant on Fluxx-Bite.
                </p>
            </div>

            {/* Form card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <RestaurantForm onSubmit={handleSubmit} isLoading={isLoading} />
            </div>
        </div>
    );
};

export default CreateRestaurantPage;