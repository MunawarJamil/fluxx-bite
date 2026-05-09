import { useCreateCategoryMutation, useDeleteCategoryMutation, useGetCategoriesQuery, useUpdateCategoryMutation } from "../api/category.api";

export const useCreateCategory = () => {

    const [
        createCategory,
        query,
    ] = useCreateCategoryMutation();

    const handleCreateCategory =
        async (
            restaurantId: string,
            payload: {
                name: string;
            }
        ) => {

            return await createCategory({
                restaurantId,
                payload,
            }).unwrap();
        };

    return {
        createCategory:
            handleCreateCategory,

        isLoading:
            query.isLoading,

        isError:
            query.isError,

        error:
            query.error,

        isSuccess:
            query.isSuccess,
    };
};

export const useGetCategories = (
    restaurantId: string,
    page = 1,
    limit = 10
) => {

    const query =
        useGetCategoriesQuery({
            restaurantId,
            page,
            limit,
        });

    return {
        categories:
            query.data?.data || [],

        pagination:
            query.data?.pagination,

        isLoading:
            query.isLoading,

        isError:
            query.isError,

        error:
            query.error,

        refetch:
            query.refetch,
    };
};


export const useUpdateCategory = () => {

    const [
        updateCategory,
        query,
    ] = useUpdateCategoryMutation();

    const handleUpdateCategory =
        async (
            categoryId: string,
            payload: {
                name: string;
            }
        ) => {

            return await updateCategory({
                categoryId,
                payload,
            }).unwrap();
        };

    return {
        updateCategory:
            handleUpdateCategory,

        isLoading:
            query.isLoading,

        isError:
            query.isError,

        error:
            query.error,

        isSuccess:
            query.isSuccess,
    };
};


export const useDeleteCategory = () => {

    const [
        deleteCategory,
        query,
    ] = useDeleteCategoryMutation();

    const handleDeleteCategory =
        async (
            categoryId: string
        ) => {

            return await deleteCategory(
                categoryId
            ).unwrap();
        };

    return {
        deleteCategory:
            handleDeleteCategory,

        isLoading:
            query.isLoading,

        isError:
            query.isError,

        error:
            query.error,

        isSuccess:
            query.isSuccess,
    };
};
