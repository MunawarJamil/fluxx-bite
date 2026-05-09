import { Link } from "react-router-dom";

import toast from "react-hot-toast";

import {
    useDeleteCategory,
} from "../hooks/useCategories";

import type {
    Category,
} from "../types/category.types";

interface CategoryCardProps {
    category: Category;
}

const CategoryCard = ({
    category,
}: CategoryCardProps) => {

    const {
        deleteCategory,
        isLoading,
    } = useDeleteCategory();

    const handleDelete =
        async () => {

            const confirmed =
                window.confirm(
                    "Are you sure you want to delete this category?"
                );

            if (!confirmed) {
                return;
            }

            try {

                await deleteCategory(
                    category.id
                );

                toast.success(
                    "Category deleted successfully"
                );

            } catch (error: any) {

                toast.error(
                    error?.data?.message ||
                    "Failed to delete category"
                );
            }
        };

    return (
        <div className="w-44 shrink-0 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-3 hover:shadow-md hover:border-indigo-200 transition-all duration-200 group">
            {/* Icon */}
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                <span className="text-lg font-black text-indigo-400 select-none">
                    {category.name.charAt(0).toUpperCase()}
                </span>
            </div>

            {/* Name */}
            <div className="flex-1">
                <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 leading-snug">
                    {category.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                    {new Date(category.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                    })}
                </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5">
                <Link
                    to={`/categories/${category.id}/edit`}
                    className="flex-1 text-center py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50 transition-colors"
                >
                    Edit
                </Link>
                <button
                    onClick={handleDelete}
                    disabled={isLoading}
                    className="flex-1 py-1.5 rounded-lg bg-red-50 border border-red-100 text-red-600 text-xs font-medium hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? "..." : "Delete"}
                </button>
            </div>
        </div>
    );
};

export default CategoryCard;