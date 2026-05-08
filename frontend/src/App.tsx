import { Routes, Route, Outlet } from "react-router-dom";

import Home from "./pages/Home";

import Login from "./features/auth/components/Login";

import RoleSelection from "./features/auth/components/RoleSelection";

import ProtectedRoute from "./features/auth/components/ProtectedRoute";

import PublicRoute from "./features/auth/components/PublicRoute";

import RestaurantsPage from "./features/restaurants/pages/RestaurantsPage";

import MainLayout from "./components/layout/MainLayout";

import Profile from "./pages/Profile";
import CreateRestaurantPage from "./features/restaurants/pages/CreateRestaurantPage";
import UpdateRestaurantPage from "./features/restaurants/pages/UpdateRestaurantPage";
import RestaurantDetailsPage from "./features/restaurants/pages/RestaurantDetailsPage";
import NearbyRestaurantsPage from "./features/restaurants/pages/NearbyRestaurantsPage";
import SellerRestaurantPage from "./features/restaurants/pages/SellerRestaurantPage";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* Public Layout Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />

        {/* Restaurants */}
        <Route
          path="/restaurants"
          element={<RestaurantsPage />}
        />

        {/* Create Restaurant */}
        <Route
          path="/restaurants/create"
          element={<CreateRestaurantPage />}
        />

        {/* Update Restaurant */}
        <Route
          path="/restaurants/:id/edit"
          element={<UpdateRestaurantPage />}
        />

        <Route
          path="/restaurants/:id"
          element={<RestaurantDetailsPage />}
        />



        <Route
          path="/seller/restaurant"
          element={<SellerRestaurantPage />}
        />
        {/* Nearby Restaurants */}
        <Route
          path="/nearby-restaurants"
          element={<NearbyRestaurantsPage />}
        />

        {/* Protected Routes within MainLayout */}
        <Route
          element={
            <ProtectedRoute>
              <Outlet />
            </ProtectedRoute>
          }
        >
          <Route
            path="/profile"
            element={<Profile />}
          />
        </Route>
      </Route>

      {/* Specialized Protected Routes */}
      <Route
        path="/select-role"
        element={
          <ProtectedRoute>
            <RoleSelection />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;