import {
    useForm,
    type Resolver,
} from "react-hook-form";

import {
    zodResolver,
} from "@hookform/resolvers/zod";

import {
    createMenuItemSchema,
    updateMenuItemSchema,

    type CreateMenuItemPayload,
} from "../schemas/menuItem.schema";
import type { Category } from "../../categories/types/category.types";


interface MenuItemFormProps {
    categories: Category[];

    onSubmit: (
        data: CreateMenuItemPayload
    ) => Promise<void>;

    isLoading?: boolean;

    defaultValues?: Partial<CreateMenuItemPayload>;
    submitLabel?: string;
    isEdit?: boolean;
}

const MenuItemForm = ({
    categories,
    onSubmit,
    isLoading = false,
    defaultValues,
    submitLabel = "Create Menu Item",
    isEdit = false,
}: MenuItemFormProps) => {

    const {
        register,
        handleSubmit,

        formState: {
            errors,
        },
    } =
        useForm<CreateMenuItemPayload>({

            resolver: zodResolver(
                isEdit
                    ? updateMenuItemSchema
                    : createMenuItemSchema
            ) as Resolver<CreateMenuItemPayload>,

            defaultValues,
        });



    const handleFormSubmit =
        async (
            data: CreateMenuItemPayload
        ) => {
            await onSubmit(data);
        };

    return (
        <form
            onSubmit={handleSubmit(
                handleFormSubmit
            )}
            className="space-y-5"
        >
            {/* Name */}
            <div>
                <label className="block mb-2 text-sm font-medium">
                    Item Name
                </label>

                <input
                    type="text"

                    placeholder="e.g. Zinger Burger"

                    className="
            w-full
            rounded-xl
            border
            border-gray-300
            px-4
            py-3
            outline-none
            focus:ring-2
            focus:ring-black
          "

                    {...register("name")}
                />

                {errors.name && (
                    <p className="mt-1 text-sm text-red-500">
                        {
                            errors.name
                                .message
                        }
                    </p>
                )}
            </div>

            {/* Description */}
            <div>
                <label className="block mb-2 text-sm font-medium">
                    Description
                </label>

                <textarea
                    rows={4}

                    placeholder="Menu item description"

                    className="
            w-full
            rounded-xl
            border
            border-gray-300
            px-4
            py-3
            outline-none
            focus:ring-2
            focus:ring-black
          "

                    {...register(
                        "description"
                    )}
                />

                {errors.description && (
                    <p className="mt-1 text-sm text-red-500">
                        {
                            errors.description
                                .message
                        }
                    </p>
                )}
            </div>

            {/* Price */}
            <div>
                <label className="block mb-2 text-sm font-medium">
                    Price
                </label>

                <input
                    type="number"

                    step="0.01"

                    placeholder="499"

                    className="
            w-full
            rounded-xl
            border
            border-gray-300
            px-4
            py-3
            outline-none
            focus:ring-2
            focus:ring-black
          "

                    {...register(
                        "price",
                        {
                            valueAsNumber: true,
                        }
                    )}
                />

                {errors.price && (
                    <p className="mt-1 text-sm text-red-500">
                        {
                            errors.price
                                .message
                        }
                    </p>
                )}
            </div>

            {/* Category */}
            <div>
                <label className="block mb-2 text-sm font-medium">
                    Category
                </label>

                <select
                    className="
            w-full
            rounded-xl
            border
            border-gray-300
            px-4
            py-3
            outline-none
            focus:ring-2
            focus:ring-black
          "

                    {...register(
                        "categoryId"
                    )}
                >
                    <option value="">
                        Select category
                    </option>

                    {categories.map(
                        (category) => (
                            <option
                                key={
                                    category.id
                                }

                                value={
                                    category.id
                                }
                            >
                                {category.name}
                            </option>
                        )
                    )}
                </select>

                {errors.categoryId && (
                    <p className="mt-1 text-sm text-red-500">
                        {
                            errors
                                .categoryId
                                .message
                        }
                    </p>
                )}
            </div>

            {/* Availability */}
            <div className="flex items-center gap-3">
                <input
                    type="checkbox"

                    className="h-4 w-4"

                    {...register(
                        "isAvailable"
                    )}
                />

                <label className="text-sm font-medium">
                    Available
                </label>
            </div>

            {/* Submit */}
            <button
                type="submit"

                disabled={isLoading}

                className="
          w-full
          rounded-xl
          bg-black
          py-3
          text-white
          font-medium
          transition
          hover:opacity-90
          disabled:opacity-50
        "
            >
                {isLoading
                    ? "Saving..."
                    : submitLabel}
            </button>
        </form>
    );
};

export default MenuItemForm;