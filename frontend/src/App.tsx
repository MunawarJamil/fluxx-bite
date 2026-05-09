import { Routes, Route, Outlet } from "react-router-dom";

import Home from "./pages/Home";
import Profile from "./pages/Profile";

import MainLayout from "./components/layout/MainLayout";

import Login from "./features/auth/components/Login";
import RoleSelection from "./features/auth/components/RoleSelection";

import ProtectedRoute from "./features/auth/components/ProtectedRoute";
import PublicRoute from "./features/auth/components/PublicRoute";
import SellerRoute from "./features/auth/components/SellerRoute";

import RestaurantsPage from "./features/restaurants/pages/RestaurantsPage";
import CreateRestaurantPage from "./features/restaurants/pages/CreateRestaurantPage";
import UpdateRestaurantPage from "./features/restaurants/pages/UpdateRestaurantPage";
import RestaurantDetailsPage from "./features/restaurants/pages/RestaurantDetailsPage";
import NearbyRestaurantsPage from "./features/restaurants/pages/NearbyRestaurantsPage";
import SellerRestaurantPage from "./features/restaurants/pages/SellerRestaurantPage";
import CreateCategoryPage from "./features/categories/pages/CreateCategoryPage";
import UpdateCategoryPage from "./features/categories/pages/UpdateCategoryPage";
import CreateMenuItemPage from "./features/menu-items/pages/CreateMenuItemPage";
import UpdateMenuItemPage from "./features/menu-items/pages/UpdateMenuItemPage";

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

      {/* Main Layout */}
      <Route element={<MainLayout />}>
        {/* Public Pages */}
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/restaurants"
          element={
            <ProtectedRoute>
              <RestaurantsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/restaurants/:id"
          element={<RestaurantDetailsPage />}
        />

        <Route
          path="/nearby-restaurants"
          element={<NearbyRestaurantsPage />}
        />

        {/* Protected Routes */}
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

        {/* Seller Routes */}
        <Route
          element={
            <ProtectedRoute>
              <SellerRoute>
                <Outlet />
              </SellerRoute>
            </ProtectedRoute>
          }
        >
          <Route
            path="/restaurants/create"
            element={<CreateRestaurantPage />}
          />

          <Route
            path="/restaurants/:id/edit"
            element={<UpdateRestaurantPage />}
          />

          <Route
            path="/owner/restaurant"
            element={<SellerRestaurantPage />}
          />
        </Route>

        {/* Categories Routes */}
        <Route
          element={
            <ProtectedRoute>
              <SellerRoute>
                <Outlet />
              </SellerRoute>
            </ProtectedRoute>
          }
        >
          <Route
            path="/categories/create"
            element={<CreateCategoryPage />}
          />

          <Route
            path="/categories/:id/edit"
            element={
              <UpdateCategoryPage />
            }
          />


        </Route>


        <Route
          path="/menu-items/create"
          element={
            <CreateMenuItemPage />
          }
        />

        <Route
          path="/menu-items/:id/edit"
          element={
            <UpdateMenuItemPage />
          }
        />





      </Route>

      {/* Role Selection */}
      <Route
        path="/select-role"
        element={
          <ProtectedRoute>
            <RoleSelection />
          </ProtectedRoute>
        }
      />
    </Routes >
  );
}

export default App;