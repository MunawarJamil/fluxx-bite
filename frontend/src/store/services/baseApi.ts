import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
    reducerPath: "api",

    baseQuery: fetchBaseQuery({
        baseUrl:
            import.meta.env.VITE_API_BASE_URL ||
            "http://localhost:5000/api/v1",

        credentials: "include",
    }),

    tagTypes: ["Restaurant"],

    endpoints: () => ({

    }),
});