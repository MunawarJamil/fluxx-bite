const MenuItemSkeleton =
    () => {

        return (
            <div
                className="
          animate-pulse
          rounded-2xl
          border
          border-gray-200
          bg-white
          p-5
        "
            >
                <div className="flex justify-between gap-4">
                    <div className="flex-1">
                        <div className="h-5 w-40 rounded bg-gray-200" />

                        <div className="mt-3 h-4 w-full rounded bg-gray-100" />

                        <div className="mt-2 h-4 w-3/4 rounded bg-gray-100" />

                        <div className="mt-4 h-5 w-20 rounded bg-gray-200" />
                    </div>

                    <div className="h-24 w-24 rounded-xl bg-gray-200" />
                </div>
            </div>
        );
    };

export default
    MenuItemSkeleton;