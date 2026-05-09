import MenuItemCard from "./MenuItemCard";

import type {
    MenuItem,
} from "../types/menuItem.types";

interface MenuItemListProps {
    menuItems: MenuItem[];
}

const MenuItemList = ({
    menuItems,
}: MenuItemListProps) => {

    if (
        menuItems.length === 0
    ) {
        return (
            <div
                className="
          rounded-2xl
          border
          border-dashed
          border-gray-300
          p-10
          text-center
        "
            >
                <h3 className="text-lg font-semibold">
                    No Menu Items Yet
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                    Create your first menu
                    item to start selling.
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-4">
            {menuItems.map(
                (menuItem) => (
                    <MenuItemCard
                        key={menuItem.id}
                        menuItem={menuItem}
                    />
                )
            )}
        </div>
    );
};

export default MenuItemList;