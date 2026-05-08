import React from "react";

import {
    Navigate,
} from "react-router-dom";

import { useAuth }
    from "../hooks/useAuth";

interface Props {
    children: React.ReactNode;
}

const SellerRoute = ({
    children,
}: Props) => {

    const { user } =
        useAuth();

    if (
        user?.role !== "seller"
    ) {
        return (
            <Navigate
                to="/unauthorized"
                replace
            />
        );
    }

    return <>{children}</>;
};

export default SellerRoute;