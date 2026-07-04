import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { Container } from "./container/container";

const router = createBrowserRouter([
    { path: "/", element: <Navigate to="/1" replace /> },
    { path: "/:level", element: <Container /> },
]);

export const AppRouter = () => <RouterProvider router={router} />;
