export interface Restaurant {
    id: string;

    name: string;
    address: string;

    latitude: number;
    longitude: number;

    distance?: number;

    createdAt: string;
}

export interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface NearbyRestaurantsResponse {
    success: boolean;
    message: string;

    data: Restaurant[];

    pagination: Pagination;
}

export interface GetNearbyRestaurantsParams {
    lat: number;
    lng: number;

    radius?: number;

    page?: number;
    limit?: number;
}

// For create restaurant (registered user)
export interface CreateRestaurantPayload {
    name: string;

    address: string;

    latitude: number;
    longitude: number;
}

export interface CreateRestaurantResponse {
    success: boolean;

    message: string;

    data: Restaurant;
}

export interface RestaurantResponse {
    success: boolean;
    message: string;
    data: Restaurant;
}

export interface GetRestaurantByIdParams {
    id: string;
}

export interface UpdateRestaurantPayload {
    name?: string;

    address?: string;

    latitude?: number;

    longitude?: number;
}


export interface DeleteRestaurantResponse {
    success: boolean;

    message: string;
}

export interface GetAllRestaurantsParams {
    page?: number;

    limit?: number;
}

export interface RestaurantsListResponse {
    success: boolean;
    message: string;
    data: Restaurant[];
    pagination: Pagination;
}
