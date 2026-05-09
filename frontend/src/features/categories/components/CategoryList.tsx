import CategoryCard from "./CategoryCard";

import type {
    Category,
} from "../types/category.types";

interface CategoryListProps {
    categories: Category[];
}



const CategoryList = ({
    categories,
}: CategoryListProps) => {

    if (categories.length === 0) {
        return (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 p-10 text-center">
                <h3 className="text-sm font-semibold text-slate-700">No Categories Yet</h3>
                <p className="mt-1 text-xs text-slate-400">
                    Create your first category to organize menu items.
                </p>
            </div>
        );
    }

    return (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
            ))}
        </div>
    );
};

export default CategoryList;