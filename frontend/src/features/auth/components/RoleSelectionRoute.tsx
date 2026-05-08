import React from "react";

import {
    Navigate,
} from "react-router-dom";

import { useAuth }
    from "../hooks/useAuth";

interface Props {
    children: React.ReactNode;
}

const RoleSelectionRoute = ({
    children,
}: Props) => {

    const { user } =
        useAuth();

    if (user?.role) {
        return (
            <Navigate
                to="/"
                replace
            />
        );
    }

    return <>{children}</>;
};

export default
    RoleSelectionRoute;