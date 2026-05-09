import axios from "axios";

export const restaurantApi = axios.create({
    baseURL:
        import.meta.env.VITE_RESTAURANT_API_URL ||
        "http://localhost:5001/api/v1",

    withCredentials: true,

    timeout: 10000,

    headers: {
        "Content-Type": "application/json",
    },
});


restaurantApi.interceptors.response.use(
    (response) => response,

    (error) => {

        if (error.response?.status === 401) {

            window.location.href = "/login";

            return Promise.reject(error);
        }

        return Promise.reject(error);
    }
);
