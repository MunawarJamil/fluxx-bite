import { Routes, Route, Outlet } from "react-router-dom";

import Home from "./pages/Home";

import Login from "./features/auth/components/Login";

import RoleSelection from "./features/auth/components/RoleSelection";

import ProtectedRoute from "./features/auth/components/ProtectedRoute";

import PublicRoute from "./features/auth/components/PublicRoute";

import RestaurantsPage from "./features/restaurants/pages/RestaurantsPage";

import MainLayout from "./components/layout/MainLayout";

import Profile from "./pages/Profile";

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