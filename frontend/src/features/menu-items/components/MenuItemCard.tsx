import { Link } from "react-router-dom";

import toast from "react-hot-toast";


import type {
    MenuItem,
} from "../types/menuItem.types";
import { useDeleteMenuItem, useToggleMenuItemAvailability } from "../hooks/useMenu";

interface MenuItemCardProps {
    menuItem: MenuItem;
}

const MenuItemCard = ({
    menuItem,
}: MenuItemCardProps) => {

    const {
        deleteMenuItem,
        isLoading:
        isDeleting,
    } =
        useDeleteMenuItem();

    const {
        toggleAvailability,
        isLoading:
        isToggling,
    } =
        useToggleMenuItemAvailability();

    const handleDelete =
        async () => {

            const confirmed =
                window.confirm(
                    "Are you sure you want to delete this menu item?"
                );

            if (!confirmed) {
                return;
            }

            try {

                await deleteMenuItem(
                    menuItem.id
                );

                toast.success(
                    "Menu item deleted successfully"
                );

            } catch (error: any) {

                toast.error(
                    error?.data?.message ||
                    "Failed to delete menu item"
                );
            }
        };

    const handleToggle =
        async () => {

            try {

                await toggleAvailability(
                    menuItem.id,
                    !menuItem.isAvailable
                );

                toast.success(
                    `Menu item marked as ${!menuItem.isAvailable
                        ? "available"
                        : "unavailable"
                    }`
                );

            } catch (error: any) {

                toast.error(
                    error?.data?.message ||
                    "Failed to update availability"
                );
            }
        };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
            <div className="flex items-stretch gap-0">
                {/* Left color accent bar */}
                <div className={`w-1 shrink-0 rounded-l-2xl ${menuItem.isAvailable ? "bg-emerald-400" : "bg-slate-300"}`} />

                {/* Content */}
                <div className="flex-1 p-4 min-w-0">
                    {/* Top row: badges */}
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600 border border-indigo-100">
                            {menuItem.category.name}
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                            menuItem.isAvailable
                                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                : "bg-slate-100 text-slate-500 border-slate-200"
                        }`}>
                            {menuItem.isAvailable ? "Available" : "Unavailable"}
                        </span>
                    </div>

                    {/* Name & description */}
                    <h3 className="text-sm font-semibold text-slate-900 line-clamp-1">
                        {menuItem.name}
                    </h3>
                    {menuItem.description && (
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                            {menuItem.description}
                        </p>
                    )}

                    {/* Price & actions row */}
                    <div className="flex items-center justify-between gap-3 mt-3 flex-wrap">
                        <span className="text-base font-bold text-slate-900 tabular-nums">
                            PKR {Number(menuItem.price).toLocaleString()}
                        </span>

                        <div className="flex items-center gap-1.5">
                            <Link
                                to={`/menu-items/${menuItem.id}/edit`}
                                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50 transition-colors"
                            >
                                Edit
                            </Link>
                            <button
                                onClick={handleToggle}
                                disabled={isToggling}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                                    menuItem.isAvailable
                                        ? "bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100"
                                        : "bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                                }`}
                            >
                                {isToggling ? "..." : menuItem.isAvailable ? "Disable" : "Enable"}
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="px-3 py-1.5 rounded-lg bg-red-50 border border-red-100 text-red-600 text-xs font-medium hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isDeleting ? "..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Image */}
                <div className="shrink-0 p-3 pl-0 flex items-center">
                    {menuItem.imageUrl ? (
                        <img
                            src={menuItem.imageUrl}
                            alt={menuItem.name}
                            className="h-20 w-20 rounded-xl object-cover border border-slate-100"
                        />
                    ) : (
                        <div className="h-20 w-20 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                            <span className="text-2xl font-black text-slate-200 select-none">
                                {menuItem.name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MenuItemCard;