const CategorySkeleton =
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
                <div className="h-5 w-40 rounded bg-gray-200" />

                <div className="mt-3 h-4 w-28 rounded bg-gray-100" />
            </div>
        );
    };

export default
    CategorySkeleton;