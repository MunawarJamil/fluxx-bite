import {
    useForm,
} from "react-hook-form";

import {
    zodResolver,
} from "@hookform/resolvers/zod";

import {
    createCategorySchema,
    type CreateCategoryPayload,
} from "../schemas/category.schema";

interface CategoryFormProps {
    onSubmit: (
        data: CreateCategoryPayload
    ) => Promise<void>;

    isLoading?: boolean;

    defaultValues?: Partial<CreateCategoryPayload>;
}

const CategoryForm = ({
    onSubmit,
    isLoading = false,
    defaultValues,
}: CategoryFormProps) => {

    const {
        register,
        handleSubmit,
        reset,

        formState: {
            errors,
        },
    } =
        useForm<CreateCategoryPayload>({
            resolver:
                zodResolver(
                    createCategorySchema
                ),

            defaultValues,
        });

    const handleFormSubmit =
        async (
            data: CreateCategoryPayload
        ) => {

            await onSubmit(data);

            reset();
        };

    return (
        <form
            onSubmit={handleSubmit(
                handleFormSubmit
            )}
            className="space-y-5"
        >
            {/* Category Name */}
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                    Category Name
                </label>

                <input
                    type="text"

                    placeholder="e.g. Burgers"

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
                    ? "Creating..."
                    : "Create Category"}
            </button>
        </form>
    );
};

export default CategoryForm;