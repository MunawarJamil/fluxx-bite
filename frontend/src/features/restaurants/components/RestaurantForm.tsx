import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CreateRestaurantPayload } from "../types/restaurant.types";
import { createRestaurantSchema } from "../schemas/restaurant.schema";

interface RestaurantFormProps {
    defaultValues?: Partial<CreateRestaurantPayload>;
    isLoading?: boolean;
    onSubmit: (values: CreateRestaurantPayload) => Promise<void> | void;
}

const RestaurantForm = ({ defaultValues, isLoading = false, onSubmit }: RestaurantFormProps) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateRestaurantPayload>({
        resolver: zodResolver(createRestaurantSchema),
        defaultValues: {
            name: "",
            address: "",
            latitude: 0,
            longitude: 0,
            ...defaultValues,
        },
    });

    useEffect(() => {
        if (defaultValues) {
            reset(defaultValues);
        }
    }, [defaultValues, reset]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Restaurant Name
                </label>
                <input
                    type="text"
                    placeholder="e.g. The Burger House"
                    {...register("name")}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
                {errors.name && (
                    <p className="text-red-500 text-xs mt-1.5">{errors.name.message}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Address
                </label>
                <input
                    type="text"
                    placeholder="e.g. 123 Main St, Lahore"
                    {...register("address")}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
                {errors.address && (
                    <p className="text-red-500 text-xs mt-1.5">{errors.address.message}</p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Latitude
                    </label>
                    <input
                        type="number"
                        step="any"
                        placeholder="31.5204"
                        {...register("latitude", { valueAsNumber: true })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    />
                    {errors.latitude && (
                        <p className="text-red-500 text-xs mt-1.5">{errors.latitude.message}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Longitude
                    </label>
                    <input
                        type="number"
                        step="any"
                        placeholder="74.3587"
                        {...register("longitude", { valueAsNumber: true })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    />
                    {errors.longitude && (
                        <p className="text-red-500 text-xs mt-1.5">{errors.longitude.message}</p>
                    )}
                </div>
            </div>

            <div className="pt-2">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? "Saving..." : "Save Restaurant"}
                </button>
            </div>
        </form>
    );
};

export default RestaurantForm;
