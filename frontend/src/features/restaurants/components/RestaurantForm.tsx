import { useEffect } from "react";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";


import type {
    CreateRestaurantPayload,
} from "../types/restaurant.types";
import { createRestaurantSchema } from "../schemas/restaurant.schema";

interface RestaurantFormProps {
    defaultValues?: Partial<CreateRestaurantPayload>;

    isLoading?: boolean;

    onSubmit: (
        values: CreateRestaurantPayload
    ) => Promise<void> | void;
}

const RestaurantForm = ({
    defaultValues,
    isLoading = false,
    onSubmit,
}: RestaurantFormProps) => {
    const {
        register,

        handleSubmit,

        reset,

        formState: { errors },
    } = useForm<CreateRestaurantPayload>({
        resolver: zodResolver(
            createRestaurantSchema
        ),

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
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
        >
            {/* Name */}
            <div>
                <label className="block mb-1 font-medium">
                    Restaurant Name
                </label>

                <input
                    type="text"
                    placeholder="Enter restaurant name"
                    {...register("name")}
                    className="w-full border rounded-lg px-4 py-2"
                />

                {errors.name && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.name.message}
                    </p>
                )}
            </div>

            {/* Address */}
            <div>
                <label className="block mb-1 font-medium">
                    Address
                </label>

                <input
                    type="text"
                    placeholder="Enter address"
                    {...register("address")}
                    className="w-full border rounded-lg px-4 py-2"
                />

                {errors.address && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.address.message}
                    </p>
                )}
            </div>

            {/* Latitude */}
            <div>
                <label className="block mb-1 font-medium">
                    Latitude
                </label>

                <input
                    type="number"
                    step="any"
                    placeholder="31.5204"
                    {...register("latitude", {
                        valueAsNumber: true,
                    })}
                    className="w-full border rounded-lg px-4 py-2"
                />

                {errors.latitude && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.latitude.message}
                    </p>
                )}
            </div>

            {/* Longitude */}
            <div>
                <label className="block mb-1 font-medium">
                    Longitude
                </label>

                <input
                    type="number"
                    step="any"
                    placeholder="74.3587"
                    {...register("longitude", {
                        valueAsNumber: true,
                    })}
                    className="w-full border rounded-lg px-4 py-2"
                />

                {errors.longitude && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.longitude.message}
                    </p>
                )}
            </div>

            {/* Submit */}
            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white py-3 rounded-lg disabled:opacity-50"
            >
                {isLoading
                    ? "Submitting..."
                    : "Save Restaurant"}
            </button>
        </form>
    );
};

export default RestaurantForm;