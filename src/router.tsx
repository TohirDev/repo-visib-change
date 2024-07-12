import React, { Suspense } from "react";
import { Navigate, useRoutes } from "react-router-dom";

const SaveUser = React.lazy(() => import("./pages/SaveUser"));
const ChangeVisib = React.lazy(() => import("./pages/ChangeVisib"));

export const Router = () => {
  const router = useRoutes([
    {
      path: "/",
      element: <Navigate to="/change-visib" />,
    },
    {
      path: "/save-user",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <SaveUser />
        </Suspense>
      ),
    },
    {
      path: "/change-visib",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <ChangeVisib />
        </Suspense>
      ),
    },
  ]);

  return router;
};
